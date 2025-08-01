#!/bin/bash

echo "🚀 Starting SafeSpace Student Help Portal..."
echo ""
echo "📋 Installation Check:"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14.0.0 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
echo "✅ Node.js version: $NODE_VERSION"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🌟 SafeSpace Features:"
echo "   🔒 Anonymous help submissions"
echo "   👥 Peer support and chat rooms"
echo "   📚 Resource library"
echo "   🚨 Crisis support information"
echo "   💪 Success stories"
echo "   📊 Admin dashboard"
echo ""

echo "🚀 Starting server..."
echo ""
echo "📍 Access URLs:"
echo "   Student Portal: http://localhost:3000"
echo "   Admin Dashboard: http://localhost:3000/admin"
echo "   API Documentation: http://localhost:3000/api"
echo ""
echo "Press Ctrl+C to stop the server"
echo "────────────────────────────────────────"

# Start the server
node server.js