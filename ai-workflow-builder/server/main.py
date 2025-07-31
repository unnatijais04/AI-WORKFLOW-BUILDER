from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import fitz  # PyMuPDF
import os
import json
import asyncio
from datetime import datetime

# Import required libraries for AI functionality
try:
    import openai
    from openai import OpenAI
    import chromadb
    from chromadb.config import Settings
    import google.generativeai as genai
    from serpapi import GoogleSearch
    import numpy as np
    from sentence_transformers import SentenceTransformer
except ImportError as e:
    print(f"Warning: Some AI libraries not installed: {e}")

app = FastAPI(title="AI Workflow Builder API", version="1.0.0")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class WorkflowNode(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any]

class WorkflowEdge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None

class WorkflowRequest(BaseModel):
    workflow: Dict[str, Any]
    query: str

class DocumentUpload(BaseModel):
    filename: str
    content: str
    metadata: Dict[str, Any]

# Global variables for configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")

# Initialize clients
openai_client = None
if OPENAI_API_KEY:
    openai_client = OpenAI(api_key=OPENAI_API_KEY)

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Initialize ChromaDB
chroma_client = None
try:
    chroma_client = chromadb.Client(Settings(
        chroma_db_impl="duckdb+parquet",
        persist_directory="./chroma_db"
    ))
    collection = chroma_client.get_or_create_collection("documents")
except Exception as e:
    print(f"Warning: ChromaDB not available: {e}")

# Initialize sentence transformer for embeddings
embedding_model = None
try:
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    print(f"Warning: Sentence transformers not available: {e}")

@app.get("/")
def read_root():
    return {
        "message": "AI Workflow Builder API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "openai": OPENAI_API_KEY is not None,
            "gemini": GEMINI_API_KEY is not None,
            "serpapi": SERPAPI_API_KEY is not None,
            "chromadb": chroma_client is not None,
            "embeddings": embedding_model is not None
        }
    }

