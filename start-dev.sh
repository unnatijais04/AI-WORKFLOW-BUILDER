#!/bin/bash

# AI Workflow Builder - Development Startup Script
echo "🧠 Starting AI Workflow Builder..."

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."
if ! command_exists python3; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is required but not installed."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Start backend
echo ""
echo "🚀 Starting Backend (FastAPI)..."
cd ai-workflow-builder/server

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "Installing Python dependencies..."
    pip install -r requirements.txt
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Please create one based on .env.example"
    echo "Creating .env from template..."
    cp .env.example .env
    echo "📝 Please edit .env file with your API keys before running the application."
fi

# Start backend in background
echo "Starting FastAPI server on http://localhost:8000..."
python main.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo ""
echo "🎨 Starting Frontend (React)..."
cd ../client

# Install npm dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

# Start frontend
echo "Starting React development server on http://localhost:3000..."
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Services started successfully!"
echo ""
echo "🔗 Access points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "📝 Notes:"
echo "   - Make sure to configure your .env file with API keys"
echo "   - PostgreSQL should be running for full functionality"
echo "   - Press Ctrl+C to stop all services"
echo ""

# Function to handle cleanup
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for processes
wait