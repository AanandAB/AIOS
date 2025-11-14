import { Controller, Post, Body, Get, Param, Logger } from '@nestjs/common';
import { SMARTSOrchestrator } from './orchestrator';
import { HotSwapManager } from './hot-swap-manager';
import { DynamicReconfigurator } from './dynamic-reconfigurator';
import { EvolutionEngine } from './evolution-engine';

@Controller('smarts')
export class SMARTSController {
  private readonly logger = new Logger(SMARTSController.name);

  constructor(
    private readonly orchestrator: SMARTSOrchestrator,
    private readonly hotSwapManager: HotSwapManager,
    private readonly dynamicReconfigurator: DynamicReconfigurator,
    private readonly evolutionEngine: EvolutionEngine,
  ) {}

  @Post('process-task')
  async processTask(
    @Body() taskRequest: { description: string; taskId: string },
  ): Promise<any> {
    this.logger.log(`Received task processing request: ${taskRequest.taskId}`);
    
    try {
      const result = await this.orchestrator.processTask(
        taskRequest.description,
        taskRequest.taskId,
      );
      
      return {
        success: true,
        taskId: taskRequest.taskId,
        result,
      };
    } catch (error) {
      this.logger.error(`Task processing failed: ${error.message}`);
      return {
        success: false,
        taskId: taskRequest.taskId,
        error: error.message,
      };
    }
  }

  @Post('hot-swap')
  async hotSwapComponent(
    @Body() swapRequest: { componentId: string; newVersion: any },
  ): Promise<any> {
    this.logger.log(`Received hot-swap request for: ${swapRequest.componentId}`);
    
    try {
      const success = await this.orchestrator.hotSwapComponent(
        swapRequest.componentId,
        swapRequest.newVersion,
      );
      
      return {
        success,
        componentId: swapRequest.componentId,
      };
    } catch (error) {
      this.logger.error(`Hot-swap failed: ${error.message}`);
      return {
        success: false,
        componentId: swapRequest.componentId,
        error: error.message,
      };
    }
  }

  @Post('reconfigure')
  async reconfigure(
    @Body() configRequest: { configuration: any },
  ): Promise<any> {
    this.logger.log('Received reconfiguration request');
    
    try {
      const success = await this.dynamicReconfigurator.reconfigure(
        configRequest.configuration,
      );
      
      return {
        success,
        configuration: configRequest.configuration,
      };
    } catch (error) {
      this.logger.error(`Reconfiguration failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post('evolve')
  async triggerEvolution(): Promise<any> {
    this.logger.log('Received evolution trigger request');
    
    try {
      await this.evolutionEngine.runEvolutionCycle();
      
      return {
        success: true,
        message: 'Evolution cycle completed',
      };
    } catch (error) {
      this.logger.error(`Evolution failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('configuration')
  getCurrentConfiguration(): any {
    return {
      success: true,
      configuration: this.dynamicReconfigurator.getCurrentConfiguration(),
    };
  }

  @Get('version-history/:componentId')
  getComponentVersionHistory(@Param('componentId') componentId: string): any {
    return {
      success: true,
      componentId,
      history: this.hotSwapManager.getVersionHistory(componentId),
    };
  }
}