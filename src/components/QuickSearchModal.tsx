import React, { useState, useEffect, useMemo } from 'react';
import { ToolRequest } from '../types';
import { TOOLS_REGISTRY } from '../data/toolsRegistry';
import {
  Search,
  X,
  Star,
  MessageSquarePlus,
  Trophy,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: string) => void;
  requests: ToolRequest[];
  favoriteIds?: string[];
  onToggleFavorite?: (toolId: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  requests,
  favoriteIds = [],
  onToggleFavorite = () => {},
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredTools = TOOLS_REGISTRY.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.desc.toLowerCase().includes(query.toLowerCase()) ||
      t.category.toLowerCase().includes(query.toLowerCase()) ||
      t.shortLabel.toLowerCase().includes(query.toLowerCase())
  );

  const starredTools = filteredTools.filter((t) => favoriteIds.includes(t.id));
  const otherTools = filteredTools.filter((t) => !favoriteIds.includes(t.id));

  const filteredRequests = requests.filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3 shrink-0">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, commands, or starred favorites..."
            className="w-full bg-transparent text-sm text-white focus:outline-hidden placeholder:text-slate-500"
          />
          <button
            onClick={onClose}
            className="px-2 py-0.5 bg-slate-800 rounded text-xs font-mono text-slate-400 border border-slate-700 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {/* Starred Favorites First */}
          {starredTools.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider px-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> Starred Favorites ({starredTools.length})
                </span>
                <span className="text-[10px] text-slate-500">Pinned Quick Access</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {starredTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={tool.id}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-950/20 hover:bg-amber-950/40 border border-amber-800/40 transition group"
                    >
                      <button
                        onClick={() => {
                          onSelectTab(tool.id);
                          onClose();
                        }}
                        className="flex items-start gap-2.5 text-left flex-1 min-w-0"
                      >
                        <div className="p-1.5 rounded-lg bg-amber-950 text-amber-300 border border-amber-800/60 shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-white group-hover:text-amber-300 truncate">
                            {tool.name}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">{tool.desc}</div>
                        </div>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(tool.id);
                        }}
                        className="p-1.5 text-amber-400 hover:text-slate-500 transition shrink-0"
                        title="Unstar from favorites"
                      >
                        <Star className="w-4 h-4 fill-amber-400" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Other Tools List */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center justify-between">
              <span>All Utilities ({otherTools.length})</span>
              <span className="text-[10px] text-slate-500">25+ available</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {otherTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={tool.id}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition text-left group border border-slate-800/60 hover:border-slate-700"
                  >
                    <button
                      onClick={() => {
                        onSelectTab(tool.id);
                        onClose();
                      }}
                      className="flex items-start gap-2.5 text-left flex-1 min-w-0"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-blue-600 text-blue-400 group-hover:text-white transition shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-white group-hover:text-blue-300 truncate">
                          {tool.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">{tool.desc}</div>
                      </div>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(tool.id);
                      }}
                      className="p-1.5 text-slate-600 hover:text-amber-400 opacity-0 group-hover:opacity-100 transition shrink-0"
                      title="Star this tool"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Community Requests Match */}
          {filteredRequests.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                Community Proposals ({filteredRequests.length})
              </div>
              <div className="space-y-1">
                {filteredRequests.slice(0, 5).map((req) => (
                  <button
                    key={req.id}
                    onClick={() => {
                      onSelectTab('request-hub');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition text-left border border-slate-800/60"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="text-xs font-medium text-purple-300 truncate">{req.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">{req.description}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 uppercase shrink-0">
                      {req.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between shrink-0">
          <span>Click ⭐ to pin tools to your top favorites</span>
          <span className="text-[11px] text-slate-500">25+ Utilities Available</span>
        </div>
      </div>
    </div>
  );
};
