import React from 'react';
import { Handle, Position } from 'reactflow';
import { Brain, Settings } from 'lucide-react';

export default function LLMProcessorNode({ data, selected }) {
  return (
    <div className={`bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow-lg border-2 ${selected ? 'border-purple-300' : 'border-transparent'} min-w-[200px]`}>
      <div className="flex items-center mb-2">
        <Brain className="w-5 h-5 mr-2" />
        <strong className="text-sm font-semibold">LLM Engine</strong>
      </div>
      
      <div className="text-xs opacity-90 mb-3">
        Language model processing
      </div>
      
      <div className="bg-purple-400 bg-opacity-20 p-2 rounded text-xs mb-2">
        {data.label || 'LLM Engine Node'}
      </div>
      
      {data.model && (
        <div className="bg-purple-400 bg-opacity-20 p-2 rounded text-xs mb-2">
          🤖 {data.model}
        </div>
      )}
      
      {data.temperature && (
        <div className="bg-purple-400 bg-opacity-20 p-2 rounded text-xs">
          🌡️ Temp: {data.temperature}
        </div>
      )}
      
      {/* Input handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-purple-500"
        style={{ top: '30%' }}
        id="query"
      />
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-purple-500"
        style={{ top: '70%' }}
        id="context"
      />
      
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-purple-500"
        style={{ top: '50%' }}
      />
    </div>
  );
}
