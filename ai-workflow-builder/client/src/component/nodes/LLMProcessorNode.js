import React from 'react';

export default function LLMProcessorNode({ data }) {
  return (
    <div className="bg-yellow-200 p-2 rounded shadow">
      <strong>LLM Processor</strong>
      <div>{data.label}</div>
    </div>
  );
}
