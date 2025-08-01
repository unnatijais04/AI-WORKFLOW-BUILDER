#!/bin/bash

echo "🚀 Starting AI Workflow Builder (Simple Mode)..."

# Kill any existing processes
pkill -f "uvicorn\|npm\|react-scripts" 2>/dev/null || true

# Start backend
echo "🔧 Starting backend..."
cd server
source venv/bin/activate
nohup uvicorn main:app --host 0.0.0.0 --port 8000 > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend
echo "⏳ Waiting for backend to start..."
sleep 5

# Start frontend
echo "🎨 Starting frontend..."
cd client
nohup npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend
echo "⏳ Waiting for frontend to start..."
sleep 10

echo "🎉 Services started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8000"
echo "📊 Health:   http://localhost:8000/health"
echo
echo "Logs:"
echo "Backend:  tail -f backend.log"
echo "Frontend: tail -f frontend.log"
echo
echo "To stop: pkill -f 'uvicorn\|npm\|react-scripts'"