# SMARTS Architecture - Self-adaptive Multi-agent Planning and Task Execution System

## Overview

The SMARTS (Self-adaptive Multi-agent Planning and Task Execution System) is an advanced AI architecture that combines:

1. **Self-Modifying Architecture** with dynamic reconfiguration
2. **Tiny Recursive Model Integration** (Samsung-style)
3. **Multi-Agent Collaboration Framework**
4. **Evolutionary Optimization**
5. **Hot-Swapping of Components**

This system transforms Bytebot into a foundation for Artificial General Intelligence (AGI) by implementing cutting-edge AI concepts.

## Key Features

### 1. Self-Modifying Architecture

- Dynamic reconfiguration based on task requirements
- Hot-swapping of components without system restart
- Evolutionary optimization through genetic algorithms

### 2. Tiny Recursive Model Integration

- Primary Agent: High-capability LLM for complex reasoning
- Recursive Micro-Agents: Lightweight specialized models for specific tasks
  - Vision Agent: Image recognition and desktop interpretation
  - Action Agent: Mouse/keyboard control with precision
  - Planning Agent: Task decomposition and execution planning
  - Learning Agent: Continuous performance improvement

### 3. Multi-Agent Collaboration

- Central orchestrator coordinating specialized agents
- Performance-based agent selection
- Automatic recovery with alternative agents

### 4. Evolutionary Self-Improvement

- Genetic algorithms for system optimization
- Continuous learning from task execution
- Automated performance enhancement

## Running with OpenRouter

To use the SMARTS system with OpenRouter (access to 100+ AI models):

1. **Set up your environment**:

   ```bash
   # Copy the example environment file
   cp docker/.env.example docker/.env

   # Edit docker/.env and add your OpenRouter API key:
   OPENROUTER_API_KEY=your-openrouter-api-key-here
   ```

2. **Start the system**:

   ```bash
   docker-compose -f docker/docker-compose.yml up -d
   ```

3. **Access the interface**:
   - Open browser to `http://localhost:9992`
   - Select OpenRouter models when creating tasks:
     - `openrouter/auto` (recommended)
     - `openrouter/anthropic/claude-3.5-sonnet`
     - `openrouter/openai/gpt-4o`

## Running the SMARTS Demo

To demonstrate the SMARTS architecture capabilities:

1. **Ensure the bytebot-agent service is running**:

   ```bash
   # In one terminal, start the services
   docker-compose -f docker/docker-compose.yml up -d
   ```

2. **Run the SMARTS demonstration**:

   ```bash
   # Navigate to the bytebot-agent package
   cd packages/bytebot-agent

   # Run the SMARTS demo
   npm run smarts-demo
   ```

3. **View the results**:
   The demo will show:
   - Initial system configuration
   - Task processing with recursive micro-agents
   - Dynamic reconfiguration
   - Hot-swapping of components
   - Evolutionary optimization
   - Agent creation and scaling

## AGI Stepping Stone Features

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

### 5. Recursive Self-Improvement

- Agents that can redesign their own architecture
- Continuous optimization of system performance
- Evolutionary enhancement of capabilities

### 6. Embodied Cognition

- Physical world interaction through IoT devices
- Sensor fusion and multimodal processing
- Real-world consequence learning

### 7. Social Intelligence

- Multi-agent collaboration protocols
- Collective problem-solving
- Shared knowledge repositories

### 8. Abstract Reasoning

- Symbolic reasoning combined with neural processing
- Causal modeling and inference
- Hypothetical scenario exploration

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

## Next Steps Toward AGI

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
