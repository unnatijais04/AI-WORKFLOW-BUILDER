import React from 'react';

const nodes = [
  { type: 'userQuery', label: 'User Query' },
  { type: 'knowledgeBase', label: 'Knowledge Base' },
  { type: 'llmEngine', label: 'LLM Engine' },
  { type: 'output', label: 'Output' },
];

export default function Sidebar() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-1/4 bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4">Components</h2>
      {nodes.map((node) => (
        <div
          key={node.type}
          onDragStart={(e) => onDragStart(e, node.type)}
          draggable
          className="cursor-move bg-white p-2 rounded shadow mb-2 border"
        >
          {node.label}
        </div>
      ))}
    </aside>
  );
}
