import { Injectable, Logger } from '@nestjs/common';

// Agent interfaces
interface AgentPerformance {
  success: boolean;
  executionTime?: number;
  accuracy?: number;
  error?: string;
}

interface Agent {
  id: string;
  type: string;
  version: string;
  capabilities: string[];
  performanceMetrics: {
    successRate: number;
    avgExecutionTime: number;
    totalExecutions: number;
  };
  execute(task: any, taskId: string): Promise<any>;
}

@Injectable()
export class AgentRegistry {
  private readonly logger = new Logger(AgentRegistry.name);
  private agents: Map<string, Agent> = new Map();
  private agentTypeIndex: Map<string, string[]> = new Map(); // type -> agentIds

  /**
   * Register a new agent in the system
   */
  registerAgent(agent: Agent): void {
    this.agents.set(agent.id, agent);

    // Update type index
    if (!this.agentTypeIndex.has(agent.type)) {
      this.agentTypeIndex.set(agent.type, []);
    }
    this.agentTypeIndex.get(agent.type)?.push(agent.id);

    this.logger.log(`Registered agent ${agent.id} of type ${agent.type}`);
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Get the most suitable agent for a specific task type
   */
  getAgentForTask(taskType: string): Agent {
    const agentIds = this.agentTypeIndex.get(taskType) || [];

    if (agentIds.length === 0) {
      // No specialized agent found, return primary agent
      return this.getPrimaryAgent();
    }

    // Return the agent with best performance metrics
    const firstAgent = this.agents.get(agentIds[0]);
    if (!firstAgent) {
      return this.getPrimaryAgent();
    }

    let bestAgent: Agent = firstAgent;
    let bestScore = this.calculateAgentScore(bestAgent);

    for (const agentId of agentIds) {
      const agent = this.agents.get(agentId);
      if (!agent) continue;

      const score = this.calculateAgentScore(agent);

      if (score > bestScore) {
        bestAgent = agent;
        bestScore = score;
      }
    }

    return bestAgent;
  }

  /**
   * Get alternative agent of the same type (for recovery)
   */
  getAlternativeAgent(agentType: string): Agent | null {
    const agentIds = this.agentTypeIndex.get(agentType) || [];

    if (agentIds.length < 2) {
      return null; // No alternative available
    }

    // Return the second best agent
    const firstAgent = this.agents.get(agentIds[0]);
    if (!firstAgent) {
      return null;
    }

    let bestAgent: Agent = firstAgent;
    let bestScore = this.calculateAgentScore(bestAgent);
    let secondBestAgent: Agent | null = null;
    let secondBestScore = -1;

    for (const agentId of agentIds) {
      const agent = this.agents.get(agentId);
      if (!agent) continue;

      const score = this.calculateAgentScore(agent);

      if (score > bestScore) {
        secondBestAgent = bestAgent;
        secondBestScore = bestScore;
        bestAgent = agent;
        bestScore = score;
      } else if (score > secondBestScore && agent.id !== bestAgent.id) {
        secondBestAgent = agent;
        secondBestScore = score;
      }
    }

    return secondBestAgent;
  }

  /**
   * Get the primary agent (LLM-based planning agent)
   */
  getPrimaryAgent(): Agent {
    // In a real implementation, this would return the actual primary agent
    // For now, we'll return the first available agent as a placeholder
    const agentIds = Array.from(this.agents.keys());
    if (agentIds.length > 0) {
      const agent = this.agents.get(agentIds[0]);
      if (agent) {
        return agent;
      }
    }

    // Fallback - create a minimal agent
    return {
      id: 'primary-agent-fallback',
      type: 'planning',
      version: '1.0.0',
      capabilities: ['planning', 'coordination'],
      performanceMetrics: {
        successRate: 1.0,
        avgExecutionTime: 100,
        totalExecutions: 1,
      },
      execute: async (task: any, taskId: string) => {
        return { result: 'Primary agent fallback execution', taskId };
      },
    };
  }

  /**
   * Update performance metrics for an agent
   */
  updatePerformanceMetrics(agentId: string, metrics: AgentPerformance): void {
    const agent = this.agents.get(agentId);
    if (!agent) {
      this.logger.warn(
        `Attempted to update metrics for non-existent agent ${agentId}`,
      );
      return;
    }

    const totalExecutions = agent.performanceMetrics.totalExecutions + 1;
    const successCount =
      agent.performanceMetrics.successRate *
        agent.performanceMetrics.totalExecutions +
      (metrics.success ? 1 : 0);

    agent.performanceMetrics.totalExecutions = totalExecutions;
    agent.performanceMetrics.successRate = successCount / totalExecutions;

    if (metrics.executionTime) {
      const currentAvg = agent.performanceMetrics.avgExecutionTime;
      agent.performanceMetrics.avgExecutionTime =
        (currentAvg * (totalExecutions - 1) + metrics.executionTime) /
        totalExecutions;
    }

    this.logger.debug(`Updated performance metrics for agent ${agentId}`);
  }

  /**
   * Calculate agent performance score for selection
   */
  private calculateAgentScore(agent: Agent): number {
    // Weighted scoring based on success rate and execution time
    const successWeight = 0.7;
    const timeWeight = 0.3;

    // Normalize execution time (lower is better)
    const maxTime = 10000; // ms - adjust based on domain
    const normalizedTime = Math.max(
      0,
      1 - agent.performanceMetrics.avgExecutionTime / maxTime,
    );

    return (
      agent.performanceMetrics.successRate * successWeight +
      normalizedTime * timeWeight
    );
  }

  /**
   * Get all registered agents
   */
  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Remove an agent from the registry
   */
  unregisterAgent(agentId: string): boolean {
    const agent = this.agents.get(agentId);
    if (!agent) {
      return false;
    }

    // Remove from type index
    const typeAgents = this.agentTypeIndex.get(agent.type);
    if (typeAgents) {
      const index = typeAgents.indexOf(agentId);
      if (index > -1) {
        typeAgents.splice(index, 1);
      }
    }

    // Remove from main registry
    this.agents.delete(agentId);
    this.logger.log(`Unregistered agent ${agentId}`);
    return true;
  }
}
