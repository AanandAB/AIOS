import { Module } from '@nestjs/common';
import { OsIntelligenceService } from './os-intelligence.service';
import { OsIntelligenceController } from './os-intelligence.controller';
import { ComputerUseModule } from '../computer-use/computer-use.module';
import { InputTrackingModule } from '../input-tracking/input-tracking.module';
import { SystemOptimizerService } from './system-optimizer.service';
import { UserBehaviorAnalyzerService } from './user-behavior-analyzer.service';
import { ProactiveProblemSolverService } from './proactive-problem-solver.service';
import { IntelligentOsService } from './intelligent-os.service';
import { OsIntelligenceInitializerService } from './os-intelligence-initializer.service';

@Module({
  imports: [ComputerUseModule, InputTrackingModule],
  controllers: [OsIntelligenceController],
  providers: [
    OsIntelligenceService,
    SystemOptimizerService,
    UserBehaviorAnalyzerService,
    ProactiveProblemSolverService,
    IntelligentOsService,
    OsIntelligenceInitializerService,
  ],
  exports: [
    OsIntelligenceService,
    SystemOptimizerService,
    UserBehaviorAnalyzerService,
    ProactiveProblemSolverService,
    IntelligentOsService,
  ],
})
export class OsIntelligenceModule {}