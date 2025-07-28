import React, { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

import UserQueryNode from './nodes/UserQueryNode';
import KnowledgeBaseNode from './nodes/KnowledgeBaseNode';
import LLMEngineNode from './nodes/LLMEngineNode';
import OutputNode from './nodes/OutputNode';

const nodeTypes = {
  userQuery: UserQueryNode,
  knowledgeBase: KnowledgeBaseNode,
  llmEngine: LLMEngineNode,
  output: OutputNode,
};

let id = 0;
const getId = () => `node_${id++}`;

const WorkflowCanvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  setNodes,
  setEdges,
  reactFlowWrapper
}) => {
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left - 100,
        y: event.clientY - bounds.top - 50,
      };

      const nodeLabels = {
        userQuery: 'User Query',
        knowledgeBase: 'Knowledge Base',
        llmEngine: 'LLM Engine',
        output: 'Output',
      };

      const newNode = {
        id: getId(),
        type,
        position,
        data: { 
          label: nodeLabels[type] || 'Unknown',
          config: getDefaultConfig(type)
        },
        style: {
          border: '2px solid #e5e7eb',
          borderRadius: '12px',
          backgroundColor: 'white',
          minWidth: '200px',
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, reactFlowWrapper]
  );

  const getDefaultConfig = (type) => {
    switch (type) {
      case 'userQuery':
        return {
          placeholder: 'Enter your question here...'
        };
      case 'knowledgeBase':
        return {
          collectionName: '',
          embeddingProvider: 'openai',
          maxResults: 5
        };
      case 'llmEngine':
        return {
          modelProvider: 'openai',
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          useWebSearch: false,
          customPrompt: ''
        };
      case 'output':
        return {
          displayFormat: 'text'
        };
      default:
        return {};
    }
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onConnectHandler = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        id: `edge-${params.source}-${params.target}`,
        animated: true,
        style: { 
          stroke: '#3b82f6',
          strokeWidth: 2,
        },
        markerEnd: {
          type: 'arrowclosed',
          color: '#3b82f6',
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  return (
    <div className="flex-1 h-full bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnectHandler}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-gray-50"
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.2}
        maxZoom={2}
      >
        <Background 
          variant="dots" 
          gap={20} 
          size={1}
          color="#d1d5db"
        />
        <Controls 
          className="bg-white border border-gray-200 rounded-lg shadow-sm"
          showInteractive={false}
        />
        <MiniMap 
          className="bg-white border border-gray-200 rounded-lg"
          nodeColor={(node) => {
            switch (node.type) {
              case 'userQuery': return '#3b82f6';
              case 'knowledgeBase': return '#10b981';
              case 'llmEngine': return '#8b5cf6';
              case 'output': return '#f59e0b';
              default: return '#6b7280';
            }
          }}
          nodeStrokeWidth={3}
          nodeBorderRadius={8}
        />
        
        {nodes.length === 0 && (
          <Panel position="top-center" className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Build Your Workflow</h3>
              <p className="text-sm text-gray-600">
                Drag components from the sidebar to get started. Connect them with arrows to create your AI workflow.
              </p>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

export default WorkflowCanvas;