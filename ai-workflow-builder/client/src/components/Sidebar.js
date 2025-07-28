import React from 'react';
import { MessageSquare, Database, Brain, Monitor, FileText } from 'lucide-react';

const components = [
  { 
    type: 'userQuery', 
    label: 'User Query',
    description: 'Entry point for user questions',
    icon: MessageSquare,
    color: 'bg-blue-500'
  },
  { 
    type: 'knowledgeBase', 
    label: 'Knowledge Base',
    description: 'Document processing & retrieval',
    icon: Database,
    color: 'bg-green-500'
  },
  { 
    type: 'llmEngine', 
    label: 'LLM Engine',
    description: 'AI response generation',
    icon: Brain,
    color: 'bg-purple-500'
  },
  { 
    type: 'output', 
    label: 'Output',
    description: 'Display final response',
    icon: Monitor,
    color: 'bg-orange-500'
  },
];

export default function Sidebar() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-80 bg-white border-r border-gray-200 p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Component Library</h2>
        <p className="text-sm text-gray-600">Drag components onto the canvas to build your workflow</p>
      </div>
      
      <div className="space-y-3">
        {components.map((component) => {
          const IconComponent = component.icon;
          return (
            <div
              key={component.type}
              onDragStart={(e) => onDragStart(e, component.type)}
              draggable
              className="group cursor-move bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className={`${component.color} p-2 rounded-md text-white flex-shrink-0`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 group-hover:text-primary-700 transition-colors">
                    {component.label}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {component.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">Quick Guide</span>
        </div>
        <div className="text-xs text-gray-600 space-y-1">
          <p>1. Drag components to canvas</p>
          <p>2. Connect them with arrows</p>
          <p>3. Configure each component</p>
          <p>4. Build & validate workflow</p>
          <p>5. Chat with your AI stack</p>
        </div>
      </div>
    </aside>
  );
}