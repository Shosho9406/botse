@echo off
REM Botse by Masego - Server Starter
REM This batch file makes it easy to start the server

cls
echo.
echo ====================================
echo  Botse by Masego Server Launcher
echo ====================================
echo.

cd /d "%~dp0"

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Kill any existing Node process on port 3000
echo Checking for existing processes on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    taskkill /PID %%a /F >nul 2>&1
)
echo Cleaned up old processes.
echo.

echo Starting server...
echo.
node server.js

pause