@app.post("/extract-text/")
async def extract_text(file: UploadFile = File(...)):
    """Extract text from uploaded documents"""
    try:
        contents = await file.read()
        
        if file.filename.lower().endswith('.pdf'):
            pdf = fitz.open(stream=contents, filetype="pdf")
            text = ""
            for page in pdf:
                text += page.get_text()
            pdf.close()
        elif file.filename.lower().endswith('.txt'):
            text = contents.decode('utf-8')
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        return {
            "filename": file.filename,
            "text": text,
            "length": len(text)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.post("/process-documents/")
async def process_documents(documents: List[DocumentUpload]):
    """Process documents and store embeddings"""
    if not chroma_client or not embedding_model:
        raise HTTPException(status_code=500, detail="Vector store or embedding model not available")
    
    try:
        processed_docs = []
        
        for doc in documents:
            # Generate embeddings
            embeddings = embedding_model.encode(doc.content)
            
            # Store in ChromaDB
            collection.add(
                embeddings=[embeddings.tolist()],
                documents=[doc.content],
                metadatas=[doc.metadata],
                ids=[doc.filename]
            )
            
            processed_docs.append({
                "filename": doc.filename,
                "status": "processed",
                "embedding_size": len(embeddings)
            })
        
        return {
            "message": f"Processed {len(processed_docs)} documents",
            "documents": processed_docs
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing documents: {str(e)}")

@app.post("/search-documents/")
async def search_documents(query: str, n_results: int = 5):
    """Search documents using vector similarity"""
    if not chroma_client or not embedding_model:
        raise HTTPException(status_code=500, detail="Vector store or embedding model not available")
    
    try:
        # Generate query embedding
        query_embedding = embedding_model.encode(query)
        
        # Search in ChromaDB
        results = collection.query(
            query_embeddings=[query_embedding.tolist()],
            n_results=n_results
        )
        
        return {
            "query": query,
            "results": [
                {
                    "document": doc,
                    "metadata": meta,
                    "distance": dist
                }
                for doc, meta, dist in zip(
                    results['documents'][0],
                    results['metadatas'][0],
                    results['distances'][0]
                )
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching documents: {str(e)}")

@app.post("/generate-embeddings/")
async def generate_embeddings(text: str, model: str = "openai"):
    """Generate embeddings for text"""
    try:
        if model == "openai" and openai_client:
            response = openai_client.embeddings.create(
                input=text,
                model="text-embedding-ada-002"
            )
            return {
                "model": "openai",
                "embedding": response.data[0].embedding,
                "dimensions": len(response.data[0].embedding)
            }
        elif model == "sentence-transformers" and embedding_model:
            embedding = embedding_model.encode(text)
            return {
                "model": "sentence-transformers",
                "embedding": embedding.tolist(),
                "dimensions": len(embedding)
            }
        else:
            raise HTTPException(status_code=400, detail=f"Model {model} not available")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating embeddings: {str(e)}")

@app.post("/call-llm/")
async def call_llm(
    prompt: str,
    model: str = "gpt-3.5-turbo",
    temperature: float = 0.7,
    max_tokens: int = 1000,
    context: Optional[str] = None
):
    """Call LLM with prompt and optional context"""
    try:
        # Prepare the full prompt with context if provided
        full_prompt = prompt
        if context:
            full_prompt = f"Context: {context}\n\nQuestion: {prompt}\n\nAnswer:"
        
        if model.startswith("gpt") and openai_client:
            response = openai_client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are a helpful AI assistant."},
                    {"role": "user", "content": full_prompt}
                ],
                temperature=temperature,
                max_tokens=max_tokens
            )
            return {
                "model": model,
                "response": response.choices[0].message.content,
                "usage": response.usage.dict()
            }
        elif model.startswith("gemini") and GEMINI_API_KEY:
            gemini_model = genai.GenerativeModel(model)
            response = gemini_model.generate_content(full_prompt)
            return {
                "model": model,
                "response": response.text,
                "usage": {"total_tokens": len(full_prompt.split())}
            }
        else:
            raise HTTPException(status_code=400, detail=f"Model {model} not available")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling LLM: {str(e)}")

@app.post("/web-search/")
async def web_search(query: str, engine: str = "google"):
    """Perform web search using SerpAPI"""
    if not SERPAPI_API_KEY:
        raise HTTPException(status_code=500, detail="SerpAPI not configured")
    
    try:
        search = GoogleSearch({
            "q": query,
            "api_key": SERPAPI_API_KEY,
            "num": 5
        })
        results = search.get_dict()
        
        return {
            "query": query,
            "results": results.get("organic_results", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error performing web search: {str(e)}")

@app.post("/execute-workflow/")
async def execute_workflow(request: WorkflowRequest):
    """Execute a complete workflow"""
    try:
        workflow = request.workflow
        query = request.query
        
        # Parse workflow nodes and edges
        nodes = {node["id"]: node for node in workflow.get("nodes", [])}
        edges = workflow.get("edges", [])
        
        # Build execution graph
        execution_graph = build_execution_graph(nodes, edges)
        
        # Execute workflow
        result = await execute_workflow_graph(execution_graph, nodes, query)
        
        return {
            "response": result,
            "workflow_id": workflow.get("id", "unknown"),
            "execution_time": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error executing workflow: {str(e)}")

def build_execution_graph(nodes: Dict, edges: List[Dict]) -> Dict:
    """Build execution graph from nodes and edges"""
    graph = {}
    
    # Initialize graph
    for node_id in nodes:
        graph[node_id] = {
            "node": nodes[node_id],
            "dependencies": [],
            "dependents": []
        }
    
    # Add edges
    for edge in edges:
        source = edge["source"]
        target = edge["target"]
        
        if source in graph and target in graph:
            graph[source]["dependents"].append(target)
            graph[target]["dependencies"].append(source)
    
    return graph

async def execute_workflow_graph(graph: Dict, nodes: Dict, query: str) -> str:
    """Execute workflow graph"""
    # Find start node (User Query)
    start_nodes = [node_id for node_id, data in graph.items() 
                   if data["node"]["type"] == "userQuery" and not data["dependencies"]]
    
    if not start_nodes:
        raise Exception("No start node found")
    
    # Execute in topological order
    executed = set()
    results = {}
    
    async def execute_node(node_id: str) -> Any:
        if node_id in executed:
            return results[node_id]
        
        node_data = graph[node_id]
        node = node_data["node"]
        
        # Execute dependencies first
        for dep in node_data["dependencies"]:
            await execute_node(dep)
        
        # Execute current node
        result = await execute_single_node(node, query, results)
        results[node_id] = result
        executed.add(node_id)
        
        return result
    
    # Execute all nodes
    for start_node in start_nodes:
        await execute_node(start_node)
    
    # Find output node
    output_nodes = [node_id for node_id, data in graph.items() 
                    if data["node"]["type"] == "output"]
    
    if output_nodes:
        return results.get(output_nodes[0], "No output generated")
    else:
        return "Workflow completed but no output node found"

async def execute_single_node(node: Dict, query: str, previous_results: Dict) -> str:
    """Execute a single node"""
    node_type = node["type"]
    config = node.get("data", {}).get("config", {})
    
    if node_type == "userQuery":
        return query
    
    elif node_type == "knowledgeBase":
        # Search documents for relevant context
        if chroma_client and embedding_model:
            try:
                query_embedding = embedding_model.encode(query)
                results = collection.query(
                    query_embeddings=[query_embedding.tolist()],
                    n_results=3
                )
                
                if results['documents'][0]:
                    context = "\n".join(results['documents'][0])
                    return f"Context from knowledge base:\n{context}"
                else:
                    return "No relevant documents found in knowledge base."
            except Exception as e:
                return f"Error searching knowledge base: {str(e)}"
        else:
            return "Knowledge base not available."
    
    elif node_type == "llmEngine":
        # Get inputs from previous nodes
        input_query = query
        input_context = ""
        
        # Find connected nodes
        for node_id, result in previous_results.items():
            if nodes[node_id]["type"] == "userQuery":
                input_query = result
            elif nodes[node_id]["type"] == "knowledgeBase":
                input_context = result
        
        # Call LLM
        try:
            model = config.get("model", "gpt-3.5-turbo")
            temperature = config.get("temperature", 0.7)
            
            if model.startswith("gpt") and openai_client:
                full_prompt = input_query
                if input_context:
                    full_prompt = f"Context: {input_context}\n\nQuestion: {input_query}\n\nAnswer:"
                
                response = openai_client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": config.get("customPrompt", "You are a helpful AI assistant.")},
                        {"role": "user", "content": full_prompt}
                    ],
                    temperature=temperature,
                    max_tokens=1000
                )
                return response.choices[0].message.content
            else:
                return f"LLM model {model} not available."
        except Exception as e:
            return f"Error calling LLM: {str(e)}"
    
    elif node_type == "output":
        # Return the result from the previous node
        for node_id, result in previous_results.items():
            if nodes[node_id]["type"] == "llmEngine":
                return result
        return "No input received for output node."
    
    else:
        return f"Unknown node type: {node_type}"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
