from typing import Dict, Any, List, Optional
import json
import time
from datetime import datetime
from .llm_service import LLMService
from .document_service import DocumentService
from .embedding_service import EmbeddingService

class WorkflowService:
    def __init__(self):
        self.llm_service = LLMService()
        self.document_service = DocumentService()
        self.embedding_service = EmbeddingService()
    
    def validate_workflow(self, nodes: List[Dict], edges: List[Dict]) -> Dict[str, Any]:
        """Validate workflow structure and configuration"""
        errors = []
        warnings = []
        
        # Check if workflow has required components
        node_types = [node.get("type") for node in nodes]
        
        if "userQuery" not in node_types:
            errors.append("Workflow must have a User Query component")
        
        if "output" not in node_types:
            errors.append("Workflow must have an Output component")
        
        if "llmEngine" not in node_types:
            warnings.append("Workflow should have an LLM Engine component")
        
        # Check component configurations
        for node in nodes:
            node_type = node.get("type")
            node_data = node.get("data", {})
            
            if node_type == "llmEngine":
                if not node_data.get("modelProvider"):
                    warnings.append(f"LLM Engine node {node.get('id')} should specify a model provider")
            
            elif node_type == "knowledgeBase":
                if not node_data.get("collectionName"):
                    warnings.append(f"Knowledge Base node {node.get('id')} should specify a collection name")
        
        # Check connectivity
        connected_nodes = set()
        for edge in edges:
            connected_nodes.add(edge.get("source"))
            connected_nodes.add(edge.get("target"))
        
        unconnected_nodes = []
        for node in nodes:
            if node.get("id") not in connected_nodes:
                unconnected_nodes.append(node.get("id"))
        
        if unconnected_nodes:
            warnings.append(f"Unconnected nodes: {', '.join(unconnected_nodes)}")
        
        return {
            "valid": len(errors) == 0,
            "errors": errors,
            "warnings": warnings
        }
    
    def build_execution_order(self, nodes: List[Dict], edges: List[Dict]) -> List[str]:
        """Build execution order based on node connections"""
        # Create adjacency list
        graph = {}
        in_degree = {}
        
        for node in nodes:
            node_id = node.get("id")
            graph[node_id] = []
            in_degree[node_id] = 0
        
        for edge in edges:
            source = edge.get("source")
            target = edge.get("target")
            
            if source in graph:
                graph[source].append(target)
                in_degree[target] += 1
        
        # Topological sort
        queue = [node_id for node_id, degree in in_degree.items() if degree == 0]
        execution_order = []
        
        while queue:
            current = queue.pop(0)
            execution_order.append(current)
            
            for neighbor in graph[current]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)
        
        return execution_order
    
    def execute_workflow(self, nodes: List[Dict], edges: List[Dict], 
                        user_query: str, session_id: Optional[str] = None) -> Dict[str, Any]:
        """Execute workflow with user query"""
        start_time = time.time()
        
        # Validate workflow
        validation = self.validate_workflow(nodes, edges)
        if not validation["valid"]:
            return {
                "success": False,
                "errors": validation["errors"],
                "execution_time": 0
            }
        
        # Build execution order
        execution_order = self.build_execution_order(nodes, edges)
        
        # Create node lookup
        node_lookup = {node["id"]: node for node in nodes}
        
        # Track data flow between components
        component_data = {"user_query": user_query}
        execution_log = []
        
        try:
            for node_id in execution_order:
                node = node_lookup[node_id]
                node_type = node.get("type")
                node_data = node.get("data", {})
                
                step_start = time.time()
                
                if node_type == "userQuery":
                    result = self._execute_user_query_component(node_data, user_query)
                
                elif node_type == "knowledgeBase":
                    result = self._execute_knowledge_base_component(
                        node_data, component_data.get("user_query", user_query)
                    )
                    if result.get("success"):
                        component_data["context"] = result.get("context", "")
                
                elif node_type == "llmEngine":
                    result = self._execute_llm_engine_component(
                        node_data, 
                        component_data.get("user_query", user_query),
                        component_data.get("context", "")
                    )
                    if result.get("success"):
                        component_data["llm_response"] = result.get("response", "")
                
                elif node_type == "output":
                    result = self._execute_output_component(
                        node_data, 
                        component_data.get("llm_response", "No response generated")
                    )
                
                else:
                    result = {"success": False, "error": f"Unknown node type: {node_type}"}
                
                step_time = (time.time() - step_start) * 1000
                
                execution_log.append({
                    "node_id": node_id,
                    "node_type": node_type,
                    "execution_time_ms": round(step_time, 2),
                    "success": result.get("success", False),
                    "result": result
                })
                
                if not result.get("success"):
                    break
            
            total_time = (time.time() - start_time) * 1000
            
            return {
                "success": True,
                "final_response": component_data.get("llm_response", "No response generated"),
                "execution_time_ms": round(total_time, 2),
                "execution_log": execution_log,
                "session_id": session_id
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Workflow execution failed: {str(e)}",
                "execution_time_ms": round((time.time() - start_time) * 1000, 2),
                "execution_log": execution_log
            }
    
    def _execute_user_query_component(self, node_data: Dict, user_query: str) -> Dict[str, Any]:
        """Execute User Query component"""
        return {
            "success": True,
            "query": user_query,
            "component": "userQuery"
        }
    
    def _execute_knowledge_base_component(self, node_data: Dict, query: str) -> Dict[str, Any]:
        """Execute Knowledge Base component"""
        collection_name = node_data.get("collectionName")
        if not collection_name:
            return {
                "success": False,
                "error": "Knowledge Base component requires collection name"
            }
        
        embedding_provider = node_data.get("embeddingProvider", "openai")
        n_results = node_data.get("maxResults", 5)
        
        result = self.document_service.query_document_collection(
            collection_name=collection_name,
            query=query,
            n_results=n_results,
            embedding_provider=embedding_provider
        )
        
        if result.get("success"):
            # Combine contexts into a single string
            contexts = result.get("contexts", [])
            combined_context = "\n\n".join([ctx["content"] for ctx in contexts])
            
            return {
                "success": True,
                "context": combined_context,
                "retrieved_documents": len(contexts),
                "component": "knowledgeBase"
            }
        else:
            return result
    
    def _execute_llm_engine_component(self, node_data: Dict, query: str, context: str = "") -> Dict[str, Any]:
        """Execute LLM Engine component"""
        model_provider = node_data.get("modelProvider", "openai")
        model = node_data.get("model", "gpt-3.5-turbo")
        custom_prompt = node_data.get("customPrompt", "")
        use_web_search = node_data.get("useWebSearch", False)
        temperature = node_data.get("temperature", 0.7)
        
        result = self.llm_service.generate_response(
            prompt=query,
            context=context,
            model_provider=model_provider,
            model=model,
            use_web_search=use_web_search,
            custom_prompt=custom_prompt,
            temperature=temperature
        )
        
        if result.get("success"):
            return {
                "success": True,
                "response": result.get("response"),
                "model_used": result.get("model"),
                "component": "llmEngine"
            }
        else:
            return result
    
    def _execute_output_component(self, node_data: Dict, response: str) -> Dict[str, Any]:
        """Execute Output component"""
        return {
            "success": True,
            "output": response,
            "component": "output"
        }