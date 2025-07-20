import React from 'react';

export default function OutputNode({ data }) {
  return (
    <div className="bg-purple-200 p-2 rounded shadow">
      <strong>Output</strong>
      <div>{data.label}</div>
    </div>
  );
}
