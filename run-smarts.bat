@echo off
title SMARTS Architecture Runner

echo 🚀 Starting SMARTS Architecture with OpenRouter
echo.

REM Check if docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if docker-compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ docker-compose is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist "docker\.env" (
    echo 📝 Creating .env file from example...
    copy "docker\.env.example" "docker\.env" >nul
    echo ✅ Created docker\.env file
    echo ⚠️  Please edit docker\.env and add your OPENROUTER_API_KEY
    echo    Open docker\.env in a text editor and replace "your-openrouter-api-key-here"
    echo.
    pause
    exit /b 1
)

REM Check if OPENROUTER_API_KEY is set
findstr /C:"your-openrouter-api-key-here" "docker\.env" >nul
if %errorlevel% equ 0 (
    echo ⚠️  OPENROUTER_API_KEY not set in docker\.env
    echo    Please edit docker\.env and add your OpenRouter API key
    echo    Open docker\.env in a text editor and replace "your-openrouter-api-key-here"
    echo.
    pause
    exit /b 1
)

echo 🐳 Starting SMARTS services with Docker Compose...
docker-compose -f docker\docker-compose.yml up -d

echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

echo ✅ SMARTS services started successfully!
echo 🌐 Access the web interface at: http://localhost:9992
echo 🔧 API endpoint available at: http://localhost:9991
echo.
echo To run the SMARTS demonstration:
echo   cd packages\bytebot-agent
echo   npm run smarts-demo
echo.
echo To test SMARTS integration:
echo   cd packages\bytebot-agent
echo   npm run smarts-test
echo.
pause