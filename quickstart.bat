@echo off
REM Quick Start Script for Cursed McDonald's Auth Server (Windows)
REM Run: quickstart.bat

echo.
echo 🍟 Cursed McDonald's Authentication Server - Quick Start
echo ==================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo 📥 Download from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js found: %NODE_VERSION%
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed!
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm found: %NPM_VERSION%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed
echo.

REM Check if .env exists
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ✅ .env created - Edit it to add Google/Microsoft credentials (optional)
    echo.
)

REM Start server
echo 🚀 Starting server...
echo.
echo ==================================================
echo 🔐 Cursed McDonald's Auth Server
echo ✅ Server running on http://localhost:5000
echo 🔗 Login page: http://localhost:5000
echo.
echo 📚 Documentation:
echo    - README.md - Overview
echo    - SETUP_GUIDE_v2.md - Complete setup guide
echo    - AUTH.md - Authentication details
echo.
echo 🛑 Press Ctrl+C to stop the server
echo ==================================================
echo.

call npm start
pause
