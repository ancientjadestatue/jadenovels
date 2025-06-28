@echo off
echo Starting Jekyll development server with Docker...

REM Navigate to the correct directory (project root)
cd /d "%~dp0"

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not running. Please start Docker Desktop first.
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

REM Stop any existing containers
echo Stopping any existing Jekyll containers...
docker-compose down

REM Build and run with docker-compose
echo Building and starting Jekyll server...
docker-compose up --build

REM This line will only execute if docker-compose is stopped
echo Jekyll server has been stopped.
pause
