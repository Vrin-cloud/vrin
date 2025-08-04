'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wifi, 
  WifiOff, 
  Play, 
  Pause, 
  RefreshCw,
  Clock,
  Activity
} from 'lucide-react';

interface RealTimeStatusProps {
  isConnected: boolean;
  isEnabled: boolean;
  lastUpdate?: Date;
  updateCount?: number;
  onToggle: () => void;
}

export function RealTimeStatus({
  isConnected,
  isEnabled,
  lastUpdate,
  updateCount = 0,
  onToggle
}: RealTimeStatusProps) {
  
  const getTimeSinceUpdate = () => {
    if (!lastUpdate) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - lastUpdate.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const getStatusColor = () => {
    if (!isEnabled) return 'gray';
    if (!isConnected) return 'red';
    return 'green';
  };

  const getStatusText = () => {
    if (!isEnabled) return 'Disabled';
    if (!isConnected) return 'Disconnected';
    return 'Live';
  };

  const statusColor = getStatusColor();
  const statusText = getStatusText();

  const colorClasses = {
    green: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      dot: 'bg-green-500'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      dot: 'bg-red-500'
    },
    gray: {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      border: 'border-gray-200',
      dot: 'bg-gray-500'
    }
  };

  const colors = colorClasses[statusColor as keyof typeof colorClasses];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center space-x-3 px-3 py-2 rounded-lg border ${colors.bg} ${colors.border}`}
    >
      {/* Status Indicator */}
      <div className="flex items-center space-x-2">
        <div className="relative">
          {isConnected && isEnabled ? (
            <Wifi className={`h-4 w-4 ${colors.text}`} />
          ) : (
            <WifiOff className={`h-4 w-4 ${colors.text}`} />
          )}
          <div 
            className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${colors.dot} ${
              isConnected && isEnabled ? 'animate-pulse' : ''
            }`}
          />
        </div>
        <span className={`text-sm font-medium ${colors.text}`}>
          {statusText}
        </span>
      </div>

      {/* Update Count */}
      {isEnabled && (
        <div className="flex items-center space-x-1">
          <Activity className={`h-3 w-3 ${colors.text}`} />
          <span className={`text-xs ${colors.text}`}>
            {updateCount}
          </span>
        </div>
      )}

      {/* Last Update Time */}
      {isEnabled && lastUpdate && (
        <div className="flex items-center space-x-1">
          <Clock className={`h-3 w-3 ${colors.text}`} />
          <span className={`text-xs ${colors.text}`}>
            {getTimeSinceUpdate()}
          </span>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
          isEnabled 
            ? 'bg-white text-slate-700 hover:bg-slate-50' 
            : 'bg-primary-500 text-white hover:bg-primary-600'
        }`}
        title={isEnabled ? 'Disable real-time updates' : 'Enable real-time updates'}
      >
        {isEnabled ? (
          <>
            <Pause className="h-3 w-3" />
            <span>Pause</span>
          </>
        ) : (
          <>
            <Play className="h-3 w-3" />
            <span>Start</span>
          </>
        )}
      </button>
    </motion.div>
  );
} 