import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Document APIs
export const documentAPI = {
  upload: async (file, collectionName = null, embeddingProvider = 'openai') => {
    const formData = new FormData();
    formData.append('file', file);
    if (collectionName) formData.append('collection_name', collectionName);
    formData.append('embedding_provider', embeddingProvider);
    
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  query: async (collectionName, query, nResults = 5, embeddingProvider = 'openai') => {
    const response = await api.post('/documents/query', {
      collection_name: collectionName,
      query,
      n_results: nResults,
      embedding_provider: embeddingProvider,
    });
    return response.data;
  },

  listCollections: async () => {
    const response = await api.get('/documents/collections');
    return response.data;
  },

  listDocuments: async () => {
    const response = await api.get('/documents');
    return response.data;
  },
};

// LLM APIs
export const llmAPI = {
  generate: async (prompt, context = '', modelProvider = 'openai', model = 'gpt-3.5-turbo', 
                  useWebSearch = false, customPrompt = '', temperature = 0.7) => {
    const response = await api.post('/llm/generate', {
      prompt,
      context,
      model_provider: modelProvider,
      model,
      use_web_search: useWebSearch,
      custom_prompt: customPrompt,
      temperature,
    });
    return response.data;
  },

  getModels: async () => {
    const response = await api.get('/llm/models');
    return response.data;
  },
};

// Workflow APIs
export const workflowAPI = {
  validate: async (nodes, edges) => {
    const response = await api.post('/workflow/validate', {
      nodes,
      edges,
    });
    return response.data;
  },

  execute: async (nodes, edges, userQuery, sessionId = null) => {
    const response = await api.post('/workflow/execute', {
      nodes,
      edges,
      user_query: userQuery,
      session_id: sessionId,
    });
    return response.data;
  },

  save: async (name, description, nodes, edges) => {
    const response = await api.post('/workflow/save', {
      name,
      description,
      nodes,
      edges,
    });
    return response.data;
  },

  get: async (workflowId) => {
    const response = await api.get(`/workflow/${workflowId}`);
    return response.data;
  },

  list: async () => {
    const response = await api.get('/workflows');
    return response.data;
  },
};

// Chat APIs
export const chatAPI = {
  createSession: async (workflowId = null) => {
    const response = await api.post('/chat/session', null, {
      params: { workflow_id: workflowId },
    });
    return response.data;
  },

  getHistory: async (sessionId) => {
    const response = await api.get(`/chat/session/${sessionId}/messages`);
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;