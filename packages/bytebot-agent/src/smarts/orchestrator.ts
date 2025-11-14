import { Injectable, Logger } from '@nestjs/common';
import { AgentRegistry } from './agent-registry';
import { TaskDecomposer } from './task-decomposer';
import { EvolutionEngine } from './evolution-engine';
import { HotSwapManager } from './hot-swap-manager';
import { DynamicReconfigurator } from './dynamic-reconfigurator';

// Define interface for task results
interface TaskResult {
  result: any;
  executionTime?: number;
  accuracy?: number;
  success?: boolean;
  error?: string;
}

@Injectable()
export class SMARTSOrchestrator {
  private readonly logger = new Logger(SMARTSOrchestrator.name);

  constructor(
    private readonly agentRegistry: AgentRegistry,
    private readonly taskDecomposer: TaskDecomposer,
    private readonly evolutionEngine: EvolutionEngine,
    private readonly hotSwapManager: HotSwapManager,
    private readonly dynamicReconfigurator: DynamicReconfigurator,
  ) {}

  /**
   * Main entry point for processing tasks with self-evolving multi-agent system
   */
  async processTask(taskDescription: string, taskId: string): Promise<any> {
    this.logger.log(`Processing task ${taskId} with SMARTS architecture`);

    // 1. Dynamic reconfiguration based on task requirements
    const optimalConfig =
      await this.dynamicReconfigurator.analyzeTask(taskDescription);
    await this.dynamicReconfigurator.reconfigure(optimalConfig);

    // 2. Decompose task into subtasks for specialized agents
    const subtasks = await this.taskDecomposer.decompose(taskDescription);

    // 3. Assign subtasks to appropriate recursive micro-agents
    const results = await this.executeSubtasks(subtasks, taskId);

    // 4. Trigger evolutionary optimization based on performance
    await this.evolutionEngine.evaluateAndEvolve(taskId, results);

    return results;
  }

  /**
   * Execute subtasks using specialized recursive micro-agents
   */
  private async executeSubtasks(
    subtasks: any[],
    taskId: string,
  ): Promise<TaskResult[]> {
    const results: TaskResult[] = [];

    for (const subtask of subtasks) {
      // Select appropriate agent based on subtask type
      const agent = this.agentRegistry.getAgentForTask(subtask.type);

      // Execute subtask with the selected agent
      try {
        const result = await agent.execute(subtask, taskId);
        results.push(result);

        // Update agent performance metrics
        this.agentRegistry.updatePerformanceMetrics(agent.id, {
          success: true,
          executionTime: result.executionTime,
          accuracy: result.accuracy,
        });
      } catch (error) {
        this.logger.error(
          `Agent ${agent.id} failed executing subtask: ${error.message}`,
        );

        // Update agent performance metrics
        this.agentRegistry.updatePerformanceMetrics(agent.id, {
          success: false,
          error: error.message,
        });

        // Attempt recovery with alternative agent
        const recoveryResult = await this.attemptRecovery(
          subtask,
          taskId,
          agent.type,
        );
        results.push(recoveryResult);
      }
    }

    return results;
  }

  /**
   * Attempt recovery when an agent fails
   */
  private async attemptRecovery(
    subtask: any,
    taskId: string,
    failedAgentType: string,
  ): Promise<TaskResult> {
    // Get alternative agent for the same task type
    const alternativeAgent =
      this.agentRegistry.getAlternativeAgent(failedAgentType);

    if (alternativeAgent) {
      this.logger.log(
        `Attempting recovery with alternative agent ${alternativeAgent.id}`,
      );
      return await alternativeAgent.execute(subtask, taskId);
    }

    // If no alternative, escalate to primary agent
    const primaryAgent = this.agentRegistry.getPrimaryAgent();
    return await primaryAgent.execute(subtask, taskId);
  }

  /**
   * Hot-swap a component without restarting the system
   */
  async hotSwapComponent(
    componentId: string,
    newVersion: any,
  ): Promise<boolean> {
    try {
      await this.hotSwapManager.swap(componentId, newVersion);
      this.logger.log(`Successfully hot-swapped component ${componentId}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to hot-swap component ${componentId}: ${error.message}`,
      );
      return false;
    }
  }

  /**
   * Trigger evolutionary optimization process
   */
  async triggerEvolution(): Promise<void> {
    await this.evolutionEngine.runEvolutionCycle();
  }
}
