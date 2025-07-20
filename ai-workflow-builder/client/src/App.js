import React from 'react';
import Sidebar from './component/Sidebar';
import Canvas from './component/Canvas';

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <Canvas />
    </div>
  );
}

export default App;
