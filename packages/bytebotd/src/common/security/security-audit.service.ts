import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface SecurityFinding {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  recommendation: string;
  detectedAt: Date;
}

export interface SecurityReport {
  timestamp: Date;
  findings: SecurityFinding[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

@Injectable()
export class SecurityAuditService {
  private readonly logger = new Logger(SecurityAuditService.name);
  private securityFindings: SecurityFinding[] = [];

  async performSecurityAudit(): Promise<SecurityReport> {
    this.logger.log('Starting security audit');

    const findings: SecurityFinding[] = [];

    // Check for common security issues
    const filePermissionFindings = await this.checkFilePermissions();
    findings.push(...filePermissionFindings);

    const processFindings = await this.checkRunningProcesses();
    findings.push(...processFindings);

    const networkFindings = await this.checkNetworkSecurity();
    findings.push(...networkFindings);

    const systemFindings = await this.checkSystemConfiguration();
    findings.push(...systemFindings);

    // Update internal findings
    this.securityFindings = [...this.securityFindings, ...findings];

    // Create summary
    const summary = {
      critical: findings.filter(f => f.severity === 'critical').length,
      high: findings.filter(f => f.severity === 'high').length,
      medium: findings.filter(f => f.severity === 'medium').length,
      low: findings.filter(f => f.severity === 'low').length,
    };

    const report: SecurityReport = {
      timestamp: new Date(),
      findings,
      summary,
    };

    this.logger.log(`Security audit completed. Findings: ${findings.length}`);
    return report;
  }

  private async checkFilePermissions(): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = [];

    try {
      // Check for world-writable files in critical directories
      const { stdout } = await execAsync(
        "find /etc /usr/bin /usr/sbin -perm -002 -type f 2>/dev/null | head -10",
      );

      if (stdout.trim()) {
        findings.push({
          id: `file-perm-${Date.now()}`,
          severity: 'high',
          category: 'File Permissions',
          description: 'World-writable files found in system directories',
          recommendation: 'Review and correct file permissions',
          detectedAt: new Date(),
        });
      }
    } catch (error) {
      // Ignore errors in permission check
    }

    return findings;
  }

  private async checkRunningProcesses(): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = [];

    try {
      // Check for processes running as root that shouldn't be
      const { stdout } = await execAsync(
        "ps aux | grep root | grep -v 'systemd\\|sshd\\|cron' | head -5",
      );

      if (stdout.trim()) {
        findings.push({
          id: `root-process-${Date.now()}`,
          severity: 'medium',
          category: 'Process Security',
          description: 'Non-system processes running as root detected',
          recommendation: 'Review processes running with root privileges',
          detectedAt: new Date(),
        });
      }
    } catch (error) {
      // Ignore errors in process check
    }

    return findings;
  }

  private async checkNetworkSecurity(): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = [];

    try {
      // Check for open ports that might be security risks
      const { stdout } = await execAsync(
        "netstat -tuln | grep LISTEN | grep -v ':22\\|:53\\|:80\\|:443' | head -5",
      );

      if (stdout.trim()) {
        findings.push({
          id: `open-ports-${Date.now()}`,
          severity: 'medium',
          category: 'Network Security',
          description: 'Unusual open ports detected',
          recommendation: 'Review and close unnecessary open ports',
          detectedAt: new Date(),
        });
      }
    } catch (error) {
      // Ignore errors in network check
    }

    return findings;
  }

  private async checkSystemConfiguration(): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = [];

    try {
      // Check if firewall is enabled
      const { stdout } = await execAsync(
        "systemctl is-active ufw 2>/dev/null || echo 'inactive'",
      );

      if (stdout.trim() === 'inactive') {
        findings.push({
          id: `firewall-${Date.now()}`,
          severity: 'high',
          category: 'System Configuration',
          description: 'Firewall is not active',
          recommendation: 'Enable and configure system firewall',
          detectedAt: new Date(),
        });
      }
    } catch (error) {
      // Ignore errors in system check
    }

    return findings;
  }

  async getSecurityFindings(): Promise<SecurityFinding[]> {
    return [...this.securityFindings];
  }

  async getLatestSecurityReport(): Promise<SecurityReport | null> {
    if (this.securityFindings.length === 0) {
      return null;
    }

    const recentFindings = this.securityFindings.slice(-50); // Last 50 findings

    const summary = {
      critical: recentFindings.filter(f => f.severity === 'critical').length,
      high: recentFindings.filter(f => f.severity === 'high').length,
      medium: recentFindings.filter(f => f.severity === 'medium').length,
      low: recentFindings.filter(f => f.severity === 'low').length,
    };

    return {
      timestamp: new Date(),
      findings: recentFindings,
      summary,
    };
  }

  async clearSecurityFindings(): Promise<void> {
    this.securityFindings = [];
    this.logger.log('Security findings cleared');
  }
}