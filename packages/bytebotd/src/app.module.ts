import { Module } from '@nestjs/common';
import { ComputerUseModule } from './computer-use/computer-use.module';
import { InputTrackingModule } from './input-tracking/input-tracking.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BytebotMcpModule } from './mcp';
import { OsIntelligenceModule } from './os-intelligence/os-intelligence.module';
import { AuthModule } from './auth/auth.module';
import { MonitoringModule } from './common/monitoring/monitoring.module';
import { ConfigurationModule } from './common/config/config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Explicitly makes it globally available
    }),
    ConfigurationModule,
    ServeStaticModule.forRoot({
      rootPath: '/opt/noVNC',
      serveRoot: '/novnc',
    }),
    ComputerUseModule,
    InputTrackingModule,
    BytebotMcpModule,
    OsIntelligenceModule,
    AuthModule,
    MonitoringModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
