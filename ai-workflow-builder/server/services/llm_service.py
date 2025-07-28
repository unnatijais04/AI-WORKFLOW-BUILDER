import openai
import google.generativeai as genai
from typing import Dict, Any, Optional, List
import os
from dotenv import load_dotenv
import requests
import json

load_dotenv()

class LLMService:
    def __init__(self):
        self.openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        self.serpapi_key = os.getenv("SERPAPI_API_KEY")
        
    def generate_openai_response(self, prompt: str, context: str = "", 
                               model: str = "gpt-3.5-turbo", 
                               temperature: float = 0.7,
                               max_tokens: int = 4000) -> Dict[str, Any]:
        """Generate response using OpenAI GPT"""
        try:
            messages = []
            
            if context:
                messages.append({
                    "role": "system",
                    "content": f"Use the following context to answer the user's question:\n\n{context}"
                })
            
            messages.append({
                "role": "user",
                "content": prompt
            })
            
            response = self.openai_client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            
            return {
                "success": True,
                "response": response.choices[0].message.content,
                "model": model,
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens
                }
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def generate_gemini_response(self, prompt: str, context: str = "",
                               model: str = "gemini-pro",
                               temperature: float = 0.7) -> Dict[str, Any]:
        """Generate response using Google Gemini"""
        try:
            model_instance = genai.GenerativeModel(model)
            
            full_prompt = prompt
            if context:
                full_prompt = f"Context:\n{context}\n\nQuestion: {prompt}"
            
            generation_config = genai.types.GenerationConfig(
                temperature=temperature,
                max_output_tokens=4000,
            )
            
            response = model_instance.generate_content(
                full_prompt,
                generation_config=generation_config
            )
            
            return {
                "success": True,
                "response": response.text,
                "model": model
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def search_web(self, query: str, num_results: int = 5) -> Dict[str, Any]:
        """Search the web using SerpAPI"""
        if not self.serpapi_key:
            return {
                "success": False,
                "error": "SerpAPI key not configured"
            }
        
        try:
            url = "https://serpapi.com/search"
            params = {
                "q": query,
                "api_key": self.serpapi_key,
                "engine": "google",
                "num": num_results
            }
            
            response = requests.get(url, params=params)
            data = response.json()
            
            # Extract organic results
            organic_results = data.get("organic_results", [])
            
            search_results = []
            for result in organic_results:
                search_results.append({
                    "title": result.get("title", ""),
                    "snippet": result.get("snippet", ""),
                    "link": result.get("link", "")
                })
            
            return {
                "success": True,
                "results": search_results,
                "query": query
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def generate_with_web_search(self, prompt: str, model_provider: str = "openai",
                               model: str = "gpt-3.5-turbo", context: str = "",
                               use_web_search: bool = False) -> Dict[str, Any]:
        """Generate response with optional web search"""
        web_results = ""
        
        if use_web_search:
            search_result = self.search_web(prompt)
            if search_result["success"]:
                web_snippets = []
                for result in search_result["results"]:
                    web_snippets.append(f"- {result['title']}: {result['snippet']}")
                web_results = "\n".join(web_snippets)
                
                # Combine web results with context
                if context:
                    context += f"\n\nWeb Search Results:\n{web_results}"
                else:
                    context = f"Web Search Results:\n{web_results}"
        
        # Generate response based on provider
        if model_provider == "openai":
            return self.generate_openai_response(prompt, context, model)
        elif model_provider == "gemini":
            return self.generate_gemini_response(prompt, context, model)
        else:
            return {
                "success": False,
                "error": f"Unsupported model provider: {model_provider}"
            }
    
    def generate_response(self, prompt: str, context: str = "", 
                         model_provider: str = "openai",
                         model: str = "gpt-3.5-turbo",
                         use_web_search: bool = False,
                         custom_prompt: str = "",
                         temperature: float = 0.7) -> Dict[str, Any]:
        """Main method to generate LLM response with all options"""
        
        # Apply custom prompt if provided
        if custom_prompt:
            prompt = f"{custom_prompt}\n\nUser Query: {prompt}"
        
        return self.generate_with_web_search(
            prompt=prompt,
            model_provider=model_provider,
            model=model,
            context=context,
            use_web_search=use_web_search
        )