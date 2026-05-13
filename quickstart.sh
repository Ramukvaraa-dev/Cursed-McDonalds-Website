#!/bin/bash
# Quick Start Script for Cursed McDonald's Auth Server
# Run: ./quickstart.sh

echo "🍟 Cursed McDonald's Authentication Server - Quick Start"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "📥 Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env created - Edit it to add Google/Microsoft credentials (optional)"
    echo ""
fi

# Start server
echo "🚀 Starting server..."
echo ""
echo "=================================================="
echo "🔐 Cursed McDonald's Auth Server"
echo "✅ Server running on http://localhost:5000"
echo "🔗 Login page: http://localhost:5000"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Overview"
echo "   - SETUP_GUIDE_v2.md - Complete setup guide"
echo "   - AUTH.md - Authentication details"
echo ""
echo "🛑 Press Ctrl+C to stop the server"
echo "=================================================="
echo ""

npm start
