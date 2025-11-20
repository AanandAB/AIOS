import { Module } from '@nestjs/common';
import { SMARTSOrchestrator } from './orchestrator';
import { AgentRegistry } from './agent-registry';
import { TaskDecomposer } from './task-decomposer';
import { EvolutionEngine } from './evolution-engine';
import { HotSwapManager } from './hot-swap-manager';
import { DynamicReconfigurator } from './dynamic-reconfigurator';
import { SMARTSController } from './smarts.controller';
import { AgentFactory } from './agent-factory';
import { VisionAgent } from './agents/vision-agent';
import { ActionAgent } from './agents/action-agent';
import { PlanningAgent } from './agents/planning-agent';
import { LearningAgent } from './agents/learning-agent';
import { SMARTSDemoService } from './smarts-demo.service';
import { MCPManager } from './mcp-manager';
import { MCPPDemoService } from './mcp-demo.service';

@Module({
  imports: [],
  controllers: [SMARTSController],
  providers: [
    SMARTSOrchestrator,
    AgentRegistry,
    TaskDecomposer,
    EvolutionEngine,
    HotSwapManager,
    DynamicReconfigurator,
    AgentFactory,
    VisionAgent,
    ActionAgent,
    PlanningAgent,
    LearningAgent,
    SMARTSDemoService,
    MCPManager,
    MCPPDemoService,
  ],
  exports: [
    SMARTSOrchestrator,
    AgentRegistry,
    TaskDecomposer,
    EvolutionEngine,
    HotSwapManager,
    DynamicReconfigurator,
    SMARTSDemoService,
    MCPManager,
    MCPPDemoService,
  ],
})
export class SMARTSModule {}
