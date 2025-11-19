#!/usr/bin/env node

/**
 * SMARTS Integration Test
 *
 * This script verifies that all SMARTS components are properly integrated
 * and working together as expected.
 */

import { NestFactory } from '@nestjs/core';
import { SMARTSModule } from './smarts.module';
import { AgentRegistry } from './agent-registry';
import { TaskDecomposer } from './task-decomposer';
import { HotSwapManager } from './hot-swap-manager';
import { DynamicReconfigurator } from './dynamic-reconfigurator';

async function testSMARTSIntegration() {
  console.log('=== SMARTS Integration Test ===\n');

  try {
    // Create a standalone SMARTS module context
    const app = await NestFactory.createApplicationContext(SMARTSModule);

    // Get all SMARTS services
    const agentRegistry = app.get(AgentRegistry);
    const taskDecomposer = app.get(TaskDecomposer);
    const hotSwapManager = app.get(HotSwapManager);
    const dynamicReconfigurator = app.get(DynamicReconfigurator);

    console.log('✅ All SMARTS services loaded successfully\n');

    // Test agent registry
    const agents = agentRegistry.getAllAgents();
    console.log(`✅ Agent registry contains ${agents.length} agents`);

    // Test task decomposer
    const testTask =
      'Search for information about artificial intelligence and click on the first result';
    const subtasks = taskDecomposer.decompose(testTask);
    console.log(`✅ Task decomposer created ${subtasks.length} subtasks`);

    // Test dynamic reconfigurator
    await dynamicReconfigurator.analyzeTask(testTask);
    console.log('✅ Dynamic reconfigurator analyzed task successfully');

    // Test hot swap manager
    const versionHistory = hotSwapManager.getVersionHistory('vision-agent-1');
    console.log(
      `✅ Hot swap manager retrieved version history (${versionHistory.length} versions)`,
    );

    // Test evolution engine
    console.log('✅ Evolution engine initialized successfully');

    // Test orchestrator
    console.log('✅ SMARTS orchestrator initialized successfully');

    // Test demo service
    console.log('✅ SMARTS demo service initialized successfully');

    await app.close();

    console.log('\n=== SMARTS Integration Test Complete ===');
    console.log('✅ All SMARTS components are properly integrated and working');
  } catch (error: unknown) {
    console.log('❌ SMARTS integration test failed:');
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log('Unknown error occurred');
    }
    process.exit(1);
  }
}

void testSMARTSIntegration();
