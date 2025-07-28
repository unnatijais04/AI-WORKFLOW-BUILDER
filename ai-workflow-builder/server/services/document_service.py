import fitz  # PyMuPDF
from typing import Dict, Any, List
import os
import uuid
from datetime import datetime
from .embedding_service import EmbeddingService

class DocumentService:
    def __init__(self):
        self.embedding_service = EmbeddingService()
        
    def extract_text_from_pdf(self, file_content: bytes, filename: str) -> Dict[str, Any]:
        """Extract text from PDF file"""
        try:
            pdf_document = fitz.open(stream=file_content, filetype="pdf")
            
            text_content = ""
            page_contents = []
            
            for page_num in range(len(pdf_document)):
                page = pdf_document.load_page(page_num)
                page_text = page.get_text()
                text_content += page_text + "\n"
                
                page_contents.append({
                    "page_number": page_num + 1,
                    "content": page_text,
                    "char_count": len(page_text)
                })
            
            pdf_document.close()
            
            return {
                "success": True,
                "filename": filename,
                "total_pages": len(page_contents),
                "total_characters": len(text_content),
                "full_text": text_content,
                "pages": page_contents
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Error processing PDF: {str(e)}"
            }
    
    def chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
        """Split text into overlapping chunks for better embedding"""
        if len(text) <= chunk_size:
            return [text]
        
        chunks = []
        start = 0
        
        while start < len(text):
            end = start + chunk_size
            
            # Try to find a good breaking point (sentence or paragraph)
            if end < len(text):
                # Look for sentence endings near the chunk boundary
                for i in range(end, max(start + chunk_size // 2, end - 100), -1):
                    if text[i] in '.!?\n':
                        end = i + 1
                        break
            
            chunk = text[start:end].strip()
            if chunk:
                chunks.append(chunk)
            
            start = end - overlap
            
        return chunks
    
    def process_and_embed_document(self, file_content: bytes, filename: str, 
                                 collection_name: str = None,
                                 embedding_provider: str = "openai",
                                 chunk_size: int = 1000) -> Dict[str, Any]:
        """Process document and create embeddings"""
        
        # Extract text
        extraction_result = self.extract_text_from_pdf(file_content, filename)
        if not extraction_result["success"]:
            return extraction_result
        
        # Generate collection name if not provided
        if not collection_name:
            collection_name = f"doc_{uuid.uuid4().hex[:8]}"
        
        # Chunk the text
        chunks = self.chunk_text(extraction_result["full_text"], chunk_size)
        
        # Create metadata for each chunk
        metadatas = []
        for i, chunk in enumerate(chunks):
            metadatas.append({
                "filename": filename,
                "chunk_index": i,
                "chunk_size": len(chunk),
                "processed_date": datetime.utcnow().isoformat()
            })
        
        try:
            # Add to vector store
            document_ids = self.embedding_service.add_documents_to_collection(
                collection_name=collection_name,
                texts=chunks,
                metadatas=metadatas,
                embedding_provider=embedding_provider
            )
            
            return {
                "success": True,
                "filename": filename,
                "collection_name": collection_name,
                "total_chunks": len(chunks),
                "document_ids": document_ids,
                "embedding_provider": embedding_provider,
                "document_info": {
                    "total_pages": extraction_result["total_pages"],
                    "total_characters": extraction_result["total_characters"]
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Error creating embeddings: {str(e)}"
            }
    
    def query_document_collection(self, collection_name: str, query: str, 
                                n_results: int = 5,
                                embedding_provider: str = "openai") -> Dict[str, Any]:
        """Query document collection for relevant context"""
        try:
            results = self.embedding_service.query_collection(
                collection_name=collection_name,
                query_text=query,
                n_results=n_results,
                embedding_provider=embedding_provider
            )
            
            # Format results for easy consumption
            contexts = []
            if results.get("documents"):
                for i, doc in enumerate(results["documents"][0]):
                    metadata = results["metadatas"][0][i] if results.get("metadatas") else {}
                    distance = results["distances"][0][i] if results.get("distances") else None
                    
                    contexts.append({
                        "content": doc,
                        "metadata": metadata,
                        "similarity_score": 1 - distance if distance is not None else None
                    })
            
            return {
                "success": True,
                "query": query,
                "contexts": contexts,
                "collection_name": collection_name
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Error querying collection: {str(e)}"
            }
    
    def get_collection_info(self, collection_name: str) -> Dict[str, Any]:
        """Get information about a document collection"""
        try:
            collection = self.embedding_service.get_collection(collection_name)
            count = collection.count()
            
            return {
                "success": True,
                "collection_name": collection_name,
                "document_count": count,
                "exists": True
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Collection not found: {str(e)}",
                "exists": False
            }