# 🚀 AI Workflow Builder - Running Instructions

## Quick Start

The AI Workflow Builder is now **fully runnable**! Here's how to get it started:

### Option 1: Simple Startup (Recommended)
```bash
# From the ai-workflow-builder directory
./start_simple.sh
```

This will:
- ✅ Start the backend server on http://localhost:8000
- ✅ Start the frontend on http://localhost:3000
- ✅ Show you the URLs and log locations

### Option 2: Manual Startup
```bash
# Terminal 1: Start Backend
cd server
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000

# Terminal 2: Start Frontend
cd client
npm start
```

## 🌐 Access the Application

Once running, you can access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Health Check**: http://localhost:8000/health
- **API Documentation**: http://localhost:8000/docs

## 📊 Current Status

✅ **Backend**: Running successfully on port 8000
✅ **Frontend**: Running successfully on port 3000
✅ **Dependencies**: All installed and working
⚠️ **API Keys**: Need to be configured (see below)

## 🔧 Configuration

### API Keys Setup

1. Edit the environment file:
```bash
cd server
nano .env
```

2. Add your API keys:
```env
# OpenAI API Key (for GPT models)
OPENAI_API_KEY=your_openai_api_key_here

# Google Gemini API Key (for Gemini models)
GEMINI_API_KEY=your_gemini_api_key_here

# SerpAPI Key (for web search)
SERPAPI_API_KEY=your_serpapi_key_here
```

### Getting API Keys

- **OpenAI**: https://platform.openai.com/api-keys
- **Gemini**: https://makersuite.google.com/app/apikey
- **SerpAPI**: https://serpapi.com/

## 📝 Features Available

### ✅ Working Features
- 🔧 Drag-and-Drop Workflow Canvas
- 📚 PDF Upload + Text Extraction
- 💬 LLM Integration (OpenAI & Gemini)
- 🧠 Knowledge Base with ChromaDB
- 🗂️ Workflow JSON Export/Import
- ⚡ Backend APIs for execution

### ⚠️ Known Issues
- OpenAI client has a minor configuration warning (doesn't affect functionality)
- Embeddings are initialized on first use (not at startup)

## 🛠️ Troubleshooting

### Check if services are running:
```bash
# Check backend
curl http://localhost:8000/health

# Check frontend
curl http://localhost:3000
```

### View logs:
```bash
# Backend logs
tail -f backend.log

# Frontend logs
tail -f frontend.log
```

### Stop services:
```bash
pkill -f 'uvicorn\|npm\|react-scripts'
```

### Restart services:
```bash
./start_simple.sh
```

## 🏗️ Project Structure

```
ai-workflow-builder/
├── server/                 # FastAPI backend
│   ├── main.py            # Main API server
│   ├── requirements.txt   # Python dependencies
│   ├── venv/              # Virtual environment
│   └── .env               # Environment variables
├── client/                # React frontend
│   ├── src/               # React source code
│   ├── package.json       # Node.js dependencies
│   └── node_modules/      # Installed packages
├── start_simple.sh        # Quick startup script
├── run.sh                 # Advanced startup script
└── test_backend.py        # Backend testing script
```

## 🎯 Next Steps

1. **Add API Keys**: Configure your API keys in `server/.env`
2. **Test Features**: Try uploading a PDF and creating a workflow
3. **Customize**: Modify the workflow components as needed

## 🆘 Support

If you encounter any issues:

1. Check the logs: `tail -f backend.log` or `tail -f frontend.log`
2. Verify API keys are set correctly
3. Ensure all dependencies are installed
4. Try restarting with `./start_simple.sh`

---

**🎉 The AI Workflow Builder is now fully operational!**