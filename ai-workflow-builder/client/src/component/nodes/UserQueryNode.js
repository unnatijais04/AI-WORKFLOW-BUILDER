import React from 'react';

export default function UserQueryNode({ data }) {
  return (
    <div className="bg-blue-200 p-2 rounded shadow">
      <strong>User Query</strong>
      <div>{data.label}</div>
    </div>
  );
}
