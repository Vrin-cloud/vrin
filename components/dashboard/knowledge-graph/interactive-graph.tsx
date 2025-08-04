'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Download, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import cytoscape from 'cytoscape';
import type { 
  Node, 
  Edge, 
  VisualizationConfig, 
  KnowledgeGraphResponse 
} from '../../types/knowledge-graph';

interface InteractiveGraphProps {
  data?: KnowledgeGraphResponse['data'];
  config: VisualizationConfig;
  onNodeSelect?: (node: Node) => void;
  onEdgeSelect?: (edge: Edge) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function InteractiveGraph({
  data,
  config,
  onNodeSelect,
  onEdgeSelect,
  isLoading = false,
  error
}: InteractiveGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [zoom, setZoom] = useState(1);

  console.log('InteractiveGraph - received data:', data);
  console.log('InteractiveGraph - nodes count:', data?.nodes?.length);
  console.log('InteractiveGraph - edges count:', data?.edges?.length);
  console.log('InteractiveGraph - isLoading:', isLoading);
  console.log('InteractiveGraph - error:', error);

  // Convert data to Cytoscape format
  const getCytoscapeData = useCallback(() => {
    if (!data?.nodes || !data?.edges) return { nodes: [], edges: [] };

    const nodes = data.nodes.map(node => {
      // Create shorter labels for display
      let displayLabel = node.name;
      if (node.name.length > 12) {
        const words = node.name.split(' ');
        if (words.length > 1 && words[0].length <= 8) {
          displayLabel = words[0];
        } else {
          displayLabel = node.name.substring(0, 8);
        }
      }
      
      return {
        data: {
          id: node.id,
          label: displayLabel,
          fullName: node.name, // Keep full name for tooltips/details
          type: node.type || 'entity',
          confidence: node.confidence || 0.8,
          connections: node.connections || 0,
          originalNode: node
        }
      };
    });

    const edges = data.edges.map(edge => ({
      data: {
        id: edge.id,
        source: edge.from,
        target: edge.to,
        label: edge.label,
        type: edge.type || 'relationship',
        confidence: edge.confidence || 0.8,
        originalEdge: edge
      }
    }));

    return { nodes, edges };
  }, [data]);

  // Get node color based on role
  const getNodeColor = useCallback((node: any) => {
    const nodeData = node.data();
    const nodeId = nodeData.id;
    
    // Check if node is subject, object, or both
    const isSubject = data?.edges?.some(edge => edge.from === nodeId);
    const isObject = data?.edges?.some(edge => edge.to === nodeId);
    
    if (isSubject && isObject) {
      return '#8b5cf6'; // Purple for dual-role nodes
    } else if (isSubject) {
      return '#e91e63'; // Pink for subject nodes
    } else if (isObject) {
      return '#3b82f6'; // Blue for object nodes
    } else {
      return '#6b7280'; // Gray for isolated nodes
    }
  }, [data?.edges]);

  // Initialize Cytoscape
  useEffect(() => {
    console.log('InteractiveGraph useEffect triggered');
    console.log('Container ref:', containerRef.current);
    console.log('Data:', data);
    console.log('Nodes count:', data?.nodes?.length);
    console.log('Edges count:', data?.edges?.length);
    
    if (!containerRef.current) {
      console.log('Container ref not available');
      return;
    }

    if (!data?.nodes || data.nodes.length === 0) {
      console.log('No nodes data available:', data);
      return;
    }

    console.log('Initializing Cytoscape with data:', getCytoscapeData());
    console.log('Container dimensions:', containerRef.current.offsetWidth, 'x', containerRef.current.offsetHeight);

    // Destroy existing instance
    if (cyRef.current) {
      try {
        cyRef.current.destroy();
      } catch (error) {
        console.warn('Error destroying previous Cytoscape instance:', error);
      }
      cyRef.current = null;
    }

    // Create new Cytoscape instance with error handling
    let cy: cytoscape.Core;
    try {
      cy = cytoscape({
        container: containerRef.current,
        elements: getCytoscapeData(),
        style: [
          {
            selector: 'node',
            style: {
              'background-color': (ele: any) => getNodeColor(ele),
              'label': 'data(label)',
              'color': '#ffffff',
              'text-valign': 'center',
              'text-halign': 'center',
              'font-size': '9px',
              'font-weight': 600,
              'width': '45px',
              'height': '45px',
              'border-width': 2,
              'border-color': '#ffffff',
              'text-wrap': 'wrap',
              'text-max-width': '40px',
              'text-overflow-wrap': 'whitespace',
              'text-transform': 'lowercase'
            }
          },
          {
            selector: 'edge',
            style: {
              'width': 2,
              'line-color': '#cbd5e1',
              'target-arrow-color': '#cbd5e1',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              'label': 'data(label)',
              'font-size': '10px',
              'font-weight': 'bold',
              'color': '#334155',
              'text-background-color': '#f1f5f9',
              'text-background-opacity': 0.8,
              'text-background-padding': '2px',
              'text-border-color': '#cbd5e1',
              'text-border-width': 1,
              'text-border-opacity': 0.5
            }
          },
          {
            selector: 'node:selected',
            style: {
              'border-width': 3,
              'border-color': '#06b6d4',
              'background-color': (ele: any) => getNodeColor(ele),
              'width': '50px',
              'height': '50px'
            }
          },
          {
            selector: 'edge:selected',
            style: {
              'width': 4,
              'line-color': '#06b6d4',
              'target-arrow-color': '#06b6d4'
            }
          }
        ],
        layout: {
          name: 'cose',
          animate: true,
          animationDuration: 1000,
          nodeDimensionsIncludeLabels: true,
          fit: true,
          padding: 50,
          nodeRepulsion: 8000,
          nodeOverlap: 20,
          idealEdgeLength: 200,
          edgeElasticity: 100,
          nestingFactor: 0.1,
          gravity: 80,
          numIter: 1000,
          initialTemp: 200,
          coolingFactor: 0.95,
          minTemp: 1.0
        },
        userZoomingEnabled: true,
        userPanningEnabled: true,
        boxSelectionEnabled: true,
        selectionType: 'single',
        touchTapThreshold: 8,
        desktopTapThreshold: 4,
        autolock: false,
        autounselectify: false
      });

      // Store reference
      cyRef.current = cy;
      console.log('Cytoscape instance created successfully');
    } catch (error) {
      console.error('Error creating Cytoscape instance:', error);
      return;
    }

    // Event handlers with error handling
    cy.on('tap', 'node', (evt) => {
      try {
        const node = evt.target;
        const nodeData = node.data();
        const originalNode = nodeData.originalNode;
        setSelectedNode(originalNode);
        setSelectedEdge(null);
        onNodeSelect?.(originalNode);
      } catch (error) {
        console.warn('Error handling node tap:', error);
      }
    });

    cy.on('tap', 'edge', (evt) => {
      try {
        const edge = evt.target;
        const edgeData = edge.data();
        const originalEdge = edgeData.originalEdge;
        setSelectedEdge(originalEdge);
        setSelectedNode(null);
        onEdgeSelect?.(originalEdge);
      } catch (error) {
        console.warn('Error handling edge tap:', error);
      }
    });

    cy.on('tap', (evt) => {
      try {
        if (evt.target === cy) {
          setSelectedNode(null);
          setSelectedEdge(null);
        }
      } catch (error) {
        console.warn('Error handling background tap:', error);
      }
    });

    cy.on('zoom', () => {
      try {
        setZoom(cy.zoom());
      } catch (error) {
        console.warn('Error handling zoom event:', error);
      }
    });

    // Fit to view after layout
    cy.on('layoutstop', () => {
      try {
        cy.fit();
        cy.center();
        console.log('Layout completed and graph fitted to view');
      } catch (error) {
        console.warn('Error fitting to view:', error);
      }
    });

    // Add hover effects for nodes
    cy.on('mouseover', 'node', (evt) => {
      try {
        const node = evt.target;
        node.style({
          'width': '50px',
          'height': '50px',
          'font-size': '10px'
        });
      } catch (error) {
        console.warn('Error handling node hover:', error);
      }
    });

    cy.on('mouseout', 'node', (evt) => {
      try {
        const node = evt.target;
        node.style({
          'width': '45px',
          'height': '45px',
          'font-size': '9px'
        });
      } catch (error) {
        console.warn('Error handling node hover out:', error);
      }
    });

  }, [data, getCytoscapeData, getNodeColor, onNodeSelect, onEdgeSelect]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (cyRef.current) {
        try {
          cyRef.current.destroy();
        } catch (error) {
          console.warn('Error destroying Cytoscape instance:', error);
        }
        cyRef.current = null;
      }
    };
  }, []);

  // Zoom controls
  const zoomIn = () => {
    if (cyRef.current) {
      cyRef.current.zoom({
        level: cyRef.current.zoom() * 1.2,
        renderedPosition: { x: 0, y: 0 }
      });
    }
  };

  const zoomOut = () => {
    if (cyRef.current) {
      cyRef.current.zoom({
        level: cyRef.current.zoom() * 0.8,
        renderedPosition: { x: 0, y: 0 }
      });
    }
  };

  const resetView = () => {
    if (cyRef.current) {
      cyRef.current.fit();
      cyRef.current.center();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="graph-container flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading knowledge graph...</p>
        </div>
      </div>
    );
  }

  // Error state
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

  // Empty state
  if (!data?.nodes || data.nodes.length === 0) {
    return (
      <div className="graph-container flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Move className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Knowledge Graph Data</h3>
          <p className="text-slate-600 mb-4">Start by adding some knowledge to see your graph</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-full bg-white rounded-lg overflow-hidden"
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg border border-slate-200 flex items-center space-x-1 p-1">
        <button
          onClick={zoomIn}
          className="btn-ghost p-2"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={zoomOut}
          className="btn-ghost p-2"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <div className="w-px h-6 bg-slate-300"></div>
        <button
          onClick={resetView}
          className="btn-ghost p-2"
          title="Reset View"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <div className="w-px h-6 bg-slate-300"></div>
        <button
          className="btn-ghost p-2"
          title="Fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
        <button
          className="btn-ghost p-2"
          title="Export"
        >
          <Download className="h-4 w-4" />
        </button>
      </div>

      {/* Graph Canvas */}
      <div 
        ref={containerRef}
        className="w-full h-full relative overflow-hidden bg-slate-50 cursor-grab active:cursor-grabbing select-none"
        style={{ touchAction: 'none' }}
      />

      {/* Info Panel */}
      {(selectedNode || selectedEdge) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs border border-slate-200"
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
      {data?.nodes && data.nodes.length > 0 && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs border border-slate-200">
          <h4 className="font-medium text-slate-900 mb-2">Node Types</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
              <span>Subject Nodes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Object Nodes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span>Dual-Role Nodes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span>Isolated Nodes</span>
            </div>
          </div>
        </div>
      )}

      {/* Graph Stats */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 text-xs text-slate-600 border border-slate-200">
        <div>Nodes: {data?.nodes?.length || 0}</div>
        <div>Edges: {data?.edges?.length || 0}</div>
        <div>Zoom: {(zoom * 100).toFixed(0)}%</div>
        <div className="text-xs text-slate-400 mt-1">Drag to pan • Scroll to zoom</div>
      </div>
    </motion.div>
  );
} 