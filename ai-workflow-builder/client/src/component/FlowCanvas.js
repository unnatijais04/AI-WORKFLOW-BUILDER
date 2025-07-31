// src/components/FlowCanvas.jsx
import React, { useCallback, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
} from 'reactflow';
import 'reactflow/dist/style.css';

import UserQueryNode from './nodes/UserQueryNode';
import KnowledgeBaseNode from './nodes/KnowledgeBaseNode';
import LLMProcessorNode from './nodes/LLMProcessorNode';
import OutputNode from './nodes/OutputNode';

const nodeTypes = {
  userQuery: UserQueryNode,
  knowledgeBase: KnowledgeBaseNode,
  llmEngine: LLMProcessorNode,
  output: OutputNode,
};

let id = 0;
const getId = () => `node_${id++}`;

function FlowCanvas({ onNodeSelect, onWorkflowUpdate }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
      // Notify parent of workflow update
      setTimeout(() => {
        onWorkflowUpdate(nodes, [...edges, params]);
      }, 0);
    },
    [setEdges, nodes, edges, onWorkflowUpdate]
  );

  const onNodeClick = useCallback(
    (event, node) => {
      onNodeSelect(node);
    },
    [onNodeSelect]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const bounds = event.target.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };

      const newNode = {
        id: getId(),
        type,
        position,
        data: { 
          label: `${type} node`,
          config: {}
        },
      };

      setNodes((nds) => {
        const newNodes = nds.concat(newNode);
        // Notify parent of workflow update
        setTimeout(() => {
          onWorkflowUpdate(newNodes, edges);
        }, 0);
        return newNodes;
      });
    },
    [setNodes, edges, onWorkflowUpdate]
  );

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onNodesDelete = useCallback(
    (deleted) => {
      setNodes((nds) => {
        const newNodes = nds.filter(node => !deleted.find(d => d.id === node.id));
        // Notify parent of workflow update
        setTimeout(() => {
          onWorkflowUpdate(newNodes, edges);
        }, 0);
        return newNodes;
      });
    },
    [setNodes, edges, onWorkflowUpdate]
  );

  const onEdgesDelete = useCallback(
    (deleted) => {
      setEdges((eds) => {
        const newEdges = eds.filter(edge => !deleted.find(d => d.id === edge.id));
        // Notify parent of workflow update
        setTimeout(() => {
          onWorkflowUpdate(nodes, newEdges);
        }, 0);
        return newEdges;
      });
    },
    [setEdges, nodes, onWorkflowUpdate]
  );

  return (
    <div className="w-full h-full" style={{ height: '100vh' }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#aaa" gap={16} />
          <MiniMap 
            style={{
              height: 120,
              width: 200,
            }}
            nodeColor={(node) => {
              switch (node.type) {
                case 'userQuery':
                  return '#3b82f6';
                case 'knowledgeBase':
                  return '#10b981';
                case 'llmEngine':
                  return '#8b5cf6';
                case 'output':
                  return '#f59e0b';
                default:
                  return '#6b7280';
              }
            }}
          />
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}

export default FlowCanvas;
