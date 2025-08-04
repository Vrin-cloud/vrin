// Knowledge Graph Core Types
export interface Triple {
  subject: string;
  predicate: string;
  object: string;
  id?: string;
  confidence?: number;
  timestamp?: Date;
  source?: string;
  version?: number;
  status?: 'active' | 'deprecated' | 'conflicted';
}

export interface Node {
  id: string;
  name: string;
  type: string;
  description?: string;
  embedding?: number[];
  metadata?: Record<string, any>;
  confidence?: number;
  timestamp?: Date;
  lastUpdated?: Date;
  connections?: number;
  cluster?: string;
  position?: {
    x: number;
    y: number;
  };
}

export interface Edge {
  id: string;
  from: string;
  to: string;
  label: string;
  type: string;
  weight?: number;
  confidence?: number;
  timestamp?: Date;
  bidirectional?: boolean;
  metadata?: Record<string, any>;
}

// Temporal Knowledge Graph Types
export interface TemporalTriple extends Triple {
  validFrom: Date;
  validTo?: Date;
  supersededBy?: string[];
  supersedes?: string[];
  conflictsWith?: string[];
}

export interface KnowledgeGraphSnapshot {
  id: string;
  timestamp: Date;
  nodes: Node[];
  edges: Edge[];
  triples: Triple[];
  statistics: GraphStatistics;
  version: string;
}

// Graph Statistics and Analytics
export interface GraphStatistics {
  nodeCount: number;
  edgeCount: number;
  tripleCount: number;
  density: number;
  averageConnections: number;
  clusters: number;
  confidence: {
    average: number;
    min: number;
    max: number;
    distribution: { [key: string]: number };
  };
  temporal: {
    recentUpdates: number;
    conflictedFacts: number;
    averageFactAge: number;
  };
  domains: { [domain: string]: number };
}

// Real-time Update Types
export interface GraphUpdate {
  type: 'node_added' | 'node_updated' | 'node_removed' | 
        'edge_added' | 'edge_updated' | 'edge_removed' |
        'triple_added' | 'triple_updated' | 'triple_deprecated' |
        'conflict_detected' | 'conflict_resolved';
  timestamp: Date;
  data: Node | Edge | Triple | ConflictResolution;
  metadata?: {
    source: string;
    confidence: number;
    userId?: string;
    sessionId?: string;
  };
}

export interface ConflictResolution {
  conflictId: string;
  conflictType: 'contradiction' | 'ambiguity' | 'temporal_overlap';
  facts: Triple[];
  resolution: 'keep_latest' | 'keep_highest_confidence' | 'merge' | 'manual_review';
  resolvedFact?: Triple;
  timestamp: Date;
  confidence: number;
}

// Query and Search Types
export interface GraphQuery {
  type: 'semantic' | 'structural' | 'temporal' | 'hybrid';
  query: string;
  filters?: {
    nodeTypes?: string[];
    edgeTypes?: string[];
    timeRange?: { from: Date; to: Date };
    confidenceThreshold?: number;
    domains?: string[];
  };
  limit?: number;
  includeMetadata?: boolean;
}

export interface SearchResult {
  nodes: Node[];
  edges: Edge[];
  triples: Triple[];
  paths?: GraphPath[];
  confidence: number;
  timestamp: Date;
  queryTime: number;
}

export interface GraphPath {
  nodes: Node[];
  edges: Edge[];
  confidence: number;
  length: number;
  type: string;
}

// Dashboard Visualization Types
export interface VisualizationConfig {
  layout: 'force' | 'hierarchical' | 'circular' | 'grid';
  clustering: boolean;
  showLabels: boolean;
  showMetadata: boolean;
  colorBy: 'type' | 'confidence' | 'timestamp' | 'cluster';
  sizeBy: 'connections' | 'confidence' | 'static';
  physics: {
    enabled: boolean;
    gravity: number;
    repulsion: number;
    damping: number;
  };
  filters: {
    nodeTypes: string[];
    edgeTypes: string[];
    confidenceRange: [number, number];
    timeRange?: [Date, Date];
  };
}

export interface DashboardState {
  selectedNode?: Node;
  selectedEdge?: Edge;
  hoveredNode?: Node;
  searchQuery: string;
  filters: VisualizationConfig['filters'];
  viewMode: 'workflow' | 'graph' | 'timeline' | 'statistics' | 'conflicts';
  isRealTimeEnabled: boolean;
  lastUpdate: Date;
}

// API Response Types
export interface KnowledgeGraphResponse {
  success: boolean;
  data?: {
    nodes: Node[];
    edges: Edge[];
    triples: Triple[];
    statistics: GraphStatistics;
  };
  error?: string;
  timestamp: Date;
  version: string;
}

export interface InsertResponse {
  success: boolean;
  triples: Triple[];
  conflicts?: ConflictResolution[];
  statistics: GraphStatistics;
  processingTime: number;
  timestamp: Date;
}

export interface QueryResponse {
  success: boolean;
  results: SearchResult;
  suggestions?: string[];
  timestamp: Date;
  cached: boolean;
} 