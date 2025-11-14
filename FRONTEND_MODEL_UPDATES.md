# Frontend Model Selection Updates

This document provides guidance for the Bytebot UI team to update the model selection interface to include OpenRouter models.

## New Models to Add

The following OpenRouter models should be added to the model selection dropdown in the UI:

1. `openrouter/auto` - Automatically selects the best model
2. `openrouter/anthropic/claude-3.5-sonnet` - Claude 3.5 Sonnet
3. `openrouter/openai/gpt-4o` - OpenAI GPT-4o
4. `openrouter/google/gemini-pro` - Google Gemini Pro
5. `openrouter/meta-llama/llama-3.1-70b` - Llama 3.1 70B

## Implementation Recommendations

### Grouping Models by Provider

Consider organizing the model selection dropdown by provider:

```
Anthropic
├── claude-opus-4
├── claude-sonnet-4
└── openrouter/anthropic/claude-3.5-sonnet

OpenAI
├── gpt-4.1
├── gpt-4o
└── openrouter/openai/gpt-4o

Google
├── gemini-2.5-pro
├── gemini-2.5-flash
└── openrouter/google/gemini-pro

Meta
└── openrouter/meta-llama/llama-3.1-70b

OpenRouter
├── openrouter/auto
├── openrouter/anthropic/claude-3.5-sonnet
├── openrouter/openai/gpt-4o
├── openrouter/google/gemini-pro
└── openrouter/meta-llama/llama-3.1-70b
```

### Model Descriptions

Provide helpful descriptions for each model:

- `openrouter/auto`: "Automatically selects the best model for your task"
- `openrouter/anthropic/claude-3.5-sonnet`: "Anthropic's most intelligent model, excellent for complex reasoning"
- `openrouter/openai/gpt-4o`: "OpenAI's flagship model, strong in coding and creative tasks"
- `openrouter/google/gemini-pro`: "Google's advanced model, good for diverse tasks"
- `openrouter/meta-llama/llama-3.1-70b`: "Meta's powerful open-source model, cost-effective option"

### Default Selection

Consider setting `openrouter/auto` as the default model selection since it can automatically choose the best model for each task.

## API Integration

The backend is already configured to handle these models. When a user selects a model, it should be passed in the task creation request as:

```json
{
  "description": "Task description",
  "model": "selected-model-name"
}
```

## Testing

To test the new model selections:

1. Create tasks with each OpenRouter model
2. Verify that tasks are processed correctly
3. Check that model-specific capabilities work as expected
4. Confirm that error handling works for invalid model names

## Error Handling

The UI should handle these potential errors:

1. Invalid model name selected
2. OpenRouter API key not configured
3. Rate limiting from OpenRouter
4. Model temporarily unavailable

## Future Considerations

The LiteLLM configuration can be easily extended to add more OpenRouter models. The UI should be designed to accommodate additional models without requiring significant changes.
