import React from 'react';
import { Handle, Position } from 'reactflow';
import { MessageSquare, Send } from 'lucide-react';

export default function OutputNode({ data, selected }) {
  return (
    <div className={`bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg shadow-lg border-2 ${selected ? 'border-orange-300' : 'border-transparent'} min-w-[200px]`}>
      <div className="flex items-center mb-2">
        <MessageSquare className="w-5 h-5 mr-2" />
        <strong className="text-sm font-semibold">Output</strong>
      </div>
      
      <div className="text-xs opacity-90 mb-3">
        Chat interface & responses
      </div>
      
      <div className="bg-orange-400 bg-opacity-20 p-2 rounded text-xs mb-2">
        {data.label || 'Output Node'}
      </div>
      
      <div className="bg-orange-400 bg-opacity-20 p-2 rounded text-xs">
        💬 Chat interface ready
      </div>
      
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-orange-500"
        style={{ top: '50%' }}
      />
    </div>
  );
}
