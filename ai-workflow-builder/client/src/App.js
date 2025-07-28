import React, { useState, useCallback, useRef } from 'react';
import { ReactFlowProvider } from 'reactflow';
import toast, { Toaster } from 'react-hot-toast';

import Sidebar from './components/Sidebar';
import WorkflowCanvas from './components/WorkflowCanvas';
import ConfigPanel from './components/ConfigPanel';
import ChatModal from './components/ChatModal';
import ExecutionPanel from './components/ExecutionPanel';
import Header from './components/Header';

import { workflowAPI } from './services/api';

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExecutionPanelOpen, setIsExecutionPanelOpen] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const reactFlowWrapper = useRef(null);

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => {
      const updatedNodes = nds.map((node) => {
        const change = changes.find((c) => c.id === node.id);
        if (change) {
          if (change.type === 'position' && change.position) {
            return { ...node, position: change.position };
          }
          if (change.type === 'select') {
            if (change.selected && !selectedNode) {
              setSelectedNode(node);
            } else if (!change.selected && selectedNode?.id === node.id) {
              setSelectedNode(null);
            }
            return { ...node, selected: change.selected };
          }
          if (change.type === 'remove') {
            if (selectedNode?.id === node.id) {
              setSelectedNode(null);
            }
            return null;
          }
        }
        return node;
      }).filter(Boolean);
      
      return updatedNodes;
    });
  }, [selectedNode]);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => {
      return eds.map((edge) => {
        const change = changes.find((c) => c.id === edge.id);
        if (change && change.type === 'remove') {
          return null;
        }
        return edge;
      }).filter(Boolean);
    });
  }, []);

  const onConnect = useCallback((connection) => {
    const newEdge = {
      ...connection,
      id: `edge-${connection.source}-${connection.target}`,
      animated: true,
      style: { stroke: '#3b82f6' },
    };
    setEdges((eds) => eds.concat(newEdge));
  }, []);

  const validateWorkflow = async () => {
    if (nodes.length === 0) {
      toast.error('Please add components to your workflow');
      return;
    }

    setIsValidating(true);
    try {
      const result = await workflowAPI.validate(nodes, edges);
      setValidationResult(result);
      
      if (result.valid) {
        toast.success('Workflow is valid!');
      } else {
        toast.error(`Validation failed: ${result.errors.join(', ')}`);
      }
      
      if (result.warnings && result.warnings.length > 0) {
        result.warnings.forEach(warning => toast.warning(warning));
      }
    } catch (error) {
      toast.error('Failed to validate workflow');
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const executeWorkflow = async (userQuery, sessionId = null) => {
    if (!validationResult?.valid) {
      toast.error('Please validate your workflow first');
      return;
    }

    try {
      const result = await workflowAPI.execute(nodes, edges, userQuery, sessionId);
      setExecutionResult(result);
      
      if (result.success) {
        toast.success('Workflow executed successfully!');
        setIsExecutionPanelOpen(true);
        return result;
      } else {
        toast.error(`Execution failed: ${result.error}`);
        return result;
      }
    } catch (error) {
      toast.error('Failed to execute workflow');
      console.error('Execution error:', error);
      return null;
    }
  };

  const saveWorkflow = async (name, description) => {
    if (nodes.length === 0) {
      toast.error('Cannot save empty workflow');
      return;
    }

    try {
      const result = await workflowAPI.save(name, description, nodes, edges);
      if (result.success) {
        toast.success('Workflow saved successfully!');
        return result;
      }
    } catch (error) {
      toast.error('Failed to save workflow');
      console.error('Save error:', error);
    }
  };

  const openChatInterface = () => {
    if (!validationResult?.valid) {
      toast.error('Please validate your workflow before chatting');
      return;
    }
    setIsChatOpen(true);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header 
        onValidate={validateWorkflow}
        onSave={saveWorkflow}
        onChat={openChatInterface}
        isValidating={isValidating}
        validationResult={validationResult}
        nodeCount={nodes.length}
        edgeCount={edges.length}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <ReactFlowProvider>
          <Sidebar />
          
          <div className="flex-1 flex">
            <div ref={reactFlowWrapper} className="flex-1">
              <WorkflowCanvas
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                setNodes={setNodes}
                setEdges={setEdges}
                reactFlowWrapper={reactFlowWrapper}
              />
            </div>
            
            {selectedNode && (
              <ConfigPanel
                selectedNode={selectedNode}
                onNodeUpdate={(updatedNode) => {
                  setNodes((nds) =>
                    nds.map((node) =>
                      node.id === updatedNode.id ? updatedNode : node
                    )
                  );
                  setSelectedNode(updatedNode);
                }}
                onClose={() => setSelectedNode(null)}
              />
            )}
          </div>
        </ReactFlowProvider>
      </div>

      {isChatOpen && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          onExecuteWorkflow={executeWorkflow}
          workflow={{ nodes, edges }}
        />
      )}

      {isExecutionPanelOpen && executionResult && (
        <ExecutionPanel
          isOpen={isExecutionPanelOpen}
          onClose={() => setIsExecutionPanelOpen(false)}
          executionResult={executionResult}
        />
      )}

      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;
