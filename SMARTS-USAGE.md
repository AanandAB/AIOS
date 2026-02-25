# SMARTS Architecture Usage Guide

## What is SMARTS?

SMARTS stands for **Self-adaptive Multi-agent Planning and Task Execution System**. It's an advanced AI architecture that transforms Bytebot into a foundation for Artificial General Intelligence (AGI) by implementing:

1. **Self-Modifying Architecture** with dynamic reconfiguration
2. **Tiny Recursive Model Integration** (Samsung-style)
3. **Multi-Agent Collaboration Framework**
4. **Evolutionary Optimization**
5. **Hot-Swapping of Components**

## Prerequisites

Before using SMARTS, ensure you have:

1. **Docker Desktop** installed and running
2. **Node.js** (version 20 or higher)
3. **OpenRouter API Key** (free at https://openrouter.ai/)

## Quick Start

### 1. Set up Environment

```bash
# Copy the example environment file
cp docker/.env.example docker/.env

# Edit docker/.env and add your OpenRouter API key:
OPENROUTER_API_KEY=your-openrouter-api-key-here
```

On Windows, you can edit the file with:

```cmd
notepad docker\.env
```

### 2. Start SMARTS Services

```bash
# Using the provided scripts:
./run-smarts.sh        # On macOS/Linux
run-smarts.bat         # On Windows

# Or manually:
docker-compose -f docker/docker-compose.yml up -d
```

### 3. Access the Interface

- **Web Interface**: http://localhost:9992
- **API Endpoint**: http://localhost:9991

## Running Demos

### SMARTS Architecture Demonstration

```bash
cd packages/bytebot-agent
npm run smarts-demo
```

This demo shows:

- Initial system configuration
- Task processing with recursive micro-agents
- Dynamic reconfiguration
- Hot-swapping of components
- Evolutionary optimization
- Agent creation and scaling

### SMARTS Integration Test

```bash
cd packages/bytebot-agent
npm run smarts-test
```

This test verifies that all SMARTS components are properly integrated.

## Using OpenRouter Models

When creating tasks in the web interface, select from these OpenRouter models:

- `openrouter/auto` - Automatically selects the best model
- `openrouter/anthropic/claude-3.5-sonnet` - Claude 3.5 Sonnet
- `openrouter/openai/gpt-4o` - GPT-4o
- `openrouter/google/gemini-pro` - Gemini Pro
- `openrouter/meta-llama/llama-3.1-70b` - Llama 3.1 70B

## API Endpoints

The SMARTS system exposes several REST API endpoints:

- `GET /smarts/demo` - Run complete SMARTS demonstration
- `POST /smarts/process-task` - Process a task with SMARTS
- `POST /smarts/hot-swap` - Hot-swap a component
- `POST /smarts/reconfigure` - Reconfigure system architecture
- `POST /smarts/evolve` - Trigger evolutionary optimization
- `GET /smarts/configuration` - Get current configuration
- `GET /smarts/version-history/:componentId` - Get component version history
- `POST /smarts/optimize` - Run continuous optimization cycles

## Example API Usage

### Process a Task

```bash
curl -X POST http://localhost:9991/smarts/process-task \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Search for artificial intelligence trends in 2025",
    "taskId": "task-123"
  }'
```

### Run Evolution

```bash
curl -X POST http://localhost:9991/smarts/evolve
```

### Get Configuration

```bash
curl http://localhost:9991/smarts/configuration
```

## AGI Features

The SMARTS architecture implements several key features that make it a foundation for AGI:

### 1. Self-Programming Capabilities

- Agents can generate and modify their own code
- Code review and self-improvement loops
- Dynamic addition of new agent types

### 2. Meta-Learning Framework

- Agents learn how to learn more effectively
- Transfer learning between different task domains
- Abstract reasoning pattern extraction

### 3. Cognitive Architecture

- Working memory and attention mechanisms
- Mental simulation and planning
- Cross-modal integration (text, vision, action)

### 4. Autonomous Goal Generation

- Self-directed learning and improvement
- Curiosity-driven exploration
- Long-term strategic planning

## Troubleshooting

### Common Issues

1. **Services won't start**: Ensure Docker Desktop is running
2. **API key errors**: Verify your OPENROUTER_API_KEY is correctly set
3. **Port conflicts**: Stop other services using ports 9990-9992

### Logs

View service logs:

```bash
docker-compose -f docker/docker-compose.yml logs -f
```

### Reset Services

To reset and restart:

```bash
docker-compose -f docker/docker-compose.yml down
docker-compose -f docker/docker-compose.yml up -d
```

## Next Steps

To further develop this system as a stepping stone to AGI:

1. **Enhance Self-Programming**: Allow agents to modify core system architecture
2. **Implement Meta-Meta-Learning**: Enable learning about learning how to learn
3. **Expand Cognitive Architecture**: Add more sophisticated memory and attention mechanisms
4. **Develop Social Intelligence**: Create multi-agent societies with complex collaboration
5. **Integrate Embodied Cognition**: Connect to physical robots and IoT devices
6. **Advance Abstract Reasoning**: Implement symbolic AI with neural grounding
7. **Enable Autonomous Goal Generation**: Allow system to set its own objectives
8. **Implement Recursive Self-Improvement**: Enable system to redesign itself

The SMARTS architecture provides a solid foundation for these advanced capabilities, making it a true stepping stone toward Artificial General Intelligence.
