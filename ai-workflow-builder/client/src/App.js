import React, { useState } from 'react';
import Sidebar from './component/Sidebar';
import FlowCanvas from './component/FlowCanvas';
import ConfigurationPanel from './component/ConfigurationPanel';
import ChatInterface from './component/ChatInterface';
import { Play, MessageSquare, Settings } from 'lucide-react';

function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [workflow, setWorkflow] = useState({ nodes: [], edges: [] });

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
  };

  const handleWorkflowUpdate = (nodes, edges) => {
    setWorkflow({ nodes, edges });
  };

  const handleBuildStack = async () => {
    // Validate workflow and prepare for execution
    console.log('Building workflow stack:', workflow);
    // TODO: Send workflow to backend for validation
  };

  const handleChatWithStack = () => {
    setShowChat(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">AI Workflow Builder</h1>
        </div>
        <Sidebar />
        
        {/* Execution Controls */}
        <div className="mt-auto p-4 border-t border-gray-200">
          <div className="space-y-2">
            <button
              onClick={handleBuildStack}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Play className="w-4 h-4 mr-2" />
              Build Stack
            </button>
            <button
              onClick={handleChatWithStack}
              className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat with Stack
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 relative">
          <FlowCanvas 
            onNodeSelect={handleNodeSelect}
            onWorkflowUpdate={handleWorkflowUpdate}
          />
        </div>
      </div>

      {/* Configuration Panel */}
      {selectedNode && (
        <div className="w-80 node-config-panel">
          <ConfigurationPanel 
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        </div>
      )}

      {/* Chat Interface Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-3/4 h-3/4 chat-interface">
            <ChatInterface 
              workflow={workflow}
              onClose={() => setShowChat(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
