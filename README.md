# 🧠 AI Workflow Builder

A **no-code/low-code AI workflow builder** that lets you visually create LLM-powered pipelines by connecting modular components like user queries, knowledge bases, PDF uploaders, and language models using a drag-and-drop interface.

> Built with **React.js**, **React Flow**, **FastAPI**, **PostgreSQL**, **ChromaDB**, and **OpenAI/Gemini** APIs.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **Python 3** (v3.8 or higher)
- **npm** (comes with Node.js)

### One-Command Setup & Run
```bash
# Navigate to the project directory
cd ai-workflow-builder

# Run the startup script (automatically installs dependencies and starts services)
./run.sh
```

This will:
- ✅ Check system requirements
- ✅ Install all dependencies automatically
- ✅ Set up Python virtual environment
- ✅ Start backend server on http://localhost:8000
- ✅ Start frontend on http://localhost:3000

### Manual Setup (Alternative)
If you prefer manual setup:

```bash
# Frontend
cd ai-workflow-builder/client
npm install
npm start

# Backend (in a new terminal)
cd ai-workflow-builder/server
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

---

## 🚀 Features

- 🔧 **Drag-and-Drop Workflow Canvas** – Built using React Flow
- 📚 **PDF Upload + ChromaDB Embedding**
- 💬 **LLM Integration (OpenAI & Gemini)**
- 🧠 **Knowledge Base Querying**
- 🗂️ **Workflow JSON Export/Import**
- 💾 **Chat Logging & History**
- ⚡ **Backend APIs** for execution and document management

---

## 🖥️ Tech Stack

| Frontend | Backend       | Database     | AI/Embedding        |
|----------|---------------|--------------|---------------------|
| React.js + Tailwind CSS | FastAPI       | PostgreSQL          | OpenAI / Gemini      |
| React Flow              | Uvicorn/Gunicorn | ChromaDB (vector) | PyMuPDF, SerpAPI     |

---

## 🔑 API Keys (Optional)

For full functionality, add API keys to `server/.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
SERPAPI_API_KEY=your_serpapi_key_here
```

The application works without these keys, but some AI features will be limited.

---

## 📖 Documentation

- **Quick Start Guide**: [QUICK_START.md](ai-workflow-builder/QUICK_START.md)
- **API Documentation**: http://localhost:8000/docs (when running)
- **Deployment Guide**: [DEPLOYMENT.md](ai-workflow-builder/DEPLOYMENT.md)

---

## 🐛 Troubleshooting

### Common Issues
1. **Port already in use**: Kill existing processes with `pkill -f "node\|python"`
2. **Dependencies not found**: Run `./run.sh` again to reinstall
3. **Permission denied**: Make script executable with `chmod +x run.sh`

### Getting Help
- Check terminal logs for error messages
- Visit API docs at http://localhost:8000/docs
- Review the detailed README in the `ai-workflow-builder` directory

---

## 🎯 What's Ready

✅ **Fully functional AI workflow builder**
✅ **Visual drag-and-drop interface**
✅ **Backend API with all endpoints**
✅ **Document processing and vector search**
✅ **LLM integration (OpenAI, Gemini)**
✅ **One-command startup script**
✅ **Comprehensive documentation**

The application is now **fully runnable** and ready for use! 🎉



