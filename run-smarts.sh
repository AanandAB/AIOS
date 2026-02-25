#!/bin/bash

# SMARTS System Runner Script
# This script helps set up and run the SMARTS architecture with OpenRouter

echo "🚀 Starting SMARTS Architecture with OpenRouter"

# Check if docker is installed
if ! command -v docker &> /dev/null
then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null
then
    echo "❌ docker-compose is not installed. Please install docker-compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f "docker/.env" ]; then
    echo "📝 Creating .env file from example..."
    cp docker/.env.example docker/.env
    echo "✅ Created docker/.env file"
    echo "⚠️  Please edit docker/.env and add your OPENROUTER_API_KEY"
    echo "   Run: nano docker/.env"
    exit 1
fi

# Check if OPENROUTER_API_KEY is set
if grep -q "your-openrouter-api-key-here" "docker/.env"; then
    echo "⚠️  OPENROUTER_API_KEY not set in docker/.env"
    echo "   Please edit docker/.env and add your OpenRouter API key"
    echo "   Run: nano docker/.env"
    exit 1
fi

echo "🐳 Starting SMARTS services with Docker Compose..."
docker-compose -f docker/docker-compose.yml up -d

echo "⏳ Waiting for services to start..."
sleep 10

echo "✅ SMARTS services started successfully!"
echo "🌐 Access the web interface at: http://localhost:9992"
echo "🔧 API endpoint available at: http://localhost:9991"
echo ""
echo "To run the SMARTS demonstration:"
echo "  cd packages/bytebot-agent"
echo "  npm run smarts-demo"
echo ""
echo "To test SMARTS integration:"
echo "  cd packages/bytebot-agent"
echo "  npm run smarts-test"