# 🧠 AI Workflow Builder

A **no-code/low-code AI workflow builder** that enables users to visually create and interact with intelligent workflows. Build AI-powered pipelines by connecting modular components using a drag-and-drop interface.

> Built with **React.js**, **React Flow**, **FastAPI**, **PostgreSQL**, **ChromaDB**, and **OpenAI/Gemini** APIs.

---

## 🚀 Features

### Core Functionality
- 🔧 **Visual Workflow Builder** – Drag-and-drop interface with React Flow
- 📚 **Document Processing** – PDF upload, text extraction, and embedding generation
- 🤖 **Multi-LLM Support** – OpenAI GPT and Google Gemini integration
- 🔍 **Knowledge Base Search** – ChromaDB vector similarity search
- 🌐 **Web Search Integration** – SerpAPI for real-time information
- 💬 **Interactive Chat Interface** – Test workflows through conversational UI

### Advanced Features
- ✅ **Workflow Validation** – Real-time validation with error reporting
- 📊 **Execution Monitoring** – Detailed logs and performance metrics
- 💾 **Persistent Storage** – Save workflows and chat history
- 🔧 **Component Configuration** – Detailed settings for each workflow component
- 📱 **Responsive Design** – Modern, mobile-friendly interface

---

## 🖥️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React.js, React Flow, Tailwind CSS, Lucide React |
| **Backend** | FastAPI, Uvicorn, Python 3.8+ |
| **Database** | PostgreSQL, ChromaDB (Vector Store) |
| **AI/ML** | OpenAI GPT, Google Gemini, OpenAI Embeddings |
| **Tools** | PyMuPDF, SerpAPI, SQLAlchemy, Axios |

---

## 📋 Core Components

The application provides four essential workflow components:

### 1. 🔵 User Query Component
- **Purpose**: Entry point for user questions
- **Features**: Configurable placeholder text
- **Connections**: Outputs to Knowledge Base or LLM Engine

### 2. 🟢 Knowledge Base Component  
- **Purpose**: Document processing and retrieval
- **Features**: 
  - PDF upload and text extraction
  - Embedding generation (OpenAI/Gemini)
  - Vector similarity search
  - Configurable result limits
- **Connections**: Receives from User Query, outputs to LLM Engine

### 3. 🟣 LLM Engine Component
- **Purpose**: AI response generation
- **Features**:
  - Multiple model providers (OpenAI, Gemini)
  - Configurable temperature and parameters
  - Optional web search integration
  - Custom prompt support
- **Connections**: Receives from User Query/Knowledge Base, outputs to Output

### 4. 🟠 Output Component
- **Purpose**: Display final responses
- **Features**: Multiple format options (text, markdown, HTML)
- **Connections**: Receives from LLM Engine

---

## 🛠️ Setup Instructions

### Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- **PostgreSQL 12+**
- **API Keys**: OpenAI, Google AI, SerpAPI (optional)

### Backend Setup

1. **Navigate to server directory**:
   ```bash
   cd ai-workflow-builder/server
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   GOOGLE_API_KEY=your_google_api_key_here
   SERPAPI_API_KEY=your_serpapi_key_here
   DATABASE_URL=postgresql://username:password@localhost:5432/ai_workflow_db
   CHROMA_DB_PATH=./chroma_db
   ```

5. **Setup PostgreSQL database**:
   ```sql
   CREATE DATABASE ai_workflow_db;
   CREATE USER workflow_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE ai_workflow_db TO workflow_user;
   ```

6. **Start the backend server**:
   ```bash
   python main.py
   ```
   Server will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to client directory**:
   ```bash
   cd ai-workflow-builder/client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment** (optional):
   ```bash
   echo "REACT_APP_API_URL=http://localhost:8000" > .env
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```
   Application will open at `http://localhost:3000`

---

## 🚀 Getting Started

### 1. Build Your First Workflow

1. **Add Components**: Drag components from the sidebar to the canvas
2. **Connect Components**: Draw connections between components using handles
3. **Configure Components**: Click on components to configure their settings
4. **Validate Workflow**: Click "Build Stack" to validate your workflow

### 2. Upload Documents (Optional)

