import { Injectable, Logger } from '@nestjs/common';
import { MCPManager } from './mcp-manager';

@Injectable()
export class MCPPDemoService {
  private readonly logger = new Logger(MCPPDemoService.name);

  constructor(private readonly mcpManager: MCPManager) {}

  /**
   * Demonstrate MCP capabilities with a simple example
   */
  async demonstrateMCPs(): Promise<any> {
    this.logger.log('Starting MCP demonstration');

    // 1. Register additional MCPs for demonstration
    this.registerDemoMCPs();

    // 2. Show all registered MCPs
    const allMCPs = this.mcpManager.getAllMCPs();
    this.logger.log(`Total MCPs registered: ${allMCPs.length}`);

    // 3. Create MCP groups for coordinated operations
    this.createDemoMCPGroups();

    // 4. Demonstrate task execution with multiple MCPs
    const task = {
      id: 'demo-task-1',
      description: 'Demonstrate desktop control with file operations',
    };

    // Select MCPs based on task requirements
    const requiredCapabilities = [
      'desktop-control',
      'mouse',
      'keyboard',
      'file-operations',
    ];
    const selectedMCPs = this.mcpManager.selectMCPsForTask(
      'demo',
      requiredCapabilities,
    );

    this.logger.log(
      `Selected ${selectedMCPs.length} MCPs for demonstration task`,
    );

    // Execute task with multiple MCPs
    const results = await this.mcpManager.executeWithMCPs(
      task,
      'demo-task-1',
      selectedMCPs,
    );

    // 5. Demonstrate health check
    const healthStatus = await this.mcpManager.healthCheck();
    this.logger.log('MCP Health Check Results:', healthStatus);

    return {
      message: 'MCP demonstration completed',
      mcpCount: allMCPs.length,
      selectedMCPs: selectedMCPs.map((mcp) => ({ id: mcp.id, name: mcp.name })),
      executionResults: results,
      healthStatus,
    };
  }

  /**
   * Register additional MCPs for demonstration purposes
   */
  private registerDemoMCPs(): void {
    // Register a secondary desktop MCP (simulated)
    this.mcpManager.registerMCP({
      id: 'desktop-secondary',
      name: 'Secondary Desktop MCP',
      type: 'sse',
      url: 'http://localhost:9990/mcp-secondary',
      capabilities: [
        'desktop-control',
        'screenshot',
        'mouse',
        'keyboard',
        'file-operations',
      ],
      priority: 2,
      enabled: true,
    });

    // Register a file operations MCP
    this.mcpManager.registerMCP({
      id: 'file-operations-mcp',
      name: 'File Operations MCP',
      type: 'http',
      url: 'http://localhost:9995/file-ops',
      capabilities: ['file-operations', 'directory-management'],
      priority: 3,
      enabled: true,
    });

    // Register a system monitoring MCP
    this.mcpManager.registerMCP({
      id: 'system-monitor-mcp',
      name: 'System Monitor MCP',
      type: 'websocket',
      url: 'ws://localhost:9996/monitor',
      capabilities: ['system-monitoring', 'performance-metrics'],
      priority: 1,
      enabled: true,
    });

    this.logger.log('Demo MCPs registered successfully');
  }

  /**
   * Create MCP groups for coordinated operations
   */
  private createDemoMCPGroups(): void {
    // Create a group for desktop operations
    this.mcpManager.createMCPGroup({
      id: 'desktop-operations-group',
      name: 'Desktop Operations Group',
      description: 'Group for coordinated desktop operations',
      mcpIds: ['desktop-primary', 'desktop-secondary', 'file-operations-mcp'],
      coordinationStrategy: 'hierarchical',
      fallbackMcpId: 'desktop-primary',
    });

    // Create a group for monitoring and file operations
    this.mcpManager.createMCPGroup({
      id: 'monitor-file-group',
      name: 'Monitor & File Operations Group',
      description: 'Group for system monitoring and file operations',
      mcpIds: ['system-monitor-mcp', 'file-operations-mcp'],
      coordinationStrategy: 'parallel',
    });

    this.logger.log('Demo MCP groups created successfully');
  }

  /**
   * Demonstrate nested MCP operations
   */
  async demonstrateNestedMCPs(): Promise<any> {
    this.logger.log('Starting nested MCP demonstration');

    // Get the desktop operations group
    const desktopGroup = this.mcpManager.getMCPGroup(
      'desktop-operations-group',
    );

    if (!desktopGroup) {
      throw new Error('Desktop operations group not found');
    }

    // Execute a task using the MCP group with hierarchical coordination
    const task = {
      id: 'nested-demo-task-1',
      description:
        'Perform complex desktop operation with nested MCP coordination',
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.mcpManager.executeWithMCPGroup(
      task,
      'nested-demo-task-1',
      desktopGroup,
    );

    this.logger.log('Nested MCP demonstration completed');

    return {
      message: 'Nested MCP demonstration completed',
      groupId: desktopGroup.id,
      groupName: desktopGroup.name,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      result,
    };
  }

  /**
   * Get status of all MCPs
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async getMCPStatus(): Promise<any> {
    // This method needs to be async even though it doesn't use await
    // because it's part of an interface that requires async methods
    const allMCPs = this.mcpManager.getAllMCPs();
    const statuses = allMCPs.map((mcp) => ({
      id: mcp.id,
      name: mcp.name,
      status: this.mcpManager.getMCPStatus(mcp.id),
    }));

    return {
      message: 'MCP status retrieved',
      statuses,
    };
  }
}
