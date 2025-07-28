import React from 'react';
import { Handle, Position } from 'reactflow';
import { Database } from 'lucide-react';

export default function KnowledgeBaseNode({ data, selected }) {
  return (
    <div className={`bg-white border-2 rounded-lg p-4 min-w-[200px] shadow-sm ${
      selected ? 'border-green-500 shadow-lg' : 'border-gray-200'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-green-500 p-1.5 rounded text-white">
          <Database className="w-4 h-4" />
        </div>
        <span className="font-medium text-gray-900">Knowledge Base</span>
      </div>
      
      <div className="text-sm text-gray-600 mb-2">
        Document processing & retrieval
      </div>
      
      {data.config && (
        <div className="space-y-1">
          {data.config.collectionName && (
            <div className="text-xs text-gray-500">
              Collection: <span className="font-mono bg-gray-100 px-1 rounded">{data.config.collectionName}</span>
            </div>
          )}
          <div className="text-xs text-gray-500">
            Provider: {data.config.embeddingProvider || 'openai'} | Max: {data.config.maxResults || 5}
          </div>
        </div>
      )}
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ left: -6 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ right: -6 }}
      />
    </div>
  );
}