1. **Select Knowledge Base Component**: Click to configure
2. **Upload PDF**: Use the file upload in the configuration panel
3. **Choose Settings**: Select embedding provider and collection name

### 3. Configure LLM Engine

1. **Select Model Provider**: Choose OpenAI or Gemini
2. **Pick Model**: Select specific model (e.g., gpt-3.5-turbo)
3. **Adjust Settings**: Set temperature, enable web search, add custom prompts

### 4. Test Your Workflow

1. **Validate**: Ensure your workflow is valid (green checkmark)
2. **Open Chat**: Click "Chat with Stack" button
3. **Ask Questions**: Type questions and see your workflow in action
4. **View Execution Logs**: Check detailed execution results

---

## 📁 Project Structure

```
ai-workflow-builder/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── nodes/         # Custom React Flow nodes
│   │   │   ├── Header.js      # Application header
│   │   │   ├── Sidebar.js     # Component library
│   │   │   ├── WorkflowCanvas.js # Main canvas
│   │   │   ├── ConfigPanel.js # Component configuration
│   │   │   ├── ChatModal.js   # Chat interface
│   │   │   └── ExecutionPanel.js # Execution logs
│   │   ├── services/          # API service layer
│   │   └── App.js            # Main application
│   ├── package.json
│   └── tailwind.config.js
├── server/                     # FastAPI backend
│   ├── services/              # Business logic services
│   │   ├── embedding_service.py # ChromaDB operations
│   │   ├── llm_service.py     # LLM integrations
│   │   ├── document_service.py # Document processing
│   │   └── workflow_service.py # Workflow execution
│   ├── database.py           # Database models
│   ├── main.py              # FastAPI application
│   └── requirements.txt     # Python dependencies
└── README.md
```

---

## 🔧 Configuration Options

### Environment Variables

**Backend (`.env`)**:
```env
# API Keys
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=AI...
SERPAPI_API_KEY=...

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/ai_workflow_db
CHROMA_DB_PATH=./chroma_db

# Optional Settings
MAX_TOKENS=4000
TEMPERATURE=0.7
EMBEDDING_MODEL=text-embedding-ada-002
```

**Frontend (`.env`)**:
```env
REACT_APP_API_URL=http://localhost:8000
```

### Component Configuration

**Knowledge Base**:
- Collection name for document storage
- Embedding provider (OpenAI/Gemini)
- Maximum results returned
- Document upload and processing

**LLM Engine**:
- Model provider selection
- Specific model choice
- Temperature (0.0-2.0)
- Web search toggle
- Custom system prompts

---

## 🔍 API Documentation

When the backend is running, visit `http://localhost:8000/docs` for interactive API documentation powered by FastAPI's automatic OpenAPI generation.

### Key Endpoints

- `POST /workflow/execute` - Execute workflow with user query
- `POST /workflow/validate` - Validate workflow structure
- `POST /documents/upload` - Upload and process documents
- `POST /llm/generate` - Generate LLM responses
- `GET /health` - Check service health

---

## 🧪 Testing Your Setup

### Backend Health Check
```bash
curl http://localhost:8000/health
```

### Frontend Development
1. Open `http://localhost:3000`
2. Drag components to canvas
3. Connect them with arrows
4. Click "Build Stack" to validate
5. Use "Chat with Stack" to test

### Example Workflow
1. **User Query** → **Knowledge Base** → **LLM Engine** → **Output**
2. Upload a PDF document to Knowledge Base
3. Configure LLM Engine with your preferred model
4. Validate and test with questions about your document

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

---

## 💡 Tips & Best Practices

### Workflow Design
- Always start with a User Query component
- End with an Output component
- Use Knowledge Base for document-based Q&A
- Connect components in logical order

### Performance
- Limit Knowledge Base results for faster responses
- Use appropriate temperature settings for your use case
- Consider caching for frequently accessed documents

### Troubleshooting
- Check API keys are correctly set
- Verify database connection
- Ensure all dependencies are installed
- Check browser console for frontend errors

---

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation at `/docs`
3. Create an issue in the repository

---

**Built with ❤️ for the AI community**



