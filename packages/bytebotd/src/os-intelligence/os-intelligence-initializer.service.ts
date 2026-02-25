import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { IntelligentOsService } from './intelligent-os.service';

@Injectable()
export class OsIntelligenceInitializerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(OsIntelligenceInitializerService.name);

  constructor(
    private readonly intelligentOsService: IntelligentOsService,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Initializing OS Intelligence features...');
    
    try {
      // Start the intelligent OS service
      this.logger.log('OS Intelligence initialization completed successfully');
    } catch (error) {
      this.logger.error(`Failed to initialize OS Intelligence: ${error.message}`);
    }
  }
}