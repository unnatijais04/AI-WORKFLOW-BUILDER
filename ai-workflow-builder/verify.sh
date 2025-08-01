#!/bin/bash

echo "🔍 AI Workflow Builder - Verification Script"
echo "============================================"
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "server/main.py" ] || [ ! -f "client/package.json" ]; then
    print_error "Please run this script from the ai-workflow-builder directory"
    exit 1
fi

echo "Checking service status..."
echo

# Check Backend
print_status "Checking backend server..."
if curl -s http://localhost:8000/health > /dev/null; then
    print_success "Backend is running on http://localhost:8000"
    
    # Test API endpoints
    if curl -s http://localhost:8000/ | grep -q "AI Workflow Builder API"; then
        print_success "Backend API root endpoint is working"
    else
        print_warning "Backend API root endpoint may have issues"
    fi
else
    print_error "Backend is not running on http://localhost:8000"
fi

echo

# Check Frontend
print_status "Checking frontend server..."
if curl -s http://localhost:3000 | grep -q "AI Workflow Builder"; then
    print_success "Frontend is running on http://localhost:3000"
else
    print_warning "Frontend may not be fully loaded yet"
fi

echo

# Check processes
print_status "Checking running processes..."

# Check Python processes
PYTHON_PROCESSES=$(ps aux | grep "python main.py" | grep -v grep | wc -l)
if [ "$PYTHON_PROCESSES" -gt 0 ]; then
    print_success "Backend Python process is running"
else
    print_error "Backend Python process is not running"
fi

# Check Node.js processes
NODE_PROCESSES=$(ps aux | grep "react-scripts start" | grep -v grep | wc -l)
if [ "$NODE_PROCESSES" -gt 0 ]; then
    print_success "Frontend Node.js process is running"
else
    print_error "Frontend Node.js process is not running"
fi

echo

# Check dependencies
print_status "Checking dependencies..."

# Check if node_modules exists
if [ -d "client/node_modules" ]; then
    print_success "Frontend dependencies are installed"
else
    print_error "Frontend dependencies are missing"
fi

# Check if virtual environment exists
if [ -d "server/venv" ]; then
    print_success "Backend virtual environment exists"
else
    print_error "Backend virtual environment is missing"
fi

echo

# Summary
echo "📊 Summary:"
echo "==========="

if curl -s http://localhost:8000/health > /dev/null && curl -s http://localhost:3000 > /dev/null; then
    print_success "🎉 All services are running successfully!"
    echo
    echo "🌐 Access your application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:8000"
    echo "   API Documentation: http://localhost:8000/docs"
    echo
    print_success "The AI Workflow Builder is ready to use!"
else
    print_error "❌ Some services are not running properly"
    echo
    echo "To start the application, run:"
    echo "   ./run.sh"
fi

echo