'use client';

import React, { useEffect, useRef, useMemo, useState } from 'react';
import type { Node, Edge } from '@/types/knowledge-graph';

// Deep, rich colors — fewer colors = more visible community clusters
const COMMUNITY_COLORS = [
  '#8DAA9D', // vrin sage
  '#3b82f6', // blue
  '#a855f7', // violet
  '#06b6d4', // cyan
  '#f59e0b', // amber
  '#ec4899', // pink
  '#10b981', // emerald
  '#f97316', // orange
  '#6366f1', // indigo
  '#ef4444', // red
  '#14b8a6', // teal
  '#84cc16', // lime
];

interface CosmosGraphProps {
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
  isLoading?: boolean;
  error?: string | null;
}

export function CosmosGraph({ data, isLoading = false, error }: CosmosGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sigmaRef = useRef<any>(null);

  const { nodeCount, edgeCount } = useMemo(() => ({
    nodeCount: data?.nodes?.length || 0,
    edgeCount: data?.edges?.length || 0,
  }), [data]);

  useEffect(() => {
    if (!containerRef.current || !data?.nodes?.length) return;

    // Dynamic imports — Sigma requires WebGL (browser only)
    const Graph = require('graphology');
    const Sigma = require('sigma').Sigma;
    const forceAtlas2 = require('graphology-layout-forceatlas2');
    const louvain = require('graphology-communities-louvain');

    // Clean up previous instance
    if (sigmaRef.current) {
      try { (sigmaRef.current as any).kill(); } catch {}
      sigmaRef.current = null;
    }

    // Build graphology graph
    const graph = new Graph();

    // Build degree map for sizing
    const degreeMap = new Map<string, number>();
    for (const edge of data.edges) {
      degreeMap.set(edge.from, (degreeMap.get(edge.from) || 0) + 1);
      degreeMap.set(edge.to, (degreeMap.get(edge.to) || 0) + 1);
    }

    // First add all nodes temporarily to detect communities
    for (const node of data.nodes) {
      graph.addNode(node.id, { x: 0, y: 0, size: 2, color: '#666', label: '' });
    }

    // Add edges
    const nodeIds = new Set(data.nodes.map(n => n.id));
    for (const edge of data.edges) {
      if (nodeIds.has(edge.from) && nodeIds.has(edge.to) && edge.from !== edge.to) {
        try {
          graph.addEdge(edge.from, edge.to);
        } catch {}
      }
    }

    // Detect communities using Louvain
    let communities: Record<string, number> = {};
    try {
      communities = louvain(graph, { resolution: 1.2 });
    } catch {}

    // Group nodes by community
    const communityGroups = new Map<number, string[]>();
    for (const [nodeId, communityId] of Object.entries(communities)) {
      if (!communityGroups.has(communityId)) communityGroups.set(communityId, []);
      communityGroups.get(communityId)!.push(nodeId);
    }

    // Sort communities by size (largest first)
    const sortedCommunities = Array.from(communityGroups.entries())
      .sort((a, b) => b[1].length - a[1].length);

    // Position communities with random spread — each community gets a random center
    // with enough distance between them, then members scatter around their center
    const totalNodes = data.nodes.length;
    const spread = Math.sqrt(totalNodes) * 20;

    // Generate well-separated random positions for community centers
    const communityCenters: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < sortedCommunities.length; i++) {
      let cx: number, cy: number;
      let attempts = 0;
      do {
        cx = (Math.random() - 0.5) * spread * 2;
        cy = (Math.random() - 0.5) * spread * 2;
        attempts++;
      } while (
        attempts < 50 &&
        communityCenters.some(c => Math.hypot(c.x - cx, c.y - cy) < spread * 0.3)
      );
      communityCenters.push({ x: cx, y: cy });
    }

    for (let i = 0; i < sortedCommunities.length; i++) {
      const [, memberIds] = sortedCommunities[i];
      const { x: cx, y: cy } = communityCenters[i];
      const communityRadius = Math.sqrt(memberIds.length) * 10;

      for (let j = 0; j < memberIds.length; j++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * communityRadius;
        graph.setNodeAttribute(memberIds[j], 'x', cx + Math.cos(angle) * r);
        graph.setNodeAttribute(memberIds[j], 'y', cy + Math.sin(angle) * r);
      }
    }

    // Assign colors by community and sizes by degree
    graph.forEachNode((nodeId: string) => {
      const degree = degreeMap.get(nodeId) || 0;
      const communityId = communities[nodeId] ?? 0;
      const colorIndex = communityId % COMMUNITY_COLORS.length;

      graph.setNodeAttribute(nodeId, 'color', COMMUNITY_COLORS[colorIndex]);
      graph.setNodeAttribute(nodeId, 'size', 1.5 + Math.log2(degree + 1) * 2.5);
    });

    // Set edge colors — same-community edges match community color, cross-community edges are white
    graph.forEachEdge((edgeId: string, _attrs: any, source: string, target: string) => {
      const srcCommunity = communities[source];
      const tgtCommunity = communities[target];
      if (srcCommunity === tgtCommunity) {
        const sourceColor = graph.getNodeAttribute(source, 'color') || '#ffffff';
        graph.setEdgeAttribute(edgeId, 'color', sourceColor + '18');
      } else {
        graph.setEdgeAttribute(edgeId, 'color', 'rgba(255,255,255,0.04)');
      }
      graph.setEdgeAttribute(edgeId, 'size', 0.15);
    });

    // Run ForceAtlas2 — gentle, preserves the community positions
    // Low gravity keeps communities apart, moderate attraction keeps internals tight
    const nodeCount = graph.order;
    forceAtlas2.assign(graph, {
      iterations: Math.min(200, Math.max(50, Math.floor(800 / Math.sqrt(nodeCount)))),
      settings: {
        gravity: 0.008,
        scalingRatio: 30,
        barnesHutOptimize: true,
        barnesHutTheta: 0.5,
        strongGravityMode: false,
        adjustSizes: true,
        linLogMode: true,
        slowDown: 10,
      },
    });

    // Create Sigma renderer with zoom limits
    const sigma = new Sigma(graph, containerRef.current, {
      renderEdgeLabels: false,
      renderLabels: false,
      labelRenderedSizeThreshold: 999,
      enableEdgeEvents: false,
      defaultEdgeType: 'line',
      stagePadding: 60,
      minCameraRatio: 0.3,   // Max zoom in — don't get closer than this
      maxCameraRatio: 3.0,   // Max zoom out — don't go further than this
    });

    // Enable node dragging
    let draggedNode: string | null = null;
    let isDragging = false;

    sigma.on('downNode', (e: any) => {
      isDragging = true;
      draggedNode = e.node;
      graph.setNodeAttribute(draggedNode, 'highlighted', true);
      // Prevent camera from moving while dragging
      sigma.getCamera().disable();
    });

    sigma.getMouseCaptor().on('mousemovebody', (e: any) => {
      if (!isDragging || !draggedNode) return;
      // Convert viewport coords to graph coords
      const pos = sigma.viewportToGraph(e);
      graph.setNodeAttribute(draggedNode, 'x', pos.x);
      graph.setNodeAttribute(draggedNode, 'y', pos.y);
    });

    sigma.getMouseCaptor().on('mouseup', () => {
      if (draggedNode) {
        graph.removeNodeAttribute(draggedNode, 'highlighted');
      }
      isDragging = false;
      draggedNode = null;
      sigma.getCamera().enable();
    });

    // Highlight node on hover
    sigma.on('enterNode', (e: any) => {
      if (!isDragging) {
        graph.setNodeAttribute(e.node, 'highlighted', true);
        // Temporarily show connected edges brighter
        graph.forEachEdge(e.node, (edgeId: string, _attrs: any, source: string) => {
          const sourceColor = graph.getNodeAttribute(source, 'color') || '#ffffff';
          graph.setEdgeAttribute(edgeId, 'color', sourceColor + '60');
          graph.setEdgeAttribute(edgeId, 'size', 0.5);
        });
      }
    });

    sigma.on('leaveNode', (e: any) => {
      if (!isDragging) {
        graph.removeNodeAttribute(e.node, 'highlighted');
        // Reset edges
        graph.forEachEdge(e.node, (edgeId: string, _attrs: any, source: string) => {
          const sourceColor = graph.getNodeAttribute(source, 'color') || '#ffffff';
          graph.setEdgeAttribute(edgeId, 'color', sourceColor + '12');
          graph.setEdgeAttribute(edgeId, 'size', 0.15);
        });
      }
    });

    sigmaRef.current = sigma;

    return () => {
      try { sigma.kill(); } catch {}
      sigmaRef.current = null;
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a] rounded-xl">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#8DAA9D]/30 border-t-[#8DAA9D] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-white/30 text-sm">Loading knowledge graph...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a] rounded-xl">
        <p className="text-red-400/60 text-sm">{error}</p>
      </div>
    );
  }

  if (!data?.nodes?.length) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a] rounded-xl">
        <p className="text-white/20 text-sm">No knowledge graph data yet. Ingest some documents to get started.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-[#0a0a0a] rounded-xl overflow-hidden">
      {/* Stats overlay */}
      <div className="absolute top-4 left-4 z-10 flex gap-3">
        <div className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm">
          <span className="text-[10px] text-white/30 uppercase tracking-wider">Nodes</span>
          <p className="text-sm font-medium text-[#8DAA9D]">{nodeCount.toLocaleString()}</p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm">
          <span className="text-[10px] text-white/30 uppercase tracking-wider">Edges</span>
          <p className="text-sm font-medium text-[#8DAA9D]">{edgeCount.toLocaleString()}</p>
        </div>
      </div>

      {/* Sigma container */}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
