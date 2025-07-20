import React from 'react';

export default function KnowledgeBaseNode({ data }) {
  return (
    <div className="bg-green-200 p-2 rounded shadow">
      <strong>Knowledge Base</strong>
      <div>{data.label}</div>
    </div>
  );
}
