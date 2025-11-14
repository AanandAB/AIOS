# OpenRouter Integration for Bytebot

This guide explains how to configure and use OpenRouter API with Bytebot to access a wide variety of AI models.

## What is OpenRouter?

OpenRouter is a service that provides access to multiple AI models through a single API endpoint. It allows you to:

- Access models from different providers (Anthropic, OpenAI, Google, Meta, etc.)
- Compare models side-by-side
- Use the "auto" model that selects the best model for your task
- Benefit from competitive pricing

## Setup Instructions

### 1. Get OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/) and sign up for an account
2. Navigate to the API Keys section
3. Generate a new API key
4. Copy the API key for use in the next step

### 2. Configure Environment Variables

Add your OpenRouter API key to the environment configuration:

Create or update `docker/.env` file:

```bash
# Existing API keys (optional)
ANTHROPIC_API_KEY=your-anthropic-key
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key

# Add OpenRouter API key
OPENROUTER_API_KEY=your-openrouter-api-key
```

### 3. Restart Bytebot

After updating the environment variables, restart Bytebot:

```bash
docker-compose -f docker/docker-compose.yml down
docker-compose -f docker/docker-compose.yml up -d
```

## Available OpenRouter Models

Bytebot is configured with the following OpenRouter models:

1. **openrouter/auto** - Automatically selects the best model for your task
2. **openrouter/anthropic/claude-3.5-sonnet** - Claude 3.5 Sonnet
3. **openrouter/openai/gpt-4o** - OpenAI's GPT-4o
4. **openrouter/google/gemini-pro** - Google's Gemini Pro
5. **openrouter/meta-llama/llama-3.1-70b** - Meta's Llama 3.1 70B

## Using OpenRouter Models

### In the Web UI

1. Navigate to the Bytebot web interface at http://localhost:9992
2. When creating a new task, you'll see a model selection dropdown
3. Select any of the OpenRouter models from the list
4. The task will be processed using the selected model

### Via API

You can specify the model when creating tasks programmatically:

```python
import requests

# Using the "auto" model
response = requests.post('http://localhost:9991/tasks', json={
    'description': 'Summarize the latest AI research papers',
    'model': 'openrouter/auto'
})

# Using a specific model
response = requests.post('http://localhost:9991/tasks', json={
    'description': 'Write a Python function to process CSV data',
    'model': 'openrouter/openai/gpt-4o'
})
```

## Model Recommendations

For different types of tasks, we recommend:

### General Purpose Tasks

- `openrouter/auto` - Lets OpenRouter choose the best model
- `openrouter/anthropic/claude-3.5-sonnet` - Excellent for most tasks

### Coding Tasks

- `openrouter/openai/gpt-4o` - Strong coding capabilities
- `openrouter/anthropic/claude-3.5-sonnet` - Good for code review and explanation

### Creative Writing

- `openrouter/anthropic/claude-3.5-sonnet` - Excellent for creative content
- `openrouter/google/gemini-pro` - Good for diverse writing styles

### Data Analysis

- `openrouter/openai/gpt-4o` - Strong analytical capabilities
- `openrouter/meta-llama/llama-3.1-70b` - Good for complex reasoning

### Cost-Effective Options

- `openrouter/auto` - Automatically balances quality and cost
- `openrouter/meta-llama/llama-3.1-70b` - High capability at lower cost

## Pricing Considerations

OpenRouter offers competitive pricing with per-token billing. Check [OpenRouter's pricing page](https://openrouter.ai/pricing) for current rates.

To monitor usage:

1. Log into your OpenRouter account
2. Navigate to the usage dashboard
3. Track spending by model and time period

## Troubleshooting

### Model Not Available

If you receive an error that a model is not available:

1. Check that your OpenRouter API key is correctly configured
2. Verify the model name spelling in your request
3. Check OpenRouter's status page for any service interruptions

### Authentication Errors

If you encounter authentication errors:

1. Verify your OPENROUTER_API_KEY is correctly set in the `.env` file
2. Ensure there are no extra spaces or characters in the key
3. Restart Bytebot after updating the API key

### Performance Issues

If tasks are taking longer than expected:

1. Try a different model (some models are faster than others)
2. Check OpenRouter's documentation for rate limits
3. Consider using `openrouter/auto` for automatic model selection

## Adding More Models

To add additional OpenRouter models to Bytebot:

1. Edit `packages/bytebot-llm-proxy/litellm-config.yaml`
2. Add a new entry in the model_list section:
   ```yaml
   - model_name: openrouter/provider/model-name
     litellm_params:
       model: openrouter/provider/model-name
       api_key: os.environ/OPENROUTER_API_KEY
   ```
3. Restart Bytebot

## Security Considerations

1. Keep your OpenRouter API key secure
2. Don't commit the `.env` file to version control
3. Regularly rotate your API keys
4. Monitor usage for any unexpected activity

## Conclusion

With OpenRouter integration, Bytebot can now access a vast array of AI models through a single API. This gives you flexibility to choose the best model for each task while maintaining a simple integration. The "auto" model is particularly powerful as it automatically selects the most appropriate model based on your task requirements.
