'use client';

import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchInterfaceProps {
  query: string;
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchInterface({
  query,
  onSearch,
  placeholder = "Search knowledge graph..."
}: SearchInterfaceProps) {
  const [localQuery, setLocalQuery] = useState(query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localQuery);
  };

  const handleClear = () => {
    setLocalQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-lg">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="input pl-10 pr-20"
          placeholder={placeholder}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
          {localQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600"
            title="Advanced Filters"
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>
    </form>
  );
} 