'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Download, 
  Move, 
  Settings,
  Search,
  Filter,
  Layers,
  Play,
  Pause,
  RefreshCw,
  ChevronDown,
  Eye,
  EyeOff
} from 'lucide-react';
import cytoscape from 'cytoscape';
import type { Node, Edge } from '../../../types/knowledge-graph';

interface ModernGraphProps {
  data?: {
    nodes: Node[];
    edges: Edge[];
    statistics?: {
      nodeCount: number;
      edgeCount: number;
      tripleCount: number;
      density: number;
    };
  };
  selectedProject?: string;
  onNodeSelect?: (node: Node) => void;
  onEdgeSelect?: (edge: Edge) => void;
  isLoading?: boolean;
  error?: string | null;
}

interface GraphSettings {
  layout: 'cose' | 'circle' | 'grid' | 'breadthfirst' | 'concentric';
  showLabels: boolean;
  showEdgeLabels: boolean;
  physics: boolean;
  nodeSize: number;
  edgeWidth: number;
  colorScheme: 'default' | 'semantic' | 'confidence' | 'temporal';
}

export function ModernGraph({
  data,
  selectedProject,
  onNodeSelect,
  onEdgeSelect,
  isLoading = false,
  error
}: ModernGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [filteredTypes, setFilteredTypes] = useState<string[]>([]);
  const [settings, setSettings] = useState<GraphSettings>({
    layout: 'cose',
    showLabels: true,
    showEdgeLabels: false,
    physics: true,
    nodeSize: 20,
    edgeWidth: 2,
    colorScheme: 'semantic'
  });

  console.log('ModernGraph - received data:', data);
  console.log('ModernGraph - selected project:', selectedProject);

  // Get unique node types for filtering
  const nodeTypes = Array.from(new Set(data?.nodes?.map(node => node.type) || []));

  // Convert data to Cytoscape format
  const getCytoscapeData = useCallback(() => {
    if (!data?.nodes || !data?.edges) return { nodes: [], edges: [] };

    const nodes = data.nodes
      .filter(node => {
        // Apply search filter
        if (searchQuery && !node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        // Apply type filter
        if (filteredTypes.length > 0 && !filteredTypes.includes(node.type)) {
          return false;
        }
        return true;
      })
      .map(node => {
        let displayLabel = node.name;
        if (!settings.showLabels) {
          displayLabel = '';
        } else if (node.name.length > 15) {
          const words = node.name.split(' ');
          if (words.length > 1 && words[0].length <= 10) {
            displayLabel = words[0] + '...';
          } else {
            displayLabel = node.name.substring(0, 10) + '...';
          }
        }
        
        return {
          data: {
            id: node.id,
            label: displayLabel,
            fullName: node.name,
            type: node.type || 'entity',
            confidence: node.confidence || 0.8,
            connections: node.connections || 0,
            originalNode: node
          }
        };
      });

    const edges = data.edges
      .filter(edge => {
        // Only include edges where both nodes are visible
        const sourceVisible = nodes.some(n => n.data.id === edge.from);
        const targetVisible = nodes.some(n => n.data.id === edge.to);
        return sourceVisible && targetVisible;
      })
      .map(edge => ({
        data: {
          id: edge.id,
          source: edge.from,
          target: edge.to,
          label: settings.showEdgeLabels ? edge.label : '',
          type: edge.type || 'relationship',
          confidence: edge.confidence || 0.8,
          originalEdge: edge
        }
      }));

    return { nodes, edges };
  }, [data, searchQuery, filteredTypes, settings.showLabels, settings.showEdgeLabels]);

  // Get node color based on scheme
  const getNodeColor = useCallback((node: any) => {
    const nodeData = node.data();
    
    switch (settings.colorScheme) {
      case 'semantic':
        const typeColors: Record<string, string> = {
          'entity': '#3b82f6',
          'concept': '#8b5cf6',
          'person': '#ef4444',
          'place': '#10b981',
          'organization': '#f59e0b',
          'event': '#ec4899',
          'document': '#6366f1',
          'topic': '#14b8a6'
        };
        return typeColors[nodeData.type] || '#64748b';
      
      case 'confidence':
        const confidence = nodeData.confidence || 0.5;
        if (confidence >= 0.8) return '#10b981';
        if (confidence >= 0.6) return '#f59e0b';
        return '#ef4444';
      
      case 'temporal':
        // Color based on recency (mock implementation)
        return '#3b82f6';
      
      default:
        return '#3b82f6';
    }
  }, [settings.colorScheme]);

  // Initialize Cytoscape
  useEffect(() => {
    console.log('ModernGraph useEffect triggered');
    
    if (!containerRef.current) {
      console.log('Container ref not available');
      return;
    }

    if (!data?.nodes || data.nodes.length === 0) {
      console.log('No nodes data available:', data);
      return;
    }

    // Destroy existing instance
    if (cyRef.current) {
      try {
        cyRef.current.destroy();
      } catch (error) {
        console.warn('Error destroying previous Cytoscape instance:', error);
      }
      cyRef.current = null;
    }

    // Create new Cytoscape instance
    try {
      const cy = cytoscape({
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
              'font-size': `${Math.max(8, settings.nodeSize * 0.4)}px`,
              'font-weight': 600,
              'width': `${settings.nodeSize}px`,
              'height': `${settings.nodeSize}px`,
              'border-width': 2,
              'border-color': '#ffffff',
              'text-wrap': 'wrap',
              'text-max-width': `${settings.nodeSize * 2}px`,
              'text-overflow-wrap': 'anywhere',
              'text-outline-color': '#000000',
              'text-outline-width': 1,
              'text-outline-opacity': 0.3,
              'transition-property': 'all',
              'transition-duration': 200
            }
          },
          {
            selector: 'edge',
            style: {
              'width': settings.edgeWidth,
              'line-color': '#cbd5e1',
              'target-arrow-color': '#cbd5e1',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              'label': 'data(label)',
              'font-size': '9px',
              'font-weight': 'bold',
              'color': '#475569',
              'text-background-color': '#f8fafc',
              'text-background-opacity': 0.8,
              'text-background-padding': '2px',
              'text-border-color': '#e2e8f0',
              'text-border-width': 1,
              'text-border-opacity': 0.5,
              'arrow-scale': 1.2,
              'opacity': 0.7
            }
          },
          {
            selector: 'node:selected',
            style: {
              'border-width': 4,
              'border-color': '#06b6d4',
              'width': `${settings.nodeSize * 1.3}px`,
              'height': `${settings.nodeSize * 1.3}px`,
              'z-index': 999
            }
          },
          {
            selector: 'edge:selected',
            style: {
              'width': settings.edgeWidth * 2,
              'line-color': '#06b6d4',
              'target-arrow-color': '#06b6d4',
              'opacity': 1,
              'z-index': 999
            }
          },
          {
            selector: 'node:hover',
            style: {
              'width': `${settings.nodeSize * 1.2}px`,
              'height': `${settings.nodeSize * 1.2}px`,
              'border-color': '#06b6d4',
              'border-width': 3,
              'transition-duration': 100
            }
          }
        ],
        layout: {
          name: settings.layout,
          animate: settings.physics,
          animationDuration: 1000,
          nodeDimensionsIncludeLabels: true,
          fit: true,
          padding: 50,
          // Cose-specific options
          nodeRepulsion: 8000,
          nodeOverlap: 20,
          idealEdgeLength: 100,
          edgeElasticity: 200,
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

      cyRef.current = cy;
      console.log('Cytoscape instance created successfully');

      // Event handlers
      cy.on('tap', 'node', (evt) => {
        const node = evt.target;
        const nodeData = node.data();
        const originalNode = nodeData.originalNode;
        setSelectedNode(originalNode);
        setSelectedEdge(null);
        onNodeSelect?.(originalNode);
      });

      cy.on('tap', 'edge', (evt) => {
        const edge = evt.target;
        const edgeData = edge.data();
        const originalEdge = edgeData.originalEdge;
        setSelectedEdge(originalEdge);
        setSelectedNode(null);
        onEdgeSelect?.(originalEdge);
      });

      cy.on('tap', (evt) => {
        if (evt.target === cy) {
          setSelectedNode(null);
          setSelectedEdge(null);
        }
      });

      cy.on('zoom', () => {
        setZoom(cy.zoom());
      });

      // Fit to view after layout
      cy.on('layoutstop', () => {
        cy.fit();
        cy.center();
      });

    } catch (error) {
      console.error('Error creating Cytoscape instance:', error);
    }
  }, [data, getCytoscapeData, getNodeColor, onNodeSelect, onEdgeSelect, settings]);

  // Control functions
  const zoomIn = () => {
    if (cyRef.current) {
      cyRef.current.zoom({
        level: cyRef.current.zoom() * 1.25,
        renderedPosition: { x: containerRef.current!.clientWidth / 2, y: containerRef.current!.clientHeight / 2 }
      });
    }
  };

  const zoomOut = () => {
    if (cyRef.current) {
      cyRef.current.zoom({
        level: cyRef.current.zoom() * 0.8,
        renderedPosition: { x: containerRef.current!.clientWidth / 2, y: containerRef.current!.clientHeight / 2 }
      });
    }
  };

  const resetView = () => {
    if (cyRef.current) {
      cyRef.current.fit();
      cyRef.current.center();
    }
  };

  const runLayout = () => {
    if (cyRef.current) {
      const layout = cyRef.current.layout({
        name: settings.layout,
        animate: settings.physics,
        animationDuration: 1000
      });
      layout.run();
    }
  };

  const exportImage = () => {
    if (cyRef.current) {
      const png64 = cyRef.current.png({
        output: 'blob',
        scale: 2,
        maxWidth: 2000,
        maxHeight: 2000,
        bg: '#ffffff'
      });
      
      // Create download link
      const url = URL.createObjectURL(png64);
      const a = document.createElement('a');
      a.href = url;
      a.download = `knowledge-graph-${selectedProject || 'default'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const toggleTypeFilter = (type: string) => {
    setFilteredTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Knowledge Graph</h3>
          <p className="text-gray-600">Analyzing {selectedProject || 'your'} knowledge structure...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Graph</h3>
          <p className="text-red-600 max-w-md">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data?.nodes || data.nodes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Move className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">No Knowledge Graph Data</h3>
          <p className="text-gray-600 mb-6 max-w-md">
            {selectedProject 
              ? `No knowledge has been added to the "${selectedProject}" project yet.`
              : 'Start by inserting knowledge to build your graph visualization.'
            }
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium"
            onClick={() => window.location.href = '/dashboard'}
          >
            Add Knowledge
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
        {/* Left Controls */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 px-3 py-2 shadow-sm">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm w-40"
            />
          </div>

          {/* Type Filter */}
          {nodeTypes.length > 0 && (
            <div className="relative">
              <motion.button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 px-3 py-2 shadow-sm hover:bg-white transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filter</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-2 left-0 bg-white rounded-xl border border-gray-200 shadow-xl p-4 min-w-48 z-30"
                  >
                    <h4 className="font-medium text-gray-900 mb-3">Node Types</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {nodeTypes.map(type => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!filteredTypes.includes(type)}
                            onChange={() => toggleTypeFilter(type)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 capitalize">{type}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
          <motion.button
            onClick={zoomIn}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 text-gray-600" />
          </motion.button>
          
          <motion.button
            onClick={zoomOut}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 text-gray-600" />
          </motion.button>

          <div className="w-px h-6 bg-gray-300"></div>

          <motion.button
            onClick={resetView}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4 text-gray-600" />
          </motion.button>

          <motion.button
            onClick={runLayout}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Run Layout"
          >
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </motion.button>

          <div className="w-px h-6 bg-gray-300"></div>

          <motion.button
            onClick={exportImage}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Export Image"
          >
            <Download className="w-4 h-4 text-gray-600" />
          </motion.button>
        </div>
      </div>

      {/* Graph Canvas */}
      <div 
        ref={containerRef}
        className="w-full h-full bg-gradient-to-br from-gray-50 to-blue-50"
        style={{ minHeight: '600px' }}
      />

      {/* Bottom Stats */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-3 shadow-sm">
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>{data?.nodes?.length || 0} nodes</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span>{data?.edges?.length || 0} edges</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Zoom: {Math.round(zoom * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Node/Edge Details Panel */}
      <AnimatePresence>
        {(selectedNode || selectedEdge) && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-4 right-4 w-80 bg-white rounded-2xl border border-gray-200 shadow-xl p-6 z-30"
          >
            {selectedNode && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">Node Details</h3>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="font-semibold text-gray-900">{selectedNode.name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium capitalize">
                      {selectedNode.type}
                    </span>
                  </div>
                  
                  {selectedNode.confidence && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Confidence</label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${selectedNode.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {Math.round(selectedNode.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {selectedNode.connections && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Connections</label>
                      <p className="font-semibold text-gray-900">{selectedNode.connections}</p>
                    </div>
                  )}
                  
                  {selectedNode.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Description</label>
                      <p className="text-gray-700 text-sm">{selectedNode.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedEdge && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">Edge Details</h3>
                  <button
                    onClick={() => setSelectedEdge(null)}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Relationship</label>
                    <p className="font-semibold text-gray-900">{selectedEdge.label}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Connection</label>
                    <p className="text-gray-700 text-sm">
                      {selectedEdge.from} → {selectedEdge.to}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium capitalize">
                      {selectedEdge.type}
                    </span>
                  </div>
                  
                  {selectedEdge.confidence && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Confidence</label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${selectedEdge.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {Math.round(selectedEdge.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}