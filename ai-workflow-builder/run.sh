#!/bin/bash

echo "🚀 Starting AI Workflow Builder..."
echo

# Function to cleanup background processes
cleanup() {
    echo "🛑 Stopping services..."
    pkill -f "uvicorn main:app" 2>/dev/null || true
    pkill -f "npm start" 2>/dev/null || true
    pkill -f "react-scripts start" 2>/dev/null || true
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if we're in the right directory
if [ ! -f "server/main.py" ] || [ ! -f "client/package.json" ]; then
    echo "❌ Error: Please run this script from the ai-workflow-builder directory"
    exit 1
fi

# Start Backend Server
echo "🔧 Starting Backend Server..."
cd server

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please run setup first."
    exit 1
fi

# Activate virtual environment and start backend
source venv/bin/activate

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Creating from example..."
    cp env.example .env
    echo "📝 Please edit .env file with your API keys"
fi

# Start backend with uvicorn
echo "🌐 Starting backend on http://localhost:8000"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Test backend
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ Backend is running successfully"
else
    echo "⚠️  Backend may not be fully started yet"
fi

# Start Frontend
echo
echo "🎨 Starting Frontend..."
cd ../client

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend
echo "🌐 Starting frontend on http://localhost:3000"
npm start &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 5

# Test frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is running successfully"
else
    echo "⚠️  Frontend may not be fully started yet"
fi

echo
echo "🎉 AI Workflow Builder is starting..."
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8000"
echo "📊 Health:   http://localhost:8000/health"
echo
echo "Press Ctrl+C to stop both services..."

# Wait for user to stop
wait