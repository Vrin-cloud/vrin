'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  Info,
  Database
} from 'lucide-react';
import cytoscape from 'cytoscape';
import type { Node, Edge } from '../../../types/knowledge-graph';

// Type-to-color mapping for semantic coloring
const TYPE_COLORS: Record<string, string> = {
  'entity': '#3b82f6',
  'concept': '#8b5cf6',
  'person': '#ef4444',
  'place': '#10b981',
  'organization': '#f59e0b',
  'event': '#ec4899',
  'document': '#6366f1',
  'topic': '#14b8a6'
};

const DEFAULT_COLOR = '#64748b';

// Shape mapping by entity category
function getNodeShape(type: string): string {
  switch (type) {
    case 'person':
    case 'organization':
      return 'ellipse';
    case 'concept':
    case 'topic':
      return 'diamond';
    case 'document':
    case 'event':
      return 'rectangle';
    default:
      return 'ellipse';
  }
}

// Shape categories for the legend
const SHAPE_CATEGORIES = [
  { label: 'People / Orgs', shape: 'circle', types: ['person', 'organization'] },
  { label: 'Concepts / Topics', shape: 'diamond', types: ['concept', 'topic'] },
  { label: 'Documents / Events', shape: 'square', types: ['document', 'event'] },
];

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
  showEdgeLabels: boolean;
  physics: boolean;
  nodeSize: number;
  edgeWidth: number;
  colorScheme: 'default' | 'semantic' | 'confidence' | 'temporal';
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  name: string;
  type: string;
  color: string;
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
  const onNodeSelectRef = useRef(onNodeSelect);
  const onEdgeSelectRef = useRef(onEdgeSelect);
  onNodeSelectRef.current = onNodeSelect;
  onEdgeSelectRef.current = onEdgeSelect;
  const [zoom, setZoom] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [filteredTypes, setFilteredTypes] = useState<string[]>([]);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false, x: 0, y: 0, name: '', type: '', color: ''
  });
  const [settings, setSettings] = useState<GraphSettings>({
    layout: 'cose',
    showEdgeLabels: false,
    physics: true,
    nodeSize: data?.nodes && data.nodes.length > 500 ? 20 : 25,
    edgeWidth: data?.edges && data.edges.length > 500 ? 1 : 2,
    colorScheme: 'semantic'
  });

  if (error) {
    console.warn('ModernGraph - Error received:', error);
  }

  // Get unique node types for filtering
  const nodeTypes = Array.from(new Set(data?.nodes?.map(node => node.type) || []));

  // Stable identity for graph data — only changes when node/edge counts or IDs change
  const dataFingerprint = useMemo(() => {
    if (!data?.nodes || !data?.edges) return null;
    return `${data.nodes.length}-${data.edges.length}-${data.nodes.map(n => n.id).join(',')}`;
  }, [data]);

  // Convert data to Cytoscape format with visual encoding
  const getCytoscapeData = useCallback(() => {
    if (!data?.nodes || !data?.edges) {
      return { nodes: [], edges: [] };
    }

    // Compute node degree from edge data (backend connections field is often 0)
    const degreeMap = new Map<string, number>();
    for (const edge of data.edges) {
      const src = String(edge.from);
      const tgt = String(edge.to);
      degreeMap.set(src, (degreeMap.get(src) || 0) + 1);
      degreeMap.set(tgt, (degreeMap.get(tgt) || 0) + 1);
    }
    const maxDegree = Math.max(1, ...degreeMap.values());

    const nodes = data.nodes.map(node => {
      const nodeName = node.name || `Node-${node.id}`;
      const nodeType = node.type || 'entity';
      const degree = degreeMap.get(String(node.id)) || 0;
      const confidence = node.confidence || 0.8;

      // Size: scale by degree (30% to 200% of base size — big visual difference)
      const ratio = Math.min(degree / maxDegree, 1);
      const scaledSize = settings.nodeSize * (0.3 + 1.7 * ratio);

      // Opacity: scale by confidence (0.4 to 1.0)
      const nodeOpacity = 0.4 + 0.6 * confidence;

      return {
        data: {
          id: String(node.id),
          label: '', // No text inside nodes
          fullName: nodeName,
          type: nodeType,
          confidence,
          connections: degree,
          scaledSize,
          nodeOpacity,
          nodeShape: getNodeShape(nodeType),
          originalNode: node
        }
      };
    });

    const edges = data.edges
      .filter(edge => {
        const source = edge.from;
        const target = edge.to;
        const sourceVisible = nodes.some(n => n.data.id === String(source));
        const targetVisible = nodes.some(n => n.data.id === String(target));
        return sourceVisible && targetVisible;
      })
      .map(edge => {
        const source = edge.from;
        const target = edge.to;
        const label = edge.label || edge.type || 'related';

        return {
          data: {
            id: String(edge.id || `${source}-${target}-${label}`),
            source: String(source),
            target: String(target),
            label: settings.showEdgeLabels ? label : '',
            type: edge.type || 'relationship',
            confidence: edge.confidence || 0.8,
            originalEdge: edge
          }
        };
      });

    return { nodes, edges };
  }, [data, settings.showEdgeLabels, settings.nodeSize]);

  // Get node color based on scheme
  const getNodeColor = useCallback((node: any) => {
    const nodeData = node.data();

    switch (settings.colorScheme) {
      case 'semantic':
        return TYPE_COLORS[nodeData.type] || DEFAULT_COLOR;

      case 'confidence': {
        const confidence = nodeData.confidence || 0.5;
        if (confidence >= 0.8) return '#10b981';
        if (confidence >= 0.6) return '#f59e0b';
        return '#ef4444';
      }

      case 'temporal':
        return '#3b82f6';

      default:
        return '#3b82f6';
    }
  }, [settings.colorScheme]);

  // Initialize Cytoscape — only rebuilds when the actual graph data changes
  useEffect(() => {
    if (!containerRef.current || !dataFingerprint) {
      return;
    }

    if (!data?.nodes || data.nodes.length === 0) {
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

    const isLargeGraph = data.nodes.length > 500;

    try {
      const cy = cytoscape({
        container: containerRef.current,
        elements: getCytoscapeData(),
        style: [
          {
            selector: 'node',
            style: {
              'background-color': (ele: any) => getNodeColor(ele),
              'shape': 'data(nodeShape)' as any,
              'width': 'data(scaledSize)' as any,
              'height': 'data(scaledSize)' as any,
              'opacity': 'data(nodeOpacity)' as any,
              'border-width': 2,
              'border-color': '#ffffff',
              'transition-property': 'border-color, border-width',
              'transition-duration': 150
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
          }
        ],
        layout: {
          name: settings.layout,
          animate: true,
          animationDuration: isLargeGraph ? 800 : 1500,
          nodeDimensionsIncludeLabels: false,
          fit: true,
          padding: isLargeGraph ? 50 : 80,
          nodeRepulsion: isLargeGraph ? 10000 : 20000,
          nodeOverlap: 30,
          idealEdgeLength: isLargeGraph ? 100 : 200,
          edgeElasticity: 50,
          nestingFactor: 0.1,
          gravity: 60,
          numIter: isLargeGraph ? 800 : 1500,
          initialTemp: 200,
          coolingFactor: 0.85,
          minTemp: 1.0,
          componentSpacing: isLargeGraph ? 50 : 100,
          randomize: true
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

      // Node tap — fire callback to parent
      cy.on('tap', 'node', (evt) => {
        const node = evt.target;
        const nodeData = node.data();
        onNodeSelectRef.current?.(nodeData.originalNode);
      });

      // Edge tap — fire callback to parent
      cy.on('tap', 'edge', (evt) => {
        const edge = evt.target;
        const edgeData = edge.data();
        onEdgeSelectRef.current?.(edgeData.originalEdge);
      });

      // Tooltip on hover
      cy.on('mouseover', 'node', (evt) => {
        const node = evt.target;
        const nodeData = node.data();
        const renderedPos = node.renderedPosition();

        setTooltip({
          visible: true,
          x: renderedPos.x,
          y: renderedPos.y - (nodeData.scaledSize / 2) - 12,
          name: nodeData.fullName,
          type: nodeData.type,
          color: TYPE_COLORS[nodeData.type] || DEFAULT_COLOR
        });

        // Highlight border
        node.style('border-color', '#06b6d4');
        node.style('border-width', 3);
      });

      cy.on('mouseout', 'node', (evt) => {
        setTooltip(prev => ({ ...prev, visible: false }));
        const node = evt.target;
        node.style('border-color', '#ffffff');
        node.style('border-width', 2);
      });

      cy.on('zoom', () => {
        setZoom(cy.zoom());
        setTooltip(prev => ({ ...prev, visible: false }));
      });

      cy.on('pan', () => {
        setTooltip(prev => ({ ...prev, visible: false }));
      });

      // Fit to view after layout completes
      cy.on('layoutstop', () => {
        setTimeout(() => {
          cy.fit();
          cy.center();
        }, 100);
      });

    } catch (error) {
      console.error('Error creating Cytoscape instance:', error);
    }

    return () => {
      if (cyRef.current) {
        try {
          cyRef.current.destroy();
        } catch (e) {
          // Ignore cleanup errors
        }
        cyRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFingerprint]);

  // Apply search/filter via Cytoscape visibility — no rebuild needed
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.nodes().forEach((node) => {
      const nodeData = node.data();
      const nodeName: string = nodeData.fullName || '';
      const nodeType: string = nodeData.type || 'entity';

      let visible = true;
      if (searchQuery && !nodeName.toLowerCase().includes(searchQuery.toLowerCase())) {
        visible = false;
      }
      if (filteredTypes.length > 0 && !filteredTypes.includes(nodeType)) {
        visible = false;
      }

      node.style('display', visible ? 'element' : 'none');
    });

    // Hide edges where either endpoint is hidden
    cy.edges().forEach((edge) => {
      const src = edge.source();
      const tgt = edge.target();
      if (src.style('display') === 'none' || tgt.style('display') === 'none') {
        edge.style('display', 'none');
      } else {
        edge.style('display', 'element');
      }
    });
  }, [searchQuery, filteredTypes]);

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
        animate: true,
        animationDuration: 1500,
        nodeDimensionsIncludeLabels: false,
        fit: true,
        padding: 80,
        nodeRepulsion: 20000,
        nodeOverlap: 50,
        idealEdgeLength: 200,
        edgeElasticity: 100,
        nestingFactor: 0.1,
        gravity: 80,
        numIter: 1500,
        initialTemp: 300,
        coolingFactor: 0.90,
        minTemp: 1.0,
        componentSpacing: 100,
        randomize: true
      });
      layout.run();

      setTimeout(() => {
        if (cyRef.current) {
          cyRef.current.fit();
          cyRef.current.center();
        }
      }, 2000);
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
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Graph</h3>
          <p className="text-red-600 max-w-md">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data?.nodes || data.nodes.length === 0) {
    const backendError = (data as any)?.error || error;
    const hasConnectionIssue = backendError?.includes('Neptune connection') ||
                              backendError?.includes('connection unavailable') ||
                              backendError?.includes('Neptune connection unavailable');

    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl">
        <div className="text-center max-w-lg">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
            hasConnectionIssue ? 'bg-yellow-100' : 'bg-blue-100'
          }`}>
            {hasConnectionIssue ? (
              <span className="text-2xl">!</span>
            ) : (
              <Database className="h-10 w-10 text-blue-600" />
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {hasConnectionIssue ? 'Backend Connection Issue' : 'No Knowledge Graph Data'}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md">
            {hasConnectionIssue ? (
              <>
                The knowledge graph database (Neptune) is currently unavailable.
                This is usually a temporary connection issue that will resolve automatically.
                <br /><br />
                <span className="text-sm text-gray-500">
                  If you recently inserted knowledge, it may take a few minutes for the graph database to be accessible.
                </span>
              </>
            ) : selectedProject ? (
              `No knowledge has been added to the "${selectedProject}" project yet.`
            ) : (
              'Start by inserting knowledge to build your graph visualization.'
            )}
          </p>
          {!hasConnectionIssue && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium"
              onClick={() => window.location.href = '/dashboard'}
            >
              Add Knowledge
            </motion.button>
          )}
          {hasConnectionIssue && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium text-sm"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </motion.button>
          )}
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
                          <div
                            className="w-3 h-3 rounded-sm"
                            style={{ backgroundColor: TYPE_COLORS[type] || DEFAULT_COLOR }}
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
            title="Re-layout"
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

      {/* Hover Tooltip */}
      {tooltip.visible && (
        <div
          className="absolute z-30 pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
            <span className="font-semibold">{tooltip.name}</span>
            <span
              className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium capitalize"
              style={{ backgroundColor: tooltip.color + '33', color: tooltip.color }}
            >
              {tooltip.type}
            </span>
          </div>
          {/* Tooltip arrow */}
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-gray-900 rotate-45 -mt-1"></div>
          </div>
        </div>
      )}

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
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Neptune DB</span>
          </div>
          {data?.statistics?.nodeCount && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Total: {data.statistics.nodeCount}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <span>Zoom: {Math.round(zoom * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Legend Panel — bottom right */}
      <div className="absolute bottom-4 right-4 z-20">
        <motion.button
          onClick={() => setShowLegend(!showLegend)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mb-2 ml-auto flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 px-2.5 py-1.5 shadow-sm text-xs text-gray-600 hover:bg-white transition-colors"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Legend</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${showLegend ? 'rotate-180' : ''}`} />
        </motion.button>

        <AnimatePresence>
          {showLegend && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm p-4 min-w-52"
            >
              {/* Colors — entity types */}
              <h5 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Color = Type</h5>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
                {nodeTypes.map(type => (
                  <div key={type} className="flex items-center gap-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: TYPE_COLORS[type] || DEFAULT_COLOR }}
                    />
                    <span className="text-[11px] text-gray-600 capitalize truncate">{type}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 my-2" />

              {/* Shapes */}
              <h5 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Shape = Category</h5>
              <div className="space-y-1 mb-3">
                {SHAPE_CATEGORIES.map(cat => (
                  <div key={cat.label} className="flex items-center gap-2">
                    {/* Inline SVG shape icon */}
                    <svg width="14" height="14" viewBox="0 0 14 14" className="flex-shrink-0">
                      {cat.shape === 'circle' && (
                        <circle cx="7" cy="7" r="5" fill="#94a3b8" />
                      )}
                      {cat.shape === 'diamond' && (
                        <polygon points="7,1 13,7 7,13 1,7" fill="#94a3b8" />
                      )}
                      {cat.shape === 'square' && (
                        <rect x="2" y="2" width="10" height="10" rx="1" fill="#94a3b8" />
                      )}
                    </svg>
                    <span className="text-[11px] text-gray-600">{cat.label}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 my-2" />

              {/* Size & Opacity */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full" />
                    <div className="w-3.5 h-3.5 bg-gray-400 rounded-full" />
                  </div>
                  <span className="text-[11px] text-gray-600">Larger = more connections</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full opacity-30" />
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full opacity-60" />
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full" />
                  </div>
                  <span className="text-[11px] text-gray-600">Brighter = higher confidence</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
