#!/bin/bash

echo "🔍 Verifying AI Workflow Builder Services..."
echo "=========================================="

# Check backend
echo "🔧 Checking Backend (http://localhost:8000)..."
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ Backend is running"
    # Get health details
    HEALTH=$(curl -s http://localhost:8000/health)
    echo "📊 Health Status: $HEALTH"
else
    echo "❌ Backend is not running"
fi

echo

# Check frontend
echo "🎨 Checking Frontend (http://localhost:3000)..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend is not running"
fi

echo

# Check processes
echo "🔍 Checking Running Processes..."
BACKEND_PROCESSES=$(ps aux | grep -E "uvicorn.*main:app" | grep -v grep | wc -l)
FRONTEND_PROCESSES=$(ps aux | grep -E "react-scripts start" | grep -v grep | wc -l)

echo "Backend processes: $BACKEND_PROCESSES"
echo "Frontend processes: $FRONTEND_PROCESSES"

echo

# Check ports
echo "🔌 Checking Port Usage..."
if netstat -tlnp 2>/dev/null | grep :8000 > /dev/null; then
    echo "✅ Port 8000 (Backend) is in use"
else
    echo "❌ Port 8000 (Backend) is not in use"
fi

if netstat -tlnp 2>/dev/null | grep :3000 > /dev/null; then
    echo "✅ Port 3000 (Frontend) is in use"
else
    echo "❌ Port 3000 (Frontend) is not in use"
fi

echo

# Summary
echo "📋 Summary:"
if curl -s http://localhost:8000/health > /dev/null && curl -s http://localhost:3000 > /dev/null; then
    echo "🎉 All services are running successfully!"
    echo
    echo "🌐 Access URLs:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:8000"
    echo "   Health:   http://localhost:8000/health"
    echo "   API Docs: http://localhost:8000/docs"
else
    echo "⚠️  Some services may not be running properly"
    echo "   Run './start_simple.sh' to restart all services"
fi