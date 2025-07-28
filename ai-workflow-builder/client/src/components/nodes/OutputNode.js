import React from 'react';
import { Handle, Position } from 'reactflow';
import { Monitor } from 'lucide-react';

export default function OutputNode({ data, selected }) {
  return (
    <div className={`bg-white border-2 rounded-lg p-4 min-w-[200px] shadow-sm ${
      selected ? 'border-orange-500 shadow-lg' : 'border-gray-200'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-orange-500 p-1.5 rounded text-white">
          <Monitor className="w-4 h-4" />
        </div>
        <span className="font-medium text-gray-900">Output</span>
      </div>
      
      <div className="text-sm text-gray-600 mb-2">
        Display final response
      </div>
      
      {data.config && (
        <div className="text-xs text-gray-500">
          Format: {data.config.displayFormat || 'text'}
        </div>
      )}
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-orange-500 border-2 border-white"
        style={{ left: -6 }}
      />
    </div>
  );
}