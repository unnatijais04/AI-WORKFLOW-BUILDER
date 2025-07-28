from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
import uuid

from database import get_db, Document, Workflow, ChatSession, ChatMessage
from services.document_service import DocumentService
from services.llm_service import LLMService
from services.embedding_service import EmbeddingService
from services.workflow_service import WorkflowService

app = FastAPI(title="AI Workflow Builder API", version="1.0.0")

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
document_service = DocumentService()
llm_service = LLMService()
embedding_service = EmbeddingService()
workflow_service = WorkflowService()

# Pydantic models for request/response
class WorkflowExecuteRequest(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    user_query: str
    session_id: Optional[str] = None

class WorkflowValidateRequest(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

class WorkflowSaveRequest(BaseModel):
    name: str
    description: Optional[str] = ""
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

class LLMRequest(BaseModel):
    prompt: str
    context: Optional[str] = ""
    model_provider: Optional[str] = "openai"
    model: Optional[str] = "gpt-3.5-turbo"
    use_web_search: Optional[bool] = False
    custom_prompt: Optional[str] = ""
    temperature: Optional[float] = 0.7

class DocumentQueryRequest(BaseModel):
    collection_name: str
    query: str
    n_results: Optional[int] = 5
    embedding_provider: Optional[str] = "openai"

@app.get("/")
def read_root():
    return {"message": "AI Workflow Builder API - Running Successfully"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "services": ["FastAPI", "ChromaDB", "PostgreSQL"]}

# Document Management Endpoints
@app.post("/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    collection_name: Optional[str] = None,
    embedding_provider: Optional[str] = "openai",
    db: Session = Depends(get_db)
):
    """Upload and process a document"""
    try:
        # Read file content
        content = await file.read()
        
        # Process document
        result = document_service.process_and_embed_document(
            file_content=content,
            filename=file.filename,
            collection_name=collection_name,
            embedding_provider=embedding_provider
        )
        
        if result["success"]:
            # Save to database
            db_document = Document(
                filename=result["filename"],
                content="",  # We store chunks in ChromaDB
                file_size=len(content),
                embedding_id=result["collection_name"]
            )
            db.add(db_document)
            db.commit()
            db.refresh(db_document)
            
            result["document_id"] = db_document.id
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading document: {str(e)}")

@app.post("/documents/query")
def query_documents(request: DocumentQueryRequest):
    """Query documents in a collection"""
    try:
        result = document_service.query_document_collection(
            collection_name=request.collection_name,
            query=request.query,
            n_results=request.n_results,
            embedding_provider=request.embedding_provider
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error querying documents: {str(e)}")

@app.get("/documents/collections")
def list_collections():
    """List all document collections"""
    try:
        collections = embedding_service.list_collections()
        return {"collections": collections}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing collections: {str(e)}")

@app.get("/documents")
def list_documents(db: Session = Depends(get_db)):
    """List all uploaded documents"""
    try:
        documents = db.query(Document).all()
        return {"documents": [
            {
                "id": doc.id,
                "filename": doc.filename,
                "file_size": doc.file_size,
                "upload_date": doc.upload_date,
                "embedding_id": doc.embedding_id
            }
            for doc in documents
        ]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing documents: {str(e)}")

# LLM Endpoints
@app.post("/llm/generate")
def generate_llm_response(request: LLMRequest):
    """Generate LLM response"""
    try:
        result = llm_service.generate_response(
            prompt=request.prompt,
            context=request.context,
            model_provider=request.model_provider,
            model=request.model,
            use_web_search=request.use_web_search,
            custom_prompt=request.custom_prompt,
            temperature=request.temperature
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@app.get("/llm/models")
def get_available_models():
    """Get available LLM models"""
    return {
        "openai": [
            "gpt-3.5-turbo",
            "gpt-3.5-turbo-16k",
            "gpt-4",
            "gpt-4-turbo-preview"
        ],
        "gemini": [
            "gemini-pro",
            "gemini-pro-vision"
        ]
    }

# Workflow Endpoints
@app.post("/workflow/validate")
def validate_workflow(request: WorkflowValidateRequest):
    """Validate workflow structure"""
    try:
        result = workflow_service.validate_workflow(request.nodes, request.edges)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error validating workflow: {str(e)}")

@app.post("/workflow/execute")
def execute_workflow(request: WorkflowExecuteRequest, db: Session = Depends(get_db)):
    """Execute workflow with user query"""
    try:
        result = workflow_service.execute_workflow(
            nodes=request.nodes,
            edges=request.edges,
            user_query=request.user_query,
            session_id=request.session_id
        )
        
        # Save chat message if execution was successful
        if result.get("success") and request.session_id:
            chat_message = ChatMessage(
                session_id=request.session_id,
                message=request.user_query,
                response=result.get("final_response", ""),
                execution_time=int(result.get("execution_time_ms", 0))
            )
            db.add(chat_message)
            db.commit()
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error executing workflow: {str(e)}")

@app.post("/workflow/save")
def save_workflow(request: WorkflowSaveRequest, db: Session = Depends(get_db)):
    """Save workflow to database"""
    try:
        workflow = Workflow(
            name=request.name,
            description=request.description,
            nodes=request.nodes,
            edges=request.edges
        )
        db.add(workflow)
        db.commit()
        db.refresh(workflow)
        
        return {
            "success": True,
            "workflow_id": workflow.id,
            "message": "Workflow saved successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving workflow: {str(e)}")

@app.get("/workflow/{workflow_id}")
def get_workflow(workflow_id: int, db: Session = Depends(get_db)):
    """Get workflow by ID"""
    try:
        workflow = db.query(Workflow).filter(Workflow.id == workflow_id).first()
        if not workflow:
            raise HTTPException(status_code=404, detail="Workflow not found")
        
        return {
            "id": workflow.id,
            "name": workflow.name,
            "description": workflow.description,
            "nodes": workflow.nodes,
            "edges": workflow.edges,
            "created_date": workflow.created_date,
            "updated_date": workflow.updated_date
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving workflow: {str(e)}")

@app.get("/workflows")
def list_workflows(db: Session = Depends(get_db)):
    """List all workflows"""
    try:
        workflows = db.query(Workflow).filter(Workflow.is_active == True).all()
        return {"workflows": [
            {
                "id": wf.id,
                "name": wf.name,
                "description": wf.description,
                "created_date": wf.created_date,
                "updated_date": wf.updated_date
            }
            for wf in workflows
        ]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing workflows: {str(e)}")

# Chat Session Endpoints
@app.post("/chat/session")
def create_chat_session(workflow_id: Optional[int] = None, db: Session = Depends(get_db)):
    """Create new chat session"""
    try:
        session = ChatSession(
            workflow_id=workflow_id,
            session_name=f"Session {uuid.uuid4().hex[:8]}"
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        
        return {
            "session_id": session.id,
            "session_name": session.session_name,
            "workflow_id": session.workflow_id,
            "created_date": session.created_date
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating session: {str(e)}")

@app.get("/chat/session/{session_id}/messages")
def get_chat_history(session_id: int, db: Session = Depends(get_db)):
    """Get chat history for session"""
    try:
        messages = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).all()
        return {"messages": [
            {
                "id": msg.id,
                "message": msg.message,
                "response": msg.response,
                "timestamp": msg.timestamp,
                "execution_time": msg.execution_time
            }
            for msg in messages
        ]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving chat history: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
