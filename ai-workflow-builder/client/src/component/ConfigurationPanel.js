import React, { useState } from 'react';
import { X, Upload, Settings, Database, Brain, MessageSquare } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export default function ConfigurationPanel({ node, onClose }) {
  const [config, setConfig] = useState(node.data.config || {});

  // Move useDropzone to component level to fix React Hooks rule
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    onDrop: (acceptedFiles) => {
      const newConfig = { ...config, documents: [...(config.documents || []), ...acceptedFiles] };
      setConfig(newConfig);
      node.data.config = newConfig;
    }
  });

  const updateConfig = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    // Update node data
    node.data.config = newConfig;
  };

  const renderUserQueryConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Node Label
        </label>
        <input
          type="text"
          value={config.label || 'User Query'}
          onChange={(e) => updateConfig('label', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={config.description || ''}
          onChange={(e) => updateConfig('description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="Enter node description..."
        />
      </div>
    </div>
  );

  const renderKnowledgeBaseConfig = () => {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Node Label
          </label>
          <input
            type="text"
            value={config.label || 'Knowledge Base'}
            onChange={(e) => updateConfig('label', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Embedding Model
          </label>
          <select
            value={config.embeddingModel || 'openai'}
            onChange={(e) => updateConfig('embeddingModel', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="openai">OpenAI Embeddings</option>
            <option value="gemini">Gemini Embeddings</option>
            <option value="sentence-transformers">Sentence Transformers</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vector Store
          </label>
          <select
            value={config.vectorStore || 'chromadb'}
            onChange={(e) => updateConfig('vectorStore', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="chromadb">ChromaDB</option>
            <option value="pinecone">Pinecone</option>
            <option value="weaviate">Weaviate</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Documents
          </label>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
          >
            <input {...getInputProps()} />
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">
              Drag & drop files here, or click to select
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports PDF, TXT, DOCX
            </p>
          </div>
        </div>

        {config.documents && config.documents.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Uploaded Documents ({config.documents.length})
            </label>
            <div className="space-y-2">
              {config.documents.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    onClick={() => {
                      const newDocs = config.documents.filter((_, i) => i !== index);
                      updateConfig('documents', newDocs);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderLLMConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Node Label
        </label>
        <input
          type="text"
          value={config.label || 'LLM Engine'}
          onChange={(e) => updateConfig('label', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          LLM Provider
        </label>
        <select
          value={config.provider || 'openai'}
          onChange={(e) => updateConfig('provider', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="openai">OpenAI GPT</option>
          <option value="gemini">Google Gemini</option>
          <option value="anthropic">Anthropic Claude</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Model
        </label>
        <select
          value={config.model || 'gpt-3.5-turbo'}
          onChange={(e) => updateConfig('model', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-4-turbo">GPT-4 Turbo</option>
          <option value="gemini-pro">Gemini Pro</option>
          <option value="claude-3-sonnet">Claude 3 Sonnet</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Temperature: {config.temperature || 0.7}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={config.temperature || 0.7}
          onChange={(e) => updateConfig('temperature', parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Conservative (0)</span>
          <span>Creative (2)</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Prompt (Optional)
        </label>
        <textarea
          value={config.customPrompt || ''}
          onChange={(e) => updateConfig('customPrompt', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="Enter custom system prompt..."
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="useWebSearch"
          checked={config.useWebSearch || false}
          onChange={(e) => updateConfig('useWebSearch', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="useWebSearch" className="text-sm text-gray-700">
          Enable Web Search (SerpAPI/Brave)
        </label>
      </div>
    </div>
  );

  const renderOutputConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Node Label
        </label>
        <input
          type="text"
          value={config.label || 'Output'}
          onChange={(e) => updateConfig('label', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chat Interface Style
        </label>
        <select
          value={config.chatStyle || 'modern'}
          onChange={(e) => updateConfig('chatStyle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="modern">Modern</option>
          <option value="minimal">Minimal</option>
          <option value="professional">Professional</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="saveHistory"
          checked={config.saveHistory || true}
          onChange={(e) => updateConfig('saveHistory', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="saveHistory" className="text-sm text-gray-700">
          Save Chat History
        </label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="showTimestamps"
          checked={config.showTimestamps || false}
          onChange={(e) => updateConfig('showTimestamps', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="showTimestamps" className="text-sm text-gray-700">
          Show Timestamps
        </label>
      </div>
    </div>
  );

  const getNodeIcon = () => {
    switch (node.type) {
      case 'userQuery':
        return <MessageSquare className="w-5 h-5" />;
      case 'knowledgeBase':
        return <Database className="w-5 h-5" />;
      case 'llmEngine':
        return <Brain className="w-5 h-5" />;
      case 'output':
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <Settings className="w-5 h-5" />;
    }
  };

  const getNodeTitle = () => {
    switch (node.type) {
      case 'userQuery':
        return 'User Query Configuration';
      case 'knowledgeBase':
        return 'Knowledge Base Configuration';
      case 'llmEngine':
        return 'LLM Engine Configuration';
      case 'output':
        return 'Output Configuration';
      default:
        return 'Node Configuration';
    }
  };

  const renderConfigContent = () => {
    switch (node.type) {
      case 'userQuery':
        return renderUserQueryConfig();
      case 'knowledgeBase':
        return renderKnowledgeBaseConfig();
      case 'llmEngine':
        return renderLLMConfig();
      case 'output':
        return renderOutputConfig();
      default:
        return <div>No configuration available for this node type.</div>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          {getNodeIcon()}
          <h3 className="ml-2 text-lg font-semibold text-gray-800">
            {getNodeTitle()}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {renderConfigContent()}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
} 