import { Injectable, Logger, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context: string;
  trace?: string;
}

@Injectable()
export class LoggingService implements LoggerService {
  private readonly logger = new Logger(LoggingService.name);
  private readonly logFilePath: string;

  constructor() {
    // Create logs directory if it doesn't exist
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    this.logFilePath = path.join(logsDir, 'application.log');
  }

  log(message: any, context?: string) {
    this.writeLog('INFO', message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.writeLog('ERROR', message, context, trace);
  }

  warn(message: any, context?: string) {
    this.writeLog('WARN', message, context);
  }

  debug(message: any, context?: string) {
    this.writeLog('DEBUG', message, context);
  }

  verbose(message: any, context?: string) {
    this.writeLog('VERBOSE', message, context);
  }

  private writeLog(level: string, message: any, context?: string, trace?: string) {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message: typeof message === 'string' ? message : JSON.stringify(message),
      context: context || 'Application',
      trace,
    };

    const logLine = `${logEntry.timestamp} [${logEntry.level}] [${logEntry.context}] ${logEntry.message}${logEntry.trace ? `\n${logEntry.trace}` : ''}\n`;

    // Write to console
    switch (level) {
      case 'ERROR':
        this.logger.error(message, trace, context);
        break;
      case 'WARN':
        this.logger.warn(message, context);
        break;
      case 'DEBUG':
        this.logger.debug(message, context);
        break;
      case 'VERBOSE':
        this.logger.verbose(message, context);
        break;
      default:
        this.logger.log(message, context);
    }

    // Write to file
    try {
      fs.appendFileSync(this.logFilePath, logLine);
    } catch (error) {
      this.logger.error(`Failed to write to log file: ${error.message}`);
    }
  }

  async getLogs(limit: number = 100): Promise<LogEntry[]> {
    try {
      if (!fs.existsSync(this.logFilePath)) {
        return [];
      }

      const content = fs.readFileSync(this.logFilePath, 'utf8');
      const lines = content.split('\n').filter(line => line.trim() !== '').slice(-limit);
      
      const logs: LogEntry[] = [];
      for (const line of lines) {
        // Parse log line (simplified parsing)
        const match = line.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z) \[([A-Z]+)\] \[([^\]]+)\] (.+)$/);
        if (match) {
          logs.push({
            timestamp: match[1],
            level: match[2],
            context: match[3],
            message: match[4],
          });
        }
      }
      
      return logs.reverse(); // Most recent first
    } catch (error) {
      this.logger.error(`Failed to read logs: ${error.message}`);
      return [];
    }
  }

  async clearLogs(): Promise<void> {
    try {
      if (fs.existsSync(this.logFilePath)) {
        fs.writeFileSync(this.logFilePath, '');
      }
    } catch (error) {
      this.logger.error(`Failed to clear logs: ${error.message}`);
      throw error;
    }
  }
}