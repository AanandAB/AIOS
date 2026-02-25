import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class SystemOptimizerService {
  private readonly logger = new Logger(SystemOptimizerService.name);

  /**
   * Gets current system resource usage
   */
  async getSystemResources(): Promise<{
    cpu: number;
    memory: number;
    disk: number;
  }> {
    try {
      // Get CPU usage (simplified)
      const cpuResult = await execAsync(
        "top -bn1 | grep 'Cpu(s)' | awk '{print $2}' | cut -d'%' -f1",
      );
      const cpu = parseFloat(cpuResult.stdout.trim()) || 0;

      // Get memory usage
      const memResult = await execAsync(
        "free | grep Mem | awk '{print ($3/$2)*100}'",
      );
      const memory = parseFloat(memResult.stdout.trim()) || 0;

      // Get disk usage
      const diskResult = await execAsync(
        "df -h / | awk 'NR==2 {print $5}' | cut -d'%' -f1",
      );
      const disk = parseFloat(diskResult.stdout.trim()) || 0;

      return { cpu, memory, disk };
    } catch (error) {
      this.logger.error(`Error getting system resources: ${error.message}`);
      return { cpu: 0, memory: 0, disk: 0 };
    }
  }

  /**
   * Optimizes system resources based on current usage
   */
  async optimizeResources(): Promise<void> {
    try {
      const resources = await this.getSystemResources();
      this.logger.log(`Current resources: ${JSON.stringify(resources)}`);

      // CPU optimization
      if (resources.cpu > 80) {
        this.logger.log('High CPU usage detected, optimizing...');
        // In a real implementation, this could:
        // - Adjust process priorities
        // - Suspend non-critical background processes
        // - Optimize CPU scheduling
      }

      // Memory optimization
      if (resources.memory > 80) {
        this.logger.log('High memory usage detected, optimizing...');
        // Clear caches and temporary files
        await this.clearCaches();
        await this.clearTempFiles();
      }

      // Disk optimization
      if (resources.disk > 85) {
        this.logger.log('High disk usage detected, optimizing...');
        // Clean up unnecessary files
        await this.cleanupSystem();
      }

      this.logger.log('System optimization completed');
    } catch (error) {
      this.logger.error(`Error optimizing system resources: ${error.message}`);
    }
  }

  /**
   * Clears system caches to free up memory
   */
  private async clearCaches(): Promise<void> {
    try {
      // Clear page cache, dentries and inodes
      await execAsync('sync && echo 3 > /proc/sys/vm/drop_caches');
      this.logger.log('System caches cleared');
    } catch (error) {
      this.logger.error(`Error clearing caches: ${error.message}`);
    }
  }

  /**
   * Clears temporary files
   */
  private async clearTempFiles(): Promise<void> {
    try {
      // Clear temporary files
      await execAsync('rm -rf /tmp/*');
      this.logger.log('Temporary files cleared');
    } catch (error) {
      this.logger.error(`Error clearing temp files: ${error.message}`);
    }
  }

  /**
   * Performs general system cleanup
   */
  private async cleanupSystem(): Promise<void> {
    try {
      // Clean package cache
      await execAsync('apt-get clean');
      
      // Remove unused packages
      await execAsync('apt-get autoremove -y');
      
      // Clean journal logs
      await execAsync('journalctl --vacuum-time=7d');
      
      this.logger.log('System cleanup completed');
    } catch (error) {
      this.logger.error(`Error during system cleanup: ${error.message}`);
    }
  }

  /**
   * Monitors system health and proactively addresses issues
   */
  async monitorAndMaintain(): Promise<void> {
    try {
      // Perform regular optimization
      await this.optimizeResources();

      // Check for system updates
      await this.checkForUpdates();

      // Monitor critical services
      await this.monitorServices();

      this.logger.log('System maintenance completed');
    } catch (error) {
      this.logger.error(`Error during system maintenance: ${error.message}`);
    }
  }

  /**
   * Checks for system updates
   */
  private async checkForUpdates(): Promise<void> {
    try {
      // Update package lists
      await execAsync('apt-get update');
      
      // Check for available updates (without installing)
      const result = await execAsync('apt list --upgradable 2>/dev/null | wc -l');
      const updateCount = parseInt(result.stdout.trim()) - 1; // Subtract 1 for header line
      
      if (updateCount > 0) {
        this.logger.log(`${updateCount} updates available`);
        // In a real implementation, this could notify the user or automatically update
      }
    } catch (error) {
      this.logger.error(`Error checking for updates: ${error.message}`);
    }
  }

  /**
   * Monitors critical system services
   */
  private async monitorServices(): Promise<void> {
    try {
      // Check if critical services are running
      const services = ['docker', 'nginx', 'postgresql'];
      
      for (const service of services) {
        try {
          await execAsync(`systemctl is-active --quiet ${service}`);
          this.logger.debug(`Service ${service} is running`);
        } catch (error) {
          this.logger.warn(`Service ${service} is not running`);
          // In a real implementation, this could attempt to restart the service
        }
      }
    } catch (error) {
      this.logger.error(`Error monitoring services: ${error.message}`);
    }
  }
}