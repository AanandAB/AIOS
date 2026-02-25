import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MonitoringService } from './monitoring.service';

@Controller('monitoring')
export class MonitoringController {
  private readonly logger = new Logger(MonitoringController.name);

  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('health')
  async getHealth() {
    this.logger.debug('Health check requested');
    return await this.monitoringService.getApplicationHealth();
  }

  @Get('metrics')
  async getMetrics() {
    this.logger.debug('Metrics requested');
    return await this.monitoringService.getSystemMetrics();
  }

  @Get('logs')
  @UseGuards(AuthGuard('jwt'))
  async getLogs() {
    this.logger.debug('Logs requested');
    // This would be implemented in the logging service
    return { message: 'Logs endpoint' };
  }

  @Get('security/audit')
  @UseGuards(AuthGuard('jwt'))
  async performSecurityAudit() {
    this.logger.debug('Security audit requested');
    return await this.monitoringService.forceSecurityAudit();
  }
}