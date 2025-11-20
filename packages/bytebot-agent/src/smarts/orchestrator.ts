import { Injectable, Logger } from '@nestjs/common';
import { AgentRegistry } from './agent-registry';
import { TaskDecomposer } from './task-decomposer';
import { EvolutionEngine } from './evolution-engine';
import { HotSwapManager } from './hot-swap-manager';
import { DynamicReconfigurator } from './dynamic-reconfigurator';
import { MCPManager } from './mcp-manager';

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
    private readonly mcpManager: MCPManager,
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

    // 2. Determine if we need MCP support for this task
    const requiresMCP = this.requiresMCP(taskDescription);

    if (requiresMCP) {
      // Handle MCP-based task execution
      return await this.processTaskWithMCP(taskDescription, taskId);
    } else {
      // 3. Decompose task into subtasks for specialized agents
      const subtasks = this.taskDecomposer.decompose(taskDescription);

      // 4. Assign subtasks to appropriate recursive micro-agents
      const results = await this.executeSubtasks(subtasks, taskId);

      // 5. Trigger evolutionary optimization based on performance
      await this.evolutionEngine.evaluateAndEvolve(taskId, results);

      return results;
    }
  }

  /**
   * Execute subtasks using specialized recursive micro-agents
   */
  private async executeSubtasks(
    subtasks: Array<{
      id: string;
      type: string;
      description: string;
      priority: number;
    }>,
    taskId: string,
  ): Promise<TaskResult[]> {
    const results: TaskResult[] = [];

    for (const subtask of subtasks) {
      // Select appropriate agent based on subtask type
      const agent = this.agentRegistry.getAgentForTask(subtask.type);

      // Execute subtask with the selected agent
      try {
        const result = (await agent.execute(subtask, taskId)) as TaskResult;
        results.push(result);

        // Update agent performance metrics
        this.agentRegistry.updatePerformanceMetrics(agent.id, {
          success: true,
          executionTime: result.executionTime,
          accuracy: result.accuracy,
        });
      } catch (error) {
        this.logger.error(
          `Agent ${agent.id} failed executing subtask: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );

        // Update agent performance metrics
        this.agentRegistry.updatePerformanceMetrics(agent.id, {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
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
    subtask: {
      id: string;
      type: string;
      description: string;
      priority: number;
    },
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
      const result = (await alternativeAgent.execute(
        subtask,
        taskId,
      )) as TaskResult;
      return result;
    }

    // If no alternative, escalate to primary agent
    const primaryAgent = this.agentRegistry.getPrimaryAgent();
    const result = (await primaryAgent.execute(subtask, taskId)) as TaskResult;
    return result;
  }

  /**
   * Determine if a task requires MCP support
   */
  private requiresMCP(taskDescription: string): boolean {
    // Simple heuristic: tasks involving desktop control, file operations, or system interactions
    // might benefit from MCP support
    const mcpKeywords = [
      'desktop',
      'mouse',
      'keyboard',
      'click',
      'type',
      'file',
      'system',
      'application',
      'program',
      'software',
      'window',
      'screenshot',
      'screen',
      'control',
      'execute',
      'run',
    ];

    const lowerDescription = taskDescription.toLowerCase();
    return mcpKeywords.some((keyword) => lowerDescription.includes(keyword));
  }

  /**
   * Process a task using MCP capabilities
   */
  private async processTaskWithMCP(
    taskDescription: string,
    taskId: string,
  ): Promise<any> {
    this.logger.log(`Processing task ${taskId} with MCP support`);

    // Determine required capabilities based on task description

    const requiredCapabilities =
      this.determineRequiredCapabilities(taskDescription);

    // Select appropriate MCPs for the task
    const mcpConfigs = this.mcpManager.selectMCPsForTask(
      'general',
      requiredCapabilities,
    );

    if (mcpConfigs.length === 0) {
      this.logger.warn(
        'No suitable MCPs found for task, falling back to agent-based execution',
      );
      const subtasks = this.taskDecomposer.decompose(taskDescription);
      return await this.executeSubtasks(subtasks, taskId);
    }

    // Check if we have MCP groups for coordinated execution
    const mcpGroup = this.mcpManager.selectMCPGroupForTask();

    let results: any;
    if (mcpGroup) {
      // Use MCP group for coordinated execution
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      results = await this.mcpManager.executeWithMCPGroup(
        { description: taskDescription },
        taskId,
        mcpGroup,
      );
    } else {
      // Use individual MCPs
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      results = await this.mcpManager.executeWithMCPs(
        { description: taskDescription },
        taskId,
        mcpConfigs,
      );
    }

    // Trigger evolutionary optimization based on performance
    await this.evolutionEngine.evaluateAndEvolve(taskId, [results]);

    return results;
  }

  /**
   * Determine required capabilities for a task
   */
  private determineRequiredCapabilities(taskDescription: string): string[] {
    const capabilities: string[] = [];
    const lowerDescription = taskDescription.toLowerCase();

    if (
      lowerDescription.includes('desktop') ||
      lowerDescription.includes('screen') ||
      lowerDescription.includes('screenshot')
    ) {
      capabilities.push('desktop-control');
    }

    if (
      lowerDescription.includes('mouse') ||
      lowerDescription.includes('click')
    ) {
      capabilities.push('mouse');
    }

    if (
      lowerDescription.includes('keyboard') ||
      lowerDescription.includes('type')
    ) {
      capabilities.push('keyboard');
    }

    if (lowerDescription.includes('file')) {
      capabilities.push('file-operations');
    }

    // Default capabilities if none specifically identified
    if (capabilities.length === 0) {
      capabilities.push('desktop-control', 'mouse', 'keyboard');
    }

    return capabilities;
  }

  /**
   * Hot-swap a component without restarting the system
   */
  async hotSwapComponent(
    componentId: string,
    newVersion: { version?: string; code?: string },
  ): Promise<boolean> {
    try {
      await this.hotSwapManager.swap(componentId, newVersion);
      this.logger.log(`Successfully hot-swapped component ${componentId}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to hot-swap component ${componentId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
