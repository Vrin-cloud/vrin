'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { 
  Node, 
  Edge, 
  VisualizationConfig, 
  KnowledgeGraphResponse 
} from '@/types/knowledge-graph';

interface KnowledgeGraphVisualizationProps {
  data?: KnowledgeGraphResponse['data'];
  config: VisualizationConfig;
  onNodeSelect?: (node: Node) => void;
  onEdgeSelect?: (edge: Edge) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function KnowledgeGraphVisualization({
  data,
  config,
  onNodeSelect,
  onEdgeSelect,
  isLoading = false,
  error
}: KnowledgeGraphVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [zoom, setZoom] = useState(1);

  // Sample data for demonstration
  const sampleNodes: Node[] = [
    {
      id: 'marie-curie',
      name: 'Marie Curie',
      type: 'Person',
      confidence: 0.95,
      connections: 8,
      position: { x: 200, y: 150 }
    },
    {
      id: 'pierre-curie',
      name: 'Pierre Curie',
      type: 'Person',
      confidence: 0.92,
      connections: 6,
      position: { x: 350, y: 200 }
    },
    {
      id: 'nobel-prize',
      name: 'Nobel Prize in Physics',
      type: 'Award',
      confidence: 0.98,
      connections: 12,
      position: { x: 300, y: 80 }
    },
    {
      id: 'radioactivity',
      name: 'Radioactivity',
      type: 'Concept',
      confidence: 0.89,
      connections: 15,
      position: { x: 150, y: 280 }
    },
    {
      id: 'polonium',
      name: 'Polonium',
      type: 'Element',
      confidence: 0.93,
      connections: 4,
      position: { x: 100, y: 350 }
    },
    {
      id: 'radium',
      name: 'Radium',
      type: 'Element',
      confidence: 0.91,
      connections: 5,
      position: { x: 250, y: 380 }
    }
  ];

  const sampleEdges: Edge[] = [
    {
      id: 'edge-1',
      from: 'marie-curie',
      to: 'pierre-curie',
      label: 'married to',
      type: 'relationship',
      confidence: 0.96
    },
    {
      id: 'edge-2',
      from: 'marie-curie',
      to: 'nobel-prize',
      label: 'won',
      type: 'achievement',
      confidence: 0.98
    },
    {
      id: 'edge-3',
      from: 'marie-curie',
      to: 'radioactivity',
      label: 'researched',
      type: 'activity',
      confidence: 0.94
    },
    {
      id: 'edge-4',
      from: 'marie-curie',
      to: 'polonium',
      label: 'discovered',
      type: 'discovery',
      confidence: 0.95
    },
    {
      id: 'edge-5',
      from: 'marie-curie',
      to: 'radium',
      label: 'discovered',
      type: 'discovery',
      confidence: 0.93
    }
  ];

  const displayNodes = data?.nodes || sampleNodes;
  const displayEdges = data?.edges || sampleEdges;

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
    onNodeSelect?.(node);
  };

  const handleEdgeClick = (edge: Edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
    onEdgeSelect?.(edge);
  };

  const getNodeColor = (node: Node) => {
    switch (config.colorBy) {
      case 'type':
        const typeColors: Record<string, string> = {
          Person: '#3b82f6',
          Award: '#f59e0b',
          Concept: '#8b5cf6',
          Element: '#10b981',
          Organization: '#ef4444'
        };
        return typeColors[node.type] || '#6b7280';
      case 'confidence':
        const confidence = node.confidence || 0.5;
        return `hsl(${confidence * 120}, 70%, 50%)`;
      case 'cluster':
        return node.cluster ? '#8b5cf6' : '#6b7280';
      default:
        return '#3b82f6';
    }
  };

  const getNodeSize = (node: Node) => {
    switch (config.sizeBy) {
      case 'connections':
        return Math.max(20, Math.min(60, (node.connections || 1) * 3));
      case 'confidence':
        return Math.max(20, (node.confidence || 0.5) * 60);
      default:
        return 30;
    }
  };

  useEffect(() => {
    // In a real implementation, this would initialize D3.js or Cytoscape
    // For now, we'll use SVG with simple positioning
  }, [data, config]);

