// src/components/Canvas.jsx
import React from 'react';
import FlowCanvas from './FlowCanvas';

const Canvas = () => {
  return (
    <div style={{ flex: 1, border: '1px solid #ccc', marginLeft: '10px' }}>
      <FlowCanvas />
    </div>
  );
};

export default Canvas;
