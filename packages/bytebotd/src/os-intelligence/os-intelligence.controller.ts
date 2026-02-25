import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { OsIntelligenceService, ProactiveAction } from './os-intelligence.service';
import { SystemOptimizerService } from './system-optimizer.service';
import { UserBehaviorAnalyzerService } from './user-behavior-analyzer.service';
import { ProactiveProblemSolverService } from './proactive-problem-solver.service';
import { IntelligentOsService } from './intelligent-os.service';

@Controller('os-intelligence')
export class OsIntelligenceController {
  private readonly logger = new Logger(OsIntelligenceController.name);

  constructor(
    private readonly osIntelligenceService: OsIntelligenceService,
    private readonly systemOptimizer: SystemOptimizerService,
    private readonly userBehaviorAnalyzer: UserBehaviorAnalyzerService,
    private readonly problemSolver: ProactiveProblemSolverService,
    private readonly intelligentOs: IntelligentOsService,
  ) {}

  @Get('status')
  async getStatus() {
    this.logger.log('Getting comprehensive OS intelligence status');
    return await this.intelligentOs.getOsIntelligenceStatus();
  }

  @Get('resources')
  async getResources() {
    this.logger.log('Monitoring system resources');
    return await this.systemOptimizer.getSystemResources();
  }

  @Get('patterns')
  async getUserPatterns() {
    this.logger.log('Analyzing user patterns');
    return this.userBehaviorAnalyzer.getUserBehaviorStatus();
  }

  @Get('issues')
  async getDetectedIssues() {
    this.logger.log('Scanning for system issues');
    return this.problemSolver.getProblemSolvingStatus();
  }

  @Post('optimize')
  async optimizeSystem() {
    this.logger.log('Optimizing system resources');
    await this.systemOptimizer.monitorAndMaintain();
    return { message: 'System optimization completed' };
  }

  @Post('anticipate-needs')
  async anticipateUserNeeds() {
    this.logger.log('Anticipating user needs');
    await this.userBehaviorAnalyzer.anticipateUserNeeds();
    return { message: 'User needs anticipation completed' };
  }

  @Post('solve-problems')
  async solveProblems() {
    this.logger.log('Solving problems proactively');
    await this.problemSolver.implementSolutions();
    return { message: 'Proactive problem solving completed' };
  }

  @Post('enhance-symbiosis')
  async enhanceSymbiosis() {
    this.logger.log('Enhancing human-computer symbiosis');
    await this.intelligentOs.enhanceHumanComputerSymbiosis();
    return { message: 'Human-computer symbiosis enhanced' };
  }

  @Post('trigger-operations')
  async triggerOperations() {
    this.logger.log('Triggering intelligent operations');
    await this.intelligentOs.triggerIntelligentOperations();
    return { message: 'Intelligent operations triggered' };
  }
}