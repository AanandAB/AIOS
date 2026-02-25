import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface SystemIssue {
  id: string;
  type: 'performance' | 'security' | 'stability' | 'maintenance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: number;
  resolved: boolean;
  resolution?: string;
}

export interface ProactiveSolution {
  issueId: string;
  action: string;
  priority: number;
  estimatedTime: number; // in minutes
  automated: boolean;
}

@Injectable()
export class ProactiveProblemSolverService {
  private readonly logger = new Logger(ProactiveProblemSolverService.name);
  private detectedIssues: Map<string, SystemIssue> = new Map();
  private implementedSolutions: ProactiveSolution[] = [];

  /**
   * Scans system for potential issues
   */
  async scanForIssues(): Promise<SystemIssue[]> {
    try {
      const issues: SystemIssue[] = [];

      // Check disk space
      const diskResult = await execAsync(
        "df -h / | awk 'NR==2 {print $5}' | cut -d'%' -f1",
      );
      const diskUsage = parseInt(diskResult.stdout.trim());
      
      if (diskUsage > 90) {
        issues.push({
          id: `disk-space-${Date.now()}`,
          type: 'performance',
          severity: diskUsage > 95 ? 'critical' : 'high',
          description: `Disk usage is at ${diskUsage}%, which may affect system performance`,
          detectedAt: Date.now(),
          resolved: false,
        });
      }

      // Check memory usage
      const memResult = await execAsync(
        "free | grep Mem | awk '{print ($3/$2)*100}'",
      );
      const memUsage = parseFloat(memResult.stdout.trim());
      
      if (memUsage > 85) {
        issues.push({
          id: `memory-${Date.now()}`,
          type: 'performance',
          severity: memUsage > 90 ? 'high' : 'medium',
          description: `Memory usage is at ${memUsage.toFixed(1)}%, which may cause slowdowns`,
          detectedAt: Date.now(),
          resolved: false,
        });
      }

      // Check for failed services
      try {
        const failedServicesResult = await execAsync(
          "systemctl --failed --quiet | wc -l",
        );
        const failedCount = parseInt(failedServicesResult.stdout.trim());
        
        if (failedCount > 0) {
          issues.push({
            id: `failed-services-${Date.now()}`,
            type: 'stability',
            severity: failedCount > 3 ? 'high' : 'medium',
            description: `${failedCount} system services have failed`,
            detectedAt: Date.now(),
            resolved: false,
          });
        }
      } catch (error) {
        // Ignore errors in service check
      }

      // Check system logs for errors
      try {
        const logErrorsResult = await execAsync(
          "journalctl -p err..alert --since '1 hour ago' | wc -l",
        );
        const errorCount = parseInt(logErrorsResult.stdout.trim());
        
        if (errorCount > 50) {
          issues.push({
            id: `system-errors-${Date.now()}`,
            type: 'stability',
            severity: errorCount > 100 ? 'high' : 'medium',
            description: `${errorCount} system errors detected in the last hour`,
            detectedAt: Date.now(),
            resolved: false,
          });
        }
      } catch (error) {
        // Ignore errors in log check
      }

      // Update internal issue tracking
      for (const issue of issues) {
        this.detectedIssues.set(issue.id, issue);
      }

      if (issues.length > 0) {
        this.logger.warn(`Detected ${issues.length} potential issues`);
      } else {
        this.logger.log('No issues detected during system scan');
      }

      return issues;
    } catch (error) {
      this.logger.error(`Error scanning for issues: ${error.message}`);
      return [];
    }
  }

