# AI Workflow Builder

A No-Code/Low-Code web application that enables users to visually create and interact with intelligent workflows. Build AI-powered workflows by connecting components for document processing, LLM interactions, and chat interfaces.

## 🚀 Features

### Core Components
- **User Query Component**: Entry point for user queries
- **Knowledge Base Component**: Document processing and vector embeddings
- **LLM Engine Component**: Language model processing with multiple providers
- **Output Component**: Chat interface for responses

### Key Features
- 🎨 **Visual Workflow Builder**: Drag-and-drop interface using React Flow
- 📄 **Document Processing**: Support for PDF, TXT, and DOCX files
- 🤖 **Multiple LLM Providers**: OpenAI GPT, Google Gemini, Anthropic Claude
- 🔍 **Vector Search**: ChromaDB integration for semantic search
- 🌐 **Web Search**: SerpAPI integration for real-time information
- 💬 **Chat Interface**: Interactive chat with workflow execution
- ⚙️ **Component Configuration**: Detailed settings for each component

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **React Flow** - Workflow visualization
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **FastAPI** - Python web framework
- **PyMuPDF** - PDF processing
- **ChromaDB** - Vector database
- **OpenAI API** - GPT models
- **Google Generative AI** - Gemini models
- **SerpAPI** - Web search
- **Sentence Transformers** - Embeddings

## 📋 Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- API Keys for:
  - OpenAI (optional)
  - Google Gemini (optional)
  - SerpAPI (optional)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-workflow-builder
```

### 2. Frontend Setup
```bash
cd client
npm install
```

### 3. Backend Setup
```bash
cd ../server
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 4. Environment Configuration
Create a `.env` file in the server directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
SERPAPI_API_KEY=your_serpapi_key_here
```

## 🏃‍♂️ Running the Application

### 1. Start the Backend
```bash
cd server
# Activate virtual environment if not already activated
python main.py
```
The backend will start on `http://localhost:8000`

### 2. Start the Frontend
```bash
cd client
npm start
```
The frontend will start on `http://localhost:3000`

## 📖 Usage Guide

### Building a Workflow

1. **Add Components**: Drag components from the sidebar to the canvas
2. **Connect Components**: Click and drag from output handles to input handles
3. **Configure Components**: Click on any component to open the configuration panel
4. **Build Stack**: Click "Build Stack" to validate your workflow
5. **Chat with Stack**: Click "Chat with Stack" to start interacting

### Component Configuration

#### User Query Component
- **Label**: Custom name for the component
- **Description**: Optional description

#### Knowledge Base Component
- **Label**: Custom name for the component
- **Embedding Model**: Choose between OpenAI, Gemini, or Sentence Transformers
- **Vector Store**: Select ChromaDB, Pinecone, or Weaviate
- **Documents**: Upload PDF, TXT, or DOCX files

#### LLM Engine Component
- **Label**: Custom name for the component
- **Provider**: Select OpenAI, Gemini, or Anthropic
- **Model**: Choose specific model (GPT-3.5, GPT-4, Gemini Pro, etc.)
- **Temperature**: Control creativity (0-2)
- **Custom Prompt**: Optional system prompt
- **Web Search**: Enable SerpAPI integration

#### Output Component
- **Label**: Custom name for the component
- **Chat Style**: Modern, Minimal, or Professional
- **Save History**: Toggle chat history persistence
- **Show Timestamps**: Display message timestamps

### Workflow Examples

#### Basic Q&A Workflow
1. User Query → LLM Engine → Output

#### Document-Based Q&A
1. User Query → Knowledge Base → LLM Engine → Output

#### Web-Enhanced Q&A
1. User Query → LLM Engine (with web search) → Output

## 🔧 API Endpoints

### Core Endpoints
- `GET /` - API information
- `GET /health` - Health check
- `POST /extract-text/` - Extract text from documents
- `POST /process-documents/` - Process and embed documents
- `POST /search-documents/` - Search documents by similarity
- `POST /generate-embeddings/` - Generate text embeddings
- `POST /call-llm/` - Call language models
- `POST /web-search/` - Perform web searches
- `POST /execute-workflow/` - Execute complete workflows

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   External      │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
│                        │                        │
├─ Workflow Builder      ├─ Document Processing   ├─ OpenAI API
├─ Chat Interface        ├─ Vector Store          ├─ Google Gemini
├─ Component Config      ├─ LLM Orchestration     ├─ SerpAPI
└─ React Flow           └─ Workflow Execution    └─ ChromaDB
```

## 🔒 Security Considerations

- API keys are stored as environment variables
- CORS is configured for development
- Input validation using Pydantic models
- Error handling for external API failures

## 🚧 Development

### Project Structure
```
ai-workflow-builder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── component/      # React components
│   │   │   ├── nodes/      # Workflow node components
│   │   │   ├── FlowCanvas.js
│   │   │   ├── Sidebar.js
│   │   │   └── ...
│   │   └── App.js
│   └── package.json
├── server/                 # FastAPI backend
│   ├── main.py            # Main application
│   ├── requirements.txt   # Python dependencies
│   └── venv/              # Virtual environment
└── README.md
```

### Adding New Components
1. Create component in `client/src/component/nodes/`
2. Add to `nodeTypes` in `FlowCanvas.js`
3. Add configuration in `ConfigurationPanel.js`
4. Implement backend logic in `main.py`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information

## 🔮 Future Enhancements

- [ ] PostgreSQL database integration
- [ ] User authentication
- [ ] Workflow templates
- [ ] Advanced analytics
- [ ] Real-time collaboration
- [ ] Mobile responsive design
- [ ] Plugin system
- [ ] Workflow versioning 

# Deployment Instructions (Vercel + Render)

## Frontend (Vercel)
1. Push your code to GitHub.
2. Go to https://vercel.com/ and import your repo.
3. Set the project root to `client`.
4. Set the build command to `npm run build` and output directory to `build`.
5. In Vercel dashboard, add an environment variable:
   - `REACT_APP_API_URL=https://your-backend.onrender.com`
6. Deploy!

## Backend (Render)
1. Push your backend code (`server` folder) to GitHub.
2. Go to https://render.com/ and create a new Web Service.
3. Set the root directory to `server`.
4. Set the build command to `pip install -r requirements.txt`.
5. Set the start command to `uvicorn main:app --host 0.0.0.0 --port 10000`.
6. Add environment variables for your API keys and:
   - `FRONTEND_URL=https://your-frontend.vercel.app`
7. Deploy!

## Local Development
- Frontend: `.env` file with `REACT_APP_API_URL=http://localhost:8000`
- Backend: `.env` file with your API keys and `FRONTEND_URL=http://localhost:3000`

--- 