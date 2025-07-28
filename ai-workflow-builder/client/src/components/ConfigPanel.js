import React, { useState, useEffect } from 'react';
import { X, Settings, Upload, Database, Brain, Monitor } from 'lucide-react';
import { documentAPI, llmAPI } from '../services/api';
import toast from 'react-hot-toast';

const ConfigPanel = ({ selectedNode, onNodeUpdate, onClose }) => {
  const [config, setConfig] = useState(selectedNode.data.config || {});
  const [collections, setCollections] = useState([]);
  const [models, setModels] = useState({ openai: [], gemini: [] });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setConfig(selectedNode.data.config || {});
    
    // Load collections and models
    loadCollections();
    loadModels();
  }, [selectedNode]);

  const loadCollections = async () => {
    try {
      const result = await documentAPI.listCollections();
      setCollections(result.collections || []);
    } catch (error) {
      console.error('Failed to load collections:', error);
    }
  };

  const loadModels = async () => {
    try {
      const result = await llmAPI.getModels();
      setModels(result);
    } catch (error) {
      console.error('Failed to load models:', error);
    }
  };

  const handleConfigChange = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    
    const updatedNode = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        config: newConfig
      }
    };
    onNodeUpdate(updatedNode);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await documentAPI.upload(file, config.collectionName, config.embeddingProvider);
      if (result.success) {
        toast.success(`Document uploaded successfully to collection: ${result.collection_name}`);
        handleConfigChange('collectionName', result.collection_name);
        loadCollections(); // Refresh collections list
      } else {
        toast.error('Failed to upload document');
      }
    } catch (error) {
      toast.error('Error uploading document');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const getIcon = () => {
    switch (selectedNode.type) {
      case 'userQuery': return <Database className="w-5 h-5 text-blue-500" />;
      case 'knowledgeBase': return <Database className="w-5 h-5 text-green-500" />;
      case 'llmEngine': return <Brain className="w-5 h-5 text-purple-500" />;
      case 'output': return <Monitor className="w-5 h-5 text-orange-500" />;
      default: return <Settings className="w-5 h-5 text-gray-500" />;
    }
  };

  const renderUserQueryConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Placeholder Text
        </label>
        <input
          type="text"
          value={config.placeholder || ''}
          onChange={(e) => handleConfigChange('placeholder', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your question here..."
        />
      </div>
    </div>
  );

  const renderKnowledgeBaseConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Collection Name
        </label>
        <select
          value={config.collectionName || ''}
          onChange={(e) => handleConfigChange('collectionName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select or create collection</option>
          {collections.map((collection) => (
            <option key={collection} value={collection}>
              {collection}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Select existing collection or upload document to create new one
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Document
        </label>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="flex-1 text-sm text-gray-500 file:mr-2 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
          {isUploading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Embedding Provider
        </label>
        <select
          value={config.embeddingProvider || 'openai'}
          onChange={(e) => handleConfigChange('embeddingProvider', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="openai">OpenAI</option>
          <option value="gemini">Google Gemini</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Results
        </label>
        <input
          type="number"
          min="1"
          max="20"
          value={config.maxResults || 5}
          onChange={(e) => handleConfigChange('maxResults', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
    </div>
  );

  const renderLLMEngineConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Model Provider
        </label>
        <select
          value={config.modelProvider || 'openai'}
          onChange={(e) => handleConfigChange('modelProvider', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="openai">OpenAI</option>
          <option value="gemini">Google Gemini</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Model
        </label>
        <select
          value={config.model || 'gpt-3.5-turbo'}
          onChange={(e) => handleConfigChange('model', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {(models[config.modelProvider || 'openai'] || []).map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
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
          onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Conservative</span>
          <span>Creative</span>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={config.useWebSearch || false}
            onChange={(e) => handleConfigChange('useWebSearch', e.target.checked)}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-sm font-medium text-gray-700">Use Web Search</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Prompt
        </label>
        <textarea
          value={config.customPrompt || ''}
          onChange={(e) => handleConfigChange('customPrompt', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={3}
          placeholder="Add system prompt or instructions..."
        />
      </div>
    </div>
  );

  const renderOutputConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Display Format
        </label>
        <select
          value={config.displayFormat || 'text'}
          onChange={(e) => handleConfigChange('displayFormat', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="text">Plain Text</option>
          <option value="markdown">Markdown</option>
          <option value="html">HTML</option>
        </select>
      </div>
    </div>
  );

  const renderConfigContent = () => {
    switch (selectedNode.type) {
      case 'userQuery': return renderUserQueryConfig();
      case 'knowledgeBase': return renderKnowledgeBaseConfig();
      case 'llmEngine': return renderLLMEngineConfig();
      case 'output': return renderOutputConfig();
      default: return <div>No configuration available</div>;
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedNode.data.label}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Configure this component's behavior and parameters.
        </p>
      </div>

      {renderConfigContent()}
    </div>
  );
};

export default ConfigPanel;