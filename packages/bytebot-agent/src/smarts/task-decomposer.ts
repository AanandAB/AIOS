import { Injectable, Logger } from '@nestjs/common';

// Define the subtask interface
interface Subtask {
  id: string;
  type: string;
  description: string;
  priority: number;
}

@Injectable()
export class TaskDecomposer {
  private readonly logger = new Logger(TaskDecomposer.name);

  /**
   * Decompose a complex task into subtasks for specialized agents
   */
  decompose(taskDescription: string): Subtask[] {
    this.logger.log(`Decomposing task: ${taskDescription}`);

    // In a real implementation, this would use an LLM to analyze the task
    // and break it down into subtasks. For now, we'll use a simplified approach.

    const subtasks = this.identifySubtasks(taskDescription);

    this.logger.debug(`Task decomposed into ${subtasks.length} subtasks`);
    return subtasks;
  }

  /**
   * Identify subtasks based on keywords in the task description
   */
  private identifySubtasks(taskDescription: string): Subtask[] {
    const lowerDescription = taskDescription.toLowerCase();
    const subtasks: Subtask[] = [];

    // Check for different types of actions
    if (
      lowerDescription.includes('search') ||
      lowerDescription.includes('find') ||
      lowerDescription.includes('look')
    ) {
      subtasks.push({
        id: `vision-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'vision',
        description: 'Identify search elements on screen',
        priority: 1,
      });
    }

    if (
      lowerDescription.includes('click') ||
      lowerDescription.includes('press') ||
      lowerDescription.includes('button')
    ) {
      subtasks.push({
        id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'action',
        description: 'Execute click action',
        priority: 2,
      });
    }

    if (
      lowerDescription.includes('type') ||
      lowerDescription.includes('enter') ||
      lowerDescription.includes('write')
    ) {
      subtasks.push({
        id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'action',
        description: 'Execute typing action',
        priority: 2,
      });
    }

    if (
      lowerDescription.includes('read') ||
      lowerDescription.includes('extract') ||
      lowerDescription.includes('process')
    ) {
      subtasks.push({
        id: `vision-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'vision',
        description: 'Process and extract information',
        priority: 1,
      });
    }

    if (
      lowerDescription.includes('plan') ||
      lowerDescription.includes('organize') ||
      lowerDescription.includes('structure')
    ) {
      subtasks.push({
        id: `planning-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'planning',
        description: 'Create execution plan',
        priority: 0,
      });
    }

    // If no specific subtasks identified, create a generic planning task
    if (subtasks.length === 0) {
      subtasks.push({
        id: `planning-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'planning',
        description: 'Analyze and plan task execution',
        priority: 0,
      });
    }

    return subtasks;
  }
}
