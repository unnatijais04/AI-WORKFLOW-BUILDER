#!/bin/bash

echo "Starting AI Workflow Builder..."
echo

echo "Starting Backend Server..."
cd server
source venv/bin/activate
python main.py &
BACKEND_PID=$!

echo
echo "Starting Frontend..."
cd ../client
npm start &
FRONTEND_PID=$!

echo
echo "AI Workflow Builder is starting..."
echo "Backend will be available at: http://localhost:8000"
echo "Frontend will be available at: http://localhost:3000"
echo
echo "Press Ctrl+C to stop both services..."

# Wait for user to stop
trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait 