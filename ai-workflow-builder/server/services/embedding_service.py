import chromadb
from chromadb.config import Settings
import openai
import google.generativeai as genai
from typing import List, Dict, Any
import os
from dotenv import load_dotenv
import uuid

load_dotenv()

class EmbeddingService:
    def __init__(self):
        self.openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        
        # Initialize ChromaDB
        self.chroma_client = chromadb.PersistentClient(
            path=os.getenv("CHROMA_DB_PATH", "./chroma_db")
        )
        
    def create_collection(self, collection_name: str):
        """Create a new ChromaDB collection"""
        try:
            collection = self.chroma_client.create_collection(
                name=collection_name,
                metadata={"hnsw:space": "cosine"}
            )
            return collection
        except Exception as e:
            # Collection might already exist, get it instead
            return self.chroma_client.get_collection(name=collection_name)
    
    def get_openai_embeddings(self, texts: List[str], model: str = "text-embedding-ada-002") -> List[List[float]]:
        """Generate embeddings using OpenAI"""
        response = self.openai_client.embeddings.create(
            input=texts,
            model=model
        )
        return [data.embedding for data in response.data]
    
    def get_google_embeddings(self, texts: List[str], model: str = "models/embedding-001") -> List[List[float]]:
        """Generate embeddings using Google Generative AI"""
        embeddings = []
        for text in texts:
            result = genai.embed_content(
                model=model,
                content=text,
                task_type="retrieval_document"
            )
            embeddings.append(result['embedding'])
        return embeddings
    
    def add_documents_to_collection(self, collection_name: str, texts: List[str], 
                                  metadatas: List[Dict[str, Any]] = None, 
                                  embedding_provider: str = "openai") -> List[str]:
        """Add documents to ChromaDB collection"""
        collection = self.get_collection(collection_name)
        
        # Generate embeddings
        if embedding_provider == "openai":
            embeddings = self.get_openai_embeddings(texts)
        else:
            embeddings = self.get_google_embeddings(texts)
        
        # Generate unique IDs
        ids = [str(uuid.uuid4()) for _ in texts]
        
        # Add to collection
        collection.add(
            embeddings=embeddings,
            documents=texts,
            metadatas=metadatas or [{"source": f"doc_{i}"} for i in range(len(texts))],
            ids=ids
        )
        
        return ids
    
    def query_collection(self, collection_name: str, query_text: str, 
                        n_results: int = 5, embedding_provider: str = "openai") -> Dict[str, Any]:
        """Query ChromaDB collection for similar documents"""
        collection = self.get_collection(collection_name)
        
        # Generate query embedding
        if embedding_provider == "openai":
            query_embedding = self.get_openai_embeddings([query_text])[0]
        else:
            query_embedding = self.get_google_embeddings([query_text])[0]
        
        # Query collection
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        
        return results
    
    def get_collection(self, collection_name: str):
        """Get existing ChromaDB collection"""
        try:
            return self.chroma_client.get_collection(name=collection_name)
        except Exception as e:
            return self.create_collection(collection_name)
    
    def list_collections(self) -> List[str]:
        """List all ChromaDB collections"""
        collections = self.chroma_client.list_collections()
        return [col.name for col in collections]
    
    def delete_collection(self, collection_name: str):
        """Delete a ChromaDB collection"""
        self.chroma_client.delete_collection(name=collection_name)