  /**
   * Generates proactive solutions for detected issues
   */
  async generateSolutions(): Promise<ProactiveSolution[]> {
    try {
      const issues = await this.scanForIssues();
      const solutions: ProactiveSolution[] = [];

      for (const issue of issues) {
        let solution: ProactiveSolution | null = null;

        switch (issue.type) {
          case 'performance':
            if (issue.description.includes('Disk usage')) {
              solution = {
                issueId: issue.id,
                action: 'Clean up disk space by removing temporary files and unused packages',
                priority: issue.severity === 'critical' ? 1 : 2,
                estimatedTime: 5,
                automated: true,
              };
            } else if (issue.description.includes('Memory usage')) {
              solution = {
                issueId: issue.id,
                action: 'Clear system caches and optimize memory usage',
                priority: issue.severity === 'critical' ? 1 : 3,
                estimatedTime: 2,
                automated: true,
              };
            }
            break;

          case 'stability':
            if (issue.description.includes('failed services')) {
              solution = {
                issueId: issue.id,
                action: 'Restart failed services and check their status',
                priority: issue.severity === 'high' ? 1 : 2,
                estimatedTime: 10,
                automated: true,
              };
            } else if (issue.description.includes('system errors')) {
              solution = {
                issueId: issue.id,
                action: 'Analyze system logs and address critical errors',
                priority: issue.severity === 'high' ? 1 : 3,
                estimatedTime: 15,
                automated: false,
              };
            }
            break;

          case 'security':
            solution = {
              issueId: issue.id,
              action: 'Run security scan and apply necessary patches',
              priority: 1,
              estimatedTime: 30,
              automated: false,
            };
            break;

          case 'maintenance':
            solution = {
              issueId: issue.id,
              action: 'Perform routine system maintenance tasks',
              priority: 4,
              estimatedTime: 20,
              automated: true,
            };
            break;
        }

        if (solution) {
          solutions.push(solution);
        }
      }

      // Sort by priority (1 = highest, 4 = lowest)
      solutions.sort((a, b) => a.priority - b.priority);

      this.implementedSolutions = solutions;
      return solutions;
    } catch (error) {
      this.logger.error(`Error generating solutions: ${error.message}`);
      return [];
    }
  }

  /**
   * Implements proactive solutions
   */
  async implementSolutions(): Promise<void> {
    try {
      const solutions = await this.generateSolutions();
      
      for (const solution of solutions) {
        if (solution.automated) {
          this.logger.log(`Implementing automated solution: ${solution.action}`);
          
          // Execute automated solutions
          await this.executeAutomatedSolution(solution);
        } else {
          this.logger.log(`Proactive recommendation: ${solution.action}`);
          // In a real implementation, this would notify the user or create a task
        }
      }

      this.logger.log('Proactive problem solving completed');
    } catch (error) {
      this.logger.error(`Error implementing solutions: ${error.message}`);
    }
  }

  /**
   * Executes automated solutions
   */
  private async executeAutomatedSolution(solution: ProactiveSolution): Promise<void> {
    try {
      switch (solution.action) {
        case 'Clean up disk space by removing temporary files and unused packages':
          await execAsync('apt-get autoremove -y');
          await execAsync('apt-get clean');
          await execAsync('rm -rf /tmp/*');
          this.logger.log('Disk cleanup completed');
          break;

        case 'Clear system caches and optimize memory usage':
          await execAsync('sync && echo 3 > /proc/sys/vm/drop_caches');
          this.logger.log('Memory optimization completed');
          break;

        case 'Restart failed services and check their status':
          await execAsync('systemctl reset-failed');
          this.logger.log('Failed services reset');
          break;

        case 'Perform routine system maintenance tasks':
          await execAsync('journalctl --vacuum-time=7d');
          this.logger.log('System maintenance completed');
          break;

        default:
          this.logger.warn(`Unknown automated solution: ${solution.action}`);
      }

      // Mark the associated issue as resolved
      const issue = Array.from(this.detectedIssues.values()).find(
        i => i.id === solution.issueId
      );
      
      if (issue) {
        issue.resolved = true;
        issue.resolution = solution.action;
        this.detectedIssues.set(issue.id, issue);
      }
    } catch (error) {
      this.logger.error(`Error executing automated solution: ${error.message}`);
    }
  }

  /**
   * Gets current problem-solving status
   */
  getProblemSolvingStatus(): {
    detectedIssues: SystemIssue[];
    pendingSolutions: ProactiveSolution[];
  } {
    return {
      detectedIssues: Array.from(this.detectedIssues.values()).filter(issue => !issue.resolved),
      pendingSolutions: this.implementedSolutions,
    };
  }
}