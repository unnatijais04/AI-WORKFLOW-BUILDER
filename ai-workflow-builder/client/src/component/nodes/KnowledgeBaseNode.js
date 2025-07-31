import React from 'react';
import { Handle, Position } from 'reactflow';
import { Database, Upload } from 'lucide-react';

export default function KnowledgeBaseNode({ data, selected }) {
  return (
    <div className={`bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-lg border-2 ${selected ? 'border-green-300' : 'border-transparent'} min-w-[200px]`}>
      <div className="flex items-center mb-2">
        <Database className="w-5 h-5 mr-2" />
        <strong className="text-sm font-semibold">Knowledge Base</strong>
      </div>
      
      <div className="text-xs opacity-90 mb-3">
        Document processing & embeddings
      </div>
      
      <div className="bg-green-400 bg-opacity-20 p-2 rounded text-xs mb-2">
        {data.label || 'Knowledge Base Node'}
      </div>
      
      {data.documents && data.documents.length > 0 && (
        <div className="bg-green-400 bg-opacity-20 p-2 rounded text-xs">
          📄 {data.documents.length} document(s) loaded
        </div>
      )}
      
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-green-500"
        style={{ top: '50%' }}
      />
      
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-green-500"
        style={{ top: '50%' }}
      />
    </div>
  );
}
