# 🚀 AI Workflow Builder - Quick Start Guide

## Prerequisites

Before running the application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **Python 3** (v3.8 or higher)
- **npm** (comes with Node.js)

## 🏃‍♂️ Quick Start

### Option 1: One-Command Startup (Recommended)

```bash
# Make sure you're in the ai-workflow-builder directory
cd ai-workflow-builder

# Run the startup script
./run.sh
```

This script will:
- ✅ Check system requirements
- ✅ Install all dependencies automatically
- ✅ Set up the Python virtual environment
- ✅ Start both backend and frontend services
- ✅ Open the application in your browser

### Option 2: Manual Setup

If you prefer to set up manually:

#### 1. Frontend Setup
```bash
cd client
npm install
npm start
```

#### 2. Backend Setup (in a new terminal)
```bash
cd server
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

## 🌐 Access the Application

Once running, you can access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔑 API Keys (Optional)

For full functionality, you can add API keys to `server/.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
SERPAPI_API_KEY=your_serpapi_key_here
```

The application will work without these keys, but some AI features will be limited.

## 🛠️ Features

- **Visual Workflow Builder**: Drag-and-drop interface
- **Document Processing**: Upload and process PDFs
- **AI Integration**: Connect to OpenAI, Gemini, and other LLMs
- **Vector Search**: Semantic search with ChromaDB
- **Web Search**: Real-time information retrieval
- **Chat Interface**: Interactive workflow execution

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: 
   - Kill existing processes: `pkill -f "node\|python"`
   - Or change ports in the configuration

2. **Dependencies not found**:
   - Run `./run.sh` again to reinstall dependencies

3. **Permission denied**:
   - Make script executable: `chmod +x run.sh`

### Getting Help

- Check the logs in the terminal for error messages
- Visit the API documentation at http://localhost:8000/docs
- Review the main README.md for detailed information

## 🎯 Next Steps

1. Open http://localhost:3000 in your browser
2. Start building workflows by dragging components from the sidebar
3. Configure your components in the right panel
4. Test your workflows with the chat interface

Happy building! 🎉