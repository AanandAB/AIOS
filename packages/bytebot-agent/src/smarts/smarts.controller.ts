import { Controller, Post, Body, Get, Param, Logger } from '@nestjs/common';
import { SMARTSOrchestrator } from './orchestrator';
import { HotSwapManager } from './hot-swap-manager';
import { DynamicReconfigurator } from './dynamic-reconfigurator';
import { EvolutionEngine } from './evolution-engine';
import { SMARTSDemoService } from './smarts-demo.service';
import { MCPPDemoService } from './mcp-demo.service';

@Controller('smarts')
export class SMARTSController {
  private readonly logger = new Logger(SMARTSController.name);

  constructor(
    private readonly orchestrator: SMARTSOrchestrator,
    private readonly hotSwapManager: HotSwapManager,
    private readonly dynamicReconfigurator: DynamicReconfigurator,
    private readonly evolutionEngine: EvolutionEngine,
    private readonly demoService: SMARTSDemoService,
    private readonly mcpDemoService: MCPPDemoService,
  ) {}

  @Post('process-task')
  async processTask(
    @Body() taskRequest: { description: string; taskId: string },
  ): Promise<Record<string, any>> {
    this.logger.log(`Received task processing request: ${taskRequest.taskId}`);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.orchestrator.processTask(
        taskRequest.description,
        taskRequest.taskId,
      );

      return {
        success: true,
        taskId: taskRequest.taskId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        result,
      };
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`Task processing failed: ${error.message}`);
      return {
        success: false,
        taskId: taskRequest.taskId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        error: error.message,
      };
    }
  }

  @Post('hot-swap')
  async hotSwapComponent(
    @Body() swapRequest: { componentId: string; newVersion: any },
  ): Promise<Record<string, any>> {
    this.logger.log(
      `Received hot-swap request for: ${swapRequest.componentId}`,
    );

    try {
      const success = await this.orchestrator.hotSwapComponent(
        swapRequest.componentId,
        swapRequest.newVersion,
      );

      return {
        success,
        componentId: swapRequest.componentId,
      };
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`Hot-swap failed: ${error.message}`);
      return {
        success: false,
        componentId: swapRequest.componentId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        error: error.message,
      };
    }
  }

  @Post('reconfigure')
  async reconfigure(
    @Body() configRequest: { configuration: any },
  ): Promise<Record<string, any>> {
    this.logger.log('Received reconfiguration request');

    try {
      const success = await this.dynamicReconfigurator.reconfigure(
        configRequest.configuration,
      );

      return {
        success,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        configuration: configRequest.configuration,
      };
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`Reconfiguration failed: ${error.message}`);
      return {
        success: false,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        error: error.message,
      };
    }
  }

  @Post('evolve')
  async triggerEvolution(): Promise<Record<string, any>> {
    this.logger.log('Received evolution trigger request');

    try {
      await this.evolutionEngine.runEvolutionCycle();

      return {
        success: true,
        message: 'Evolution cycle completed',
      };
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`Evolution failed: ${error.message}`);
      return {
        success: false,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        error: error.message,
      };
    }
  }

  @Get('configuration')
  getCurrentConfiguration(): Record<string, any> {
    return {
      success: true,
      configuration: this.dynamicReconfigurator.getCurrentConfiguration(),
    };
  }

  @Get('version-history/:componentId')
  getComponentVersionHistory(
    @Param('componentId') componentId: string,
  ): Record<string, any> {
    return {
      success: true,
      componentId,
      history: this.hotSwapManager.getVersionHistory(componentId),
    };
  }

  // New endpoint to demonstrate the complete SMARTS architecture
  @Get('demo')
  async runDemo(): Promise<Record<string, any>> {
    this.logger.log('Received SMARTS demonstration request');

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.demoService.demonstrateSMARTS();

      return {
        success: true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        demonstration: result,
      };
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`SMARTS demonstration failed: ${error.message}`);
      return {
        success: false,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        error: error.message,
      };
    }
  }

  // New endpoint to run continuous optimization
  @Post('optimize')
  async runOptimization(
    @Body() optimizationRequest: { cycles: number },
  ): Promise<Record<string, any>> {
    this.logger.log(
      `Received optimization request for ${optimizationRequest.cycles} cycles`,
    );

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.demoService.runContinuousOptimization(
        optimizationRequest.cycles,
      );

      return {
        success: true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        optimization: result,
      };
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`Optimization failed: ${error.message}`);
      return {
        success: false,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        error: error.message,
      };
    }
  }

  // New endpoint to demonstrate MCP capabilities
  @Get('mcp-demo')
  async runMCPDemo(): Promise<Record<string, any>> {
    this.logger.log('Received MCP demonstration request');

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.mcpDemoService.demonstrateMCPs();

      return {
        success: true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        demonstration: result,
      };
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`MCP demonstration failed: ${error.message}`);
      return {
        success: false,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        error: error.message,
      };
    }
  }

  // New endpoint to demonstrate nested MCP capabilities
  @Get('nested-mcp-demo')
  async runNestedMCPDemo(): Promise<Record<string, any>> {
    this.logger.log('Received nested MCP demonstration request');

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.mcpDemoService.demonstrateNestedMCPs();

      return {
        success: true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        demonstration: result,
      };
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`Nested MCP demonstration failed: ${error.message}`);
      return {
        success: false,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        error: error.message,
      };
    }
  }

  // New endpoint to get MCP status
  @Get('mcp-status')
  async getMCPStatus(): Promise<Record<string, any>> {
    this.logger.log('Received MCP status request');

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.mcpDemoService.getMCPStatus();

      return {
        success: true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        status: result,
      };
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`MCP status retrieval failed: ${error.message}`);
      return {
        success: false,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        error: error.message,
      };
    }
  }
}
