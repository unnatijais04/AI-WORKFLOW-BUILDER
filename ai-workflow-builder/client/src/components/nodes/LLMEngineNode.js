import React from 'react';
import { Handle, Position } from 'reactflow';
import { Brain, Globe } from 'lucide-react';

export default function LLMEngineNode({ data, selected }) {
  return (
    <div className={`bg-white border-2 rounded-lg p-4 min-w-[200px] shadow-sm ${
      selected ? 'border-purple-500 shadow-lg' : 'border-gray-200'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-purple-500 p-1.5 rounded text-white">
          <Brain className="w-4 h-4" />
        </div>
        <span className="font-medium text-gray-900">LLM Engine</span>
      </div>
      
      <div className="text-sm text-gray-600 mb-2">
        AI response generation
      </div>
      
      {data.config && (
        <div className="space-y-1">
          <div className="text-xs text-gray-500">
            Model: <span className="font-mono bg-gray-100 px-1 rounded">
              {data.config.modelProvider || 'openai'}/{data.config.model || 'gpt-3.5-turbo'}
            </span>
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            Temp: {data.config.temperature || 0.7}
            {data.config.useWebSearch && (
              <>
                <Globe className="w-3 h-3 ml-1" />
                <span>Web</span>
              </>
            )}
          </div>
          {data.config.customPrompt && (
            <div className="text-xs text-gray-500">
              Custom prompt configured
            </div>
          )}
        </div>
      )}
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
        style={{ left: -6 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
        style={{ right: -6 }}
      />
    </div>
  );
}