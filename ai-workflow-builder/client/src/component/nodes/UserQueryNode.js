import React from 'react';
import { Handle, Position } from 'reactflow';
import { MessageCircle } from 'lucide-react';

export default function UserQueryNode({ data, selected }) {
  return (
    <div className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-lg border-2 ${selected ? 'border-blue-300' : 'border-transparent'} min-w-[200px]`}>
      <div className="flex items-center mb-2">
        <MessageCircle className="w-5 h-5 mr-2" />
        <strong className="text-sm font-semibold">User Query</strong>
      </div>
      
      <div className="text-xs opacity-90 mb-3">
        Entry point for user queries
      </div>
      
      <div className="bg-blue-400 bg-opacity-20 p-2 rounded text-xs">
        {data.label || 'User Query Node'}
      </div>
      
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-blue-500"
        style={{ top: '50%' }}
      />
    </div>
  );
}
