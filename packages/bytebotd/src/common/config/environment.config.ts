import { ConfigService } from '@nestjs/config';

export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  JWT_SECRET: string;
  DATABASE_URL: string;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  ENABLE_SECURITY_AUDIT: boolean;
  SECURITY_AUDIT_INTERVAL: number; // in minutes
}

export class EnvironmentConfigService {
  constructor(private readonly configService: ConfigService) {}

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get port(): number {
    return this.configService.get<number>('PORT', 9990);
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET', 'bytebot-secret-key');
  }

  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL', 'sqlite://localhost:./db.sqlite');
  }

  get logLevel(): string {
    return this.configService.get<string>('LOG_LEVEL', 'info');
  }

  get enableSecurityAudit(): boolean {
    return this.configService.get<boolean>('ENABLE_SECURITY_AUDIT', true);
  }

  get securityAuditInterval(): number {
    return this.configService.get<number>('SECURITY_AUDIT_INTERVAL', 60); // 60 minutes
  }

  isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  getDatabaseConfig() {
    return {
      url: this.databaseUrl,
      ssl: this.isProduction(),
    };
  }

  getJwtConfig() {
    return {
      secret: this.jwtSecret,
      expiresIn: '24h',
    };
  }

  getLoggingConfig() {
    return {
      level: this.logLevel,
      enableSecurityAudit: this.enableSecurityAudit,
      securityAuditInterval: this.securityAuditInterval,
    };
  }
}