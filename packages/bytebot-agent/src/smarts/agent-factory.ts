import { Injectable, Logger } from '@nestjs/common';
import { AgentRegistry } from './agent-registry';
import { VisionAgent } from './agents/vision-agent';
import { ActionAgent } from './agents/action-agent';
import { PlanningAgent } from './agents/planning-agent';
import { LearningAgent } from './agents/learning-agent';

@Injectable()
export class AgentFactory {
  private readonly logger = new Logger(AgentFactory.name);

  constructor(
    private readonly agentRegistry: AgentRegistry,
    private readonly visionAgent: VisionAgent,
    private readonly actionAgent: ActionAgent,
    private readonly planningAgent: PlanningAgent,
    private readonly learningAgent: LearningAgent,
  ) {
    // Register default agents when factory is created
    this.initializeDefaultAgents();
  }

  /**
   * Initialize and register default agents
   */
  private initializeDefaultAgents(): void {
    this.logger.log('Initializing default recursive micro-agents');

    // Register vision agents
    this.agentRegistry.registerAgent({
      id: 'vision-agent-1',
      type: 'vision',
      version: '1.0.0',
      capabilities: ['ocr', 'element-detection', 'screenshot-analysis'],
      performanceMetrics: {
        successRate: 0.95,
        avgExecutionTime: 300,
        totalExecutions: 100,
      },
      execute: async (task: any, taskId: string) => {
        return await this.visionAgent.processVisualTask(task, taskId);
      },
    });

    this.agentRegistry.registerAgent({
      id: 'vision-agent-2',
      type: 'vision',
      version: '1.0.0',
      capabilities: ['ocr', 'element-detection', 'screenshot-analysis'],
      performanceMetrics: {
        successRate: 0.92,
        avgExecutionTime: 350,
        totalExecutions: 85,
      },
      execute: async (task: any, taskId: string) => {
        return await this.visionAgent.processVisualTask(task, taskId);
      },
    });

    // Register action agents
    this.agentRegistry.registerAgent({
      id: 'action-agent-1',
      type: 'action',
      version: '1.0.0',
      capabilities: ['mouse-control', 'keyboard-input', 'ui-interaction'],
      performanceMetrics: {
        successRate: 0.98,
        avgExecutionTime: 200,
        totalExecutions: 200,
      },
      execute: async (task: any, taskId: string) => {
        return await this.actionAgent.executeAction(task, taskId);
      },
    });

    this.agentRegistry.registerAgent({
      id: 'action-agent-2',
      type: 'action',
      version: '1.0.0',
      capabilities: ['mouse-control', 'keyboard-input', 'ui-interaction'],
      performanceMetrics: {
        successRate: 0.96,
        avgExecutionTime: 220,
        totalExecutions: 180,
      },
      execute: async (task: any, taskId: string) => {
        return await this.actionAgent.executeAction(task, taskId);
      },
    });

    // Register planning agent
    this.agentRegistry.registerAgent({
      id: 'planning-agent-1',
      type: 'planning',
      version: '1.0.0',
      capabilities: ['task-decomposition', 'resource-allocation', 'sequencing'],
      performanceMetrics: {
        successRate: 0.99,
        avgExecutionTime: 500,
        totalExecutions: 150,
      },
      execute: async (task: any, taskId: string) => {
        return await this.planningAgent.createPlan(task, taskId);
      },
    });

    // Register learning agent
    this.agentRegistry.registerAgent({
      id: 'learning-agent-1',
      type: 'learning',
      version: '1.0.0',
      capabilities: [
        'performance-analysis',
        'optimization',
        'pattern-recognition',
      ],
      performanceMetrics: {
        successRate: 0.9,
        avgExecutionTime: 400,
        totalExecutions: 75,
      },
      execute: async (task: any, taskId: string) => {
        return await this.learningAgent.optimizePerformance(taskId, [task]);
      },
    });

    this.logger.log('Default agents initialized and registered');
  }

  /**
   * Create and register a new agent instance
   */
  createAgent(agentType: string, config: any): string {
    const agentId = `${agentType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    let agentImplementation: any;
    let capabilities: string[] = [];

    switch (agentType) {
      case 'vision':
        agentImplementation = this.visionAgent;
        capabilities = ['ocr', 'element-detection', 'screenshot-analysis'];
        break;
      case 'action':
        agentImplementation = this.actionAgent;
        capabilities = ['mouse-control', 'keyboard-input', 'ui-interaction'];
        break;
      case 'planning':
        agentImplementation = this.planningAgent;
        capabilities = [
          'task-decomposition',
          'resource-allocation',
          'sequencing',
        ];
        break;
      case 'learning':
        agentImplementation = this.learningAgent;
        capabilities = [
          'performance-analysis',
          'optimization',
          'pattern-recognition',
        ];
        break;
      default:
        throw new Error(`Unsupported agent type: ${agentType}`);
    }

    const newAgent = {
      id: agentId,
      type: agentType,
      version: config.version || '1.0.0',
      capabilities,
      performanceMetrics: {
        successRate: 0.5, // Initial neutral performance
        avgExecutionTime: 0,
        totalExecutions: 0,
      },
      execute: async (task: any, taskId: string) => {
        switch (agentType) {
          case 'vision':
            return await this.visionAgent.processVisualTask(task, taskId);
          case 'action':
            return await this.actionAgent.executeAction(task, taskId);
          case 'planning':
            return await this.planningAgent.createPlan(task, taskId);
          case 'learning':
            return await this.learningAgent.optimizePerformance(taskId, [task]);
          default:
            throw new Error(`Unsupported agent type: ${agentType}`);
        }
      },
    };

    this.agentRegistry.registerAgent(newAgent);
    this.logger.log(
      `Created and registered new ${agentType} agent: ${agentId}`,
    );

    return agentId;
  }

  /**
   * Remove an agent instance
   */
  removeAgent(agentId: string): boolean {
    return this.agentRegistry.unregisterAgent(agentId);
  }
}
