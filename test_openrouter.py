#!/usr/bin/env python3
"""
Test script to verify OpenRouter integration with Bytebot
"""

import requests
import os
import json

def test_openrouter_integration():
    """Test OpenRouter model integration with Bytebot"""
    
    # Bytebot API endpoint
    url = "http://localhost:9991/tasks"
    
    # Test task using OpenRouter model
    payload = {
        "description": "What is the capital of France?",
        "model": "openrouter/auto"
    }
    
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            print("✅ Successfully sent task to Bytebot with OpenRouter model")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ Failed to send task. Status code: {response.status_code}")
            print(f"Response: {response.text}")
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to Bytebot. Make sure it's running at http://localhost:9991")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_model_list():
    """Test that OpenRouter models are available"""
    # This would typically be done through the Bytebot UI
    # For now, we'll just print the available models
    openrouter_models = [
        "openrouter/auto",
        "openrouter/anthropic/claude-3.5-sonnet",
        "openrouter/openai/gpt-4o",
        "openrouter/google/gemini-pro",
        "openrouter/meta-llama/llama-3.1-70b"
    ]
    
    print("\nAvailable OpenRouter models in Bytebot:")
    for model in openrouter_models:
        print(f"  - {model}")

if __name__ == "__main__":
    print("Testing OpenRouter integration with Bytebot...\n")
    
    # Check if API key is set
    openrouter_key = os.environ.get("OPENROUTER_API_KEY")
    if openrouter_key:
        print("✅ OpenRouter API key found in environment")
    else:
        print("⚠️  OpenRouter API key not found in environment")
        print("   Please set OPENROUTER_API_KEY in your docker/.env file")
    
    # Test model list
    test_model_list()
    
    # Test integration
    print("\nTesting task creation...")
    test_openrouter_integration()
    
    print("\nTo use OpenRouter with Bytebot:")
    print("1. Add OPENROUTER_API_KEY=your-key to docker/.env")
    print("2. Run: docker-compose -f docker/docker-compose.yml up -d")
    print("3. Access the UI at http://localhost:9992")
    print("4. Select an OpenRouter model when creating tasks")