  if (isLoading) {
    return (
      <div className="graph-container flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading knowledge graph...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="graph-container flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-red-600 text-lg">⚠</span>
          </div>
          <p className="text-red-600 font-medium">Error loading graph</p>
          <p className="text-slate-500 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="graph-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 bg-white rounded-lg shadow-lg p-2">
        <Button
          onClick={() => setZoom(zoom * 1.2)}
          variant="ghost"
          size="sm"
          className="p-2"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => setZoom(zoom * 0.8)}
          variant="ghost"
          size="sm"
          className="p-2"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => setZoom(1)}
          variant="ghost"
          size="sm"
          className="p-2"
          title="Reset View"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-slate-300"></div>
        <Button
          variant="ghost"
          size="sm"
          className="p-2"
          title="Fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="p-2"
          title="Export"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Graph Area */}
      <div 
        ref={containerRef}
        className="w-full h-full relative overflow-hidden"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
      >
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* Render Edges */}
          {displayEdges.map((edge) => {
            const fromNode = displayNodes.find(n => n.id === edge.from);
            const toNode = displayNodes.find(n => n.id === edge.to);
            
            if (!fromNode || !toNode) return null;

            return (
              <g key={edge.id}>
                <line
                  x1={fromNode.position?.x || 0}
                  y1={fromNode.position?.y || 0}
                  x2={toNode.position?.x || 0}
                  y2={toNode.position?.y || 0}
                  stroke={selectedEdge?.id === edge.id ? '#f59e0b' : '#6b7280'}
                  strokeWidth={selectedEdge?.id === edge.id ? 3 : 2}
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => handleEdgeClick(edge)}
                />
                {config.showLabels && (
                                   <text
                   x={((fromNode.position?.x || 0) + (toNode.position?.x || 0)) / 2}
                   y={((fromNode.position?.y || 0) + (toNode.position?.y || 0)) / 2 - 5}
                    textAnchor="middle"
                    className="text-xs fill-slate-600 pointer-events-none"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Render Nodes */}
          {displayNodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.position?.x || 0}
                cy={node.position?.y || 0}
                r={getNodeSize(node)}
                fill={getNodeColor(node)}
                stroke={selectedNode?.id === node.id ? '#f59e0b' : '#ffffff'}
                strokeWidth={selectedNode?.id === node.id ? 4 : 2}
                className="cursor-pointer transition-all duration-200 hover:stroke-yellow-400"
                onClick={() => handleNodeClick(node)}
              />
              {config.showLabels && (
                <text
                  x={node.position?.x || 0}
                  y={(node.position?.y || 0) + getNodeSize(node) + 15}
                  textAnchor="middle"
                  className="text-xs font-medium fill-slate-700 pointer-events-none"
                >
                  {node.name}
                </text>
              )}
              {node.confidence && (
                <text
                  x={node.position?.x || 0}
                  y={(node.position?.y || 0) + 4}
                  textAnchor="middle"
                  className="text-xs font-bold fill-white pointer-events-none"
                >
                  {Math.round((node.confidence || 0) * 100)}%
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Info Panel */}
      {(selectedNode || selectedEdge) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs"
        >
          {selectedNode && (
            <div>
              <h3 className="font-semibold text-slate-900">{selectedNode.name}</h3>
              <p className="text-sm text-slate-600 mt-1">Type: {selectedNode.type}</p>
              {selectedNode.confidence && (
                <p className="text-sm text-slate-600">
                  Confidence: {Math.round(selectedNode.confidence * 100)}%
                </p>
              )}
              {selectedNode.connections && (
                <p className="text-sm text-slate-600">
                  Connections: {selectedNode.connections}
                </p>
              )}
            </div>
          )}
          {selectedEdge && (
            <div>
              <h3 className="font-semibold text-slate-900">{selectedEdge.label}</h3>
              <p className="text-sm text-slate-600 mt-1">
                {selectedEdge.from} → {selectedEdge.to}
              </p>
              {selectedEdge.confidence && (
                <p className="text-sm text-slate-600">
                  Confidence: {Math.round(selectedEdge.confidence * 100)}%
                </p>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
        <h4 className="font-medium text-slate-900 mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Person</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Award</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Concept</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Element</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 