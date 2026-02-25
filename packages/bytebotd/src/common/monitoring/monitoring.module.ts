import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { MonitoringController } from './monitoring.controller';
import { LoggingService } from '../logging/logging.service';
import { SecurityAuditService } from '../security/security-audit.service';
import { EnvironmentConfigService } from '../config/environment.config';

@Module({
  controllers: [MonitoringController],
  providers: [
    MonitoringService,
    LoggingService,
    SecurityAuditService,
    EnvironmentConfigService,
  ],
  exports: [
    MonitoringService,
    LoggingService,
    SecurityAuditService,
  ],
})
export class MonitoringModule {}