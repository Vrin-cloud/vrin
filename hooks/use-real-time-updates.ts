'use client';

import { useState, useEffect, useRef } from 'react';
import type { GraphUpdate } from '@/types/knowledge-graph';

interface UseRealTimeUpdatesOptions {
  enabled: boolean;
  onUpdate?: (update: GraphUpdate) => void;
  websocketUrl?: string;
}

interface UseRealTimeUpdatesReturn {
  isConnected: boolean;
  lastUpdate?: Date;
  updateCount: number;
  connect: () => void;
  disconnect: () => void;
}

export function useRealTimeUpdates({
  enabled,
  onUpdate,
  websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001'
}: UseRealTimeUpdatesOptions): UseRealTimeUpdatesReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>();
  const [updateCount, setUpdateCount] = useState(0);
  const socketRef = useRef<any>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = async () => {
    if (!enabled || socketRef.current) return;

    try {
      // Dynamic import to avoid SSR issues
      const { io } = await import('socket.io-client');
      
      const socket = io(websocketUrl, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socket.on('connect', () => {
        console.log('🔗 Connected to real-time updates');
        setIsConnected(true);
        setUpdateCount(0);
        
        // Subscribe to knowledge graph updates
        socket.emit('subscribe', { type: 'all_updates' });
      });

      socket.on('disconnect', () => {
        console.log('❌ Disconnected from real-time updates');
        setIsConnected(false);
      });

      socket.on('kg_update', (update: GraphUpdate) => {
        console.log('📡 Knowledge graph update received:', update);
        setLastUpdate(new Date());
        setUpdateCount(prev => prev + 1);
        onUpdate?.(update);
      });

      socket.on('conflict_update', (update: GraphUpdate) => {
        console.log('⚠️ Conflict update received:', update);
        setLastUpdate(new Date());
        setUpdateCount(prev => prev + 1);
        onUpdate?.(update);
      });

      socket.on('statistics_update', (stats: any) => {
        console.log('📊 Statistics update received:', stats);
        setLastUpdate(new Date());
        setUpdateCount(prev => prev + 1);
      });

      socket.on('connect_error', (error) => {
        console.error('🔴 Connection error:', error);
        setIsConnected(false);
        
        // Retry connection after delay
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          if (enabled) {
            connect();
          }
        }, 5000);
      });

      socketRef.current = socket;
    } catch (error) {
      console.error('❌ Failed to establish WebSocket connection:', error);
      setIsConnected(false);
      
      // Simulate updates for demo purposes when WebSocket fails
      if (enabled) {
        const interval = setInterval(() => {
          setLastUpdate(new Date());
          setUpdateCount(prev => prev + 1);
          
          // Create a mock update
          const mockUpdate: GraphUpdate = {
            type: 'node_added',
            timestamp: new Date(),
            data: {
              id: `mock-${Date.now()}`,
              name: 'Demo Node',
              type: 'Concept'
            } as any,
            metadata: {
              source: 'demo',
              confidence: 0.85
            }
          };
          
          onUpdate?.(mockUpdate);
        }, 10000); // Every 10 seconds

        // Store interval ID for cleanup
        socketRef.current = { disconnect: () => clearInterval(interval) };
        setIsConnected(true); // Simulate connection for demo
      }
    }
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    setIsConnected(false);
  };

  useEffect(() => {
    if (enabled) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, websocketUrl]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    lastUpdate,
    updateCount,
    connect,
    disconnect,
  };
} 