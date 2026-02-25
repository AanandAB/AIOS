import { Injectable, Logger } from '@nestjs/common';
import { LoggingService } from '../logging/logging.service';
import { SecurityAuditService } from '../security/security-audit.service';
import { EnvironmentConfigService } from '../config/environment.config';

export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  uptime: number;
  timestamp: Date;
}

export interface ApplicationHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  metrics: SystemMetrics;
  securityReport?: any;
  recentLogs: any[];
}

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor(
    private readonly loggingService: LoggingService,
    private readonly securityAuditService: SecurityAuditService,
    private readonly configService: EnvironmentConfigService,
  ) {
    this.startMonitoring();
  }

  private startMonitoring(): void {
    const interval = this.configService.securityAuditInterval * 60 * 1000; // Convert to milliseconds
    
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.performRegularMonitoring();
      } catch (error) {
        this.logger.error(`Error in monitoring cycle: ${error.message}`);
      }
    }, interval);

    // Run initial monitoring after 5 seconds
    setTimeout(() => {
      this.performRegularMonitoring().catch(error => {
        this.logger.error(`Error in initial monitoring: ${error.message}`);
      });
    }, 5000);
  }

  private async performRegularMonitoring(): Promise<void> {
    this.logger.debug('Performing regular system monitoring');

    // Perform security audit if enabled
    if (this.configService.enableSecurityAudit) {
      try {
        const securityReport = await this.securityAuditService.performSecurityAudit();
        this.logger.log(`Security audit completed: ${securityReport.findings.length} findings`);
      } catch (error) {
        this.logger.error(`Security audit failed: ${error.message}`);
      }
    }

    // Log system metrics
    const metrics = await this.collectSystemMetrics();
    this.logger.debug(`System metrics: CPU ${metrics.cpu}%, Memory ${metrics.memory}%, Disk ${metrics.disk}%`);

    this.logger.debug('Regular monitoring cycle completed');
  }

  private async collectSystemMetrics(): Promise<SystemMetrics> {
    // In a real implementation, this would collect actual system metrics
    // For now, we'll simulate with random values
    return {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      disk: Math.random() * 100,
      uptime: process.uptime(),
      timestamp: new Date(),
    };
  }

  async getApplicationHealth(): Promise<ApplicationHealth> {
    try {
      const metrics = await this.collectSystemMetrics();
      const recentLogs = await this.loggingService.getLogs(50);
      const securityReport = await this.securityAuditService.getLatestSecurityReport();

      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

      // Determine health status based on metrics and security findings
      if (metrics.cpu > 90 || metrics.memory > 90) {
        status = 'degraded';
      }

      if (securityReport && (securityReport.summary.critical > 0 || securityReport.summary.high > 2)) {
        status = 'unhealthy';
      }

      return {
        status,
        timestamp: new Date(),
        metrics,
        securityReport,
        recentLogs,
      };
    } catch (error) {
      this.logger.error(`Error getting application health: ${error.message}`);
      throw error;
    }
  }

  async getSystemMetrics(): Promise<SystemMetrics> {
    return await this.collectSystemMetrics();
  }

  async forceSecurityAudit(): Promise<any> {
    return await this.securityAuditService.performSecurityAudit();
  }

  onModuleDestroy() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
  }
}