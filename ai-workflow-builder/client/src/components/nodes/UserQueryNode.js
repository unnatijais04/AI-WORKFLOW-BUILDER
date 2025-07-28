import React from 'react';
import { Handle, Position } from 'reactflow';
import { MessageSquare } from 'lucide-react';

export default function UserQueryNode({ data, selected }) {
  return (
    <div className={`bg-white border-2 rounded-lg p-4 min-w-[200px] shadow-sm ${
      selected ? 'border-blue-500 shadow-lg' : 'border-gray-200'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-blue-500 p-1.5 rounded text-white">
          <MessageSquare className="w-4 h-4" />
        </div>
        <span className="font-medium text-gray-900">User Query</span>
      </div>
      
      <div className="text-sm text-gray-600 mb-2">
        Entry point for user questions
      </div>
      
      {data.config?.placeholder && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          "{data.config.placeholder}"
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ right: -6 }}
      />
    </div>
  );
}