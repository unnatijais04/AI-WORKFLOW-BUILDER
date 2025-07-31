import React from 'react';
import { MessageCircle, Database, Brain, MessageSquare } from 'lucide-react';

const nodes = [
  { 
    type: 'userQuery', 
    label: 'User Query',
    description: 'Entry point for user queries',
    icon: MessageCircle,
    color: 'from-blue-500 to-blue-600'
  },
  { 
    type: 'knowledgeBase', 
    label: 'Knowledge Base',
    description: 'Document processing & embeddings',
    icon: Database,
    color: 'from-green-500 to-green-600'
  },
  { 
    type: 'llmEngine', 
    label: 'LLM Engine',
    description: 'Language model processing',
    icon: Brain,
    color: 'from-purple-500 to-purple-600'
  },
  { 
    type: 'output', 
    label: 'Output',
    description: 'Chat interface & responses',
    icon: MessageSquare,
    color: 'from-orange-500 to-orange-600'
  },
];

export default function Sidebar() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Components</h2>
        <p className="text-sm text-gray-600">
          Drag and drop components to build your workflow
        </p>
      </div>
      
      <div className="space-y-3">
        {nodes.map((node) => {
          const IconComponent = node.icon;
          return (
            <div
              key={node.type}
              onDragStart={(e) => onDragStart(e, node.type)}
              draggable
              className="group cursor-move bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${node.color} text-white`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {node.label}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {node.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Workflow Tips */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Workflow Tips</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Start with a User Query node</li>
          <li>• Connect components in logical order</li>
          <li>• Configure each node before testing</li>
          <li>• End with an Output node</li>
        </ul>
      </div>
    </div>
  );
}
