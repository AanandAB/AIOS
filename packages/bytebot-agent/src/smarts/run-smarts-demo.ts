#!/usr/bin/env node

/**
 * SMARTS Architecture Demo Runner
 *
 * This script demonstrates the key features of the SMARTS architecture:
 * 1. Self-Modifying Architecture with dynamic reconfiguration
 * 2. Tiny Recursive Model Integration (Samsung-style)
 * 3. Multi-Agent Collaboration Framework
 * 4. Evolutionary Optimization
 * 5. Hot-Swapping of Components
 *
 * To run this demo:
 * 1. Ensure the bytebot-agent service is running
 * 2. Set your OPENROUTER_API_KEY in the environment
 * 3. Run: npm run smarts-demo
 */

// Use built-in fetch if available, otherwise import node-fetch
let fetchFn: typeof fetch | typeof import('node-fetch').default;

async function initializeFetch() {
  if (typeof fetch !== 'undefined') {
    // Use built-in fetch (Node.js 18+)
    fetchFn = fetch;
  } else if (!fetchFn) {
    // Import node-fetch for older Node.js versions
    fetchFn = (await import('node-fetch')).default;
  }
}

interface DemoResponse {
  success: boolean;
  demonstration?: any;
  optimization?: any;
  error?: string;
}

interface OptimizationResponse {
  success: boolean;
  optimization?: any;
  error?: string;
}

async function runSMARTSDemo() {
  console.log('=== SMARTS Architecture Demonstration ===\n');

  try {
    // Initialize fetch
    await initializeFetch();

    // Wait a moment for services to start
    console.log('Connecting to SMARTS service...\n');

    // Call the SMARTS demo endpoint
    const response = await fetchFn('http://localhost:9991/smarts/demo', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = (await response.json()) as DemoResponse;

    if (result.success) {
      console.log('✅ SMARTS demonstration completed successfully!\n');
      console.log('=== DEMONSTRATION RESULTS ===');
      console.log(JSON.stringify(result.demonstration, null, 2));
    } else {
      console.log('❌ SMARTS demonstration failed:');
      if (result.error) {
        console.log(result.error);
      }
    }
  } catch (error: unknown) {
    console.log('❌ Error running SMARTS demonstration:');
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log('Unknown error occurred');
    }
    console.log(
      '\nPlease ensure the bytebot-agent service is running on port 9991',
    );
  }
}

// Run continuous optimization demo
async function runOptimizationDemo(cycles: number = 3) {
  console.log(`\n=== Continuous Optimization Demo (${cycles} cycles) ===\n`);

  try {
    // Initialize fetch
    await initializeFetch();

    const response = await fetchFn('http://localhost:9991/smarts/optimize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cycles }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = (await response.json()) as OptimizationResponse;

    if (result.success) {
      console.log('✅ Optimization demonstration completed successfully!\n');
      console.log('=== OPTIMIZATION RESULTS ===');
      console.log(JSON.stringify(result.optimization, null, 2));
    } else {
      console.log('❌ Optimization demonstration failed:');
      if (result.error) {
        console.log(result.error);
      }
    }
  } catch (error: unknown) {
    console.log('❌ Error running optimization demonstration:');
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log('Unknown error occurred');
    }
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting SMARTS Architecture Demo\n');

  // Run the main SMARTS demonstration
  await runSMARTSDemo();

  // Run the optimization demonstration
  await runOptimizationDemo(2);

  console.log('\n=== SMARTS Demo Complete ===');
}

// Handle command line arguments
if (process.argv.includes('--optimize')) {
  const cycles =
    parseInt(process.argv[process.argv.indexOf('--optimize') + 1]) || 3;
  void runOptimizationDemo(cycles);
} else {
  void main();
}
