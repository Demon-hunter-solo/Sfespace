#!/bin/bash

echo "🚀 Starting SafeSpace Student Help Portal..."
echo ""
echo "📋 Checking dependencies..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14+ and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ Node.js $(node --version) found"
echo "✅ npm $(npm --version) found"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "🌟 Starting SafeSpace Portal..."
echo ""
echo "📱 Access the portal at: http://localhost:3000"
echo "🔧 Admin dashboard at: http://localhost:3000 (Admin Portal tab)"
echo "📊 API health check: http://localhost:3000/api/health"
echo ""
echo "⏹️  Press Ctrl+C to stop the server"
echo ""

# Start the server
npm start