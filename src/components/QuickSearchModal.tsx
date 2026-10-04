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
  Sparkles,
  Clock,
  Trash2,
  Zap
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
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('omnitools_recent_searches');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset query when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const autocompleteSuggestions = useMemo(() => {
    if (!isOpen || !query.trim() || query.length < 1) return [];
    const q = query.toLowerCase().trim();
    return TOOLS_REGISTRY.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.shortLabel.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        (t.keywords && t.keywords.some((k) => k.toLowerCase().includes(q)))
    ).slice(0, 5);
  }, [isOpen, query]);

  if (!isOpen) return null;

  const saveSearchTerm = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed || trimmed.length < 2) return;
    const filtered = recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
    const updated = [trimmed, ...filtered].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('omnitools_recent_searches', JSON.stringify(updated));
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('omnitools_recent_searches');
  };

  // Highlight matches helper
  const highlightMatch = (text: string, q: string) => {
    if (!q.trim()) return text;
    try {
      const parts = text.split(new RegExp(`(${q.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
      return parts.map((part, i) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <span key={i} className="bg-blue-500/30 text-blue-300 font-bold px-0.5 rounded underline">
            {part}
          </span>
        ) : (
          part
        )
      );
    } catch {
      return text;
    }
  };

  const filteredTools = TOOLS_REGISTRY.filter((t) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    const matchName = t.name.toLowerCase().includes(q);
    const matchDesc = t.desc.toLowerCase().includes(q);
    const matchCat = t.category.toLowerCase().includes(q);
    const matchShort = t.shortLabel.toLowerCase().includes(q);
    const matchId = t.id.toLowerCase().includes(q);
    const matchKeywords = t.keywords ? t.keywords.some((k) => k.toLowerCase().includes(q)) : false;
    return matchName || matchDesc || matchCat || matchShort || matchId || matchKeywords;
  });

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
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                saveSearchTerm(query);
              }
            }}
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

        {/* Real-time Auto-complete Suggestions Bar */}
        {autocompleteSuggestions.length > 0 && query.trim() && (
          <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
              <Zap className="w-3 h-3 text-amber-400" /> Suggestions:
            </span>
            {autocompleteSuggestions.map((suggestion) => {
              const SuggIcon = suggestion.icon;
              return (
                <button
                  key={suggestion.id}
                  onClick={() => {
                    saveSearchTerm(suggestion.name);
                    onSelectTab(suggestion.id);
                    onClose();
                  }}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition flex items-center gap-1.5 shrink-0"
                >
                  <SuggIcon className="w-3 h-3 text-blue-400" />
                  <span>{highlightMatch(suggestion.name, query)}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {/* Recent Searches Section (shown when query is empty) */}
          {recentSearches.length > 0 && !query && (
            <div className="space-y-2 pb-2 border-b border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" /> Recent Searches ({recentSearches.length})
                </span>
                <button
                  onClick={handleClearRecent}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-300 hover:text-rose-400 transition flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3 text-rose-400" /> Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((term, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(term);
                      saveSearchTerm(term);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
                  >
                    <Search className="w-3 h-3 text-slate-400" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

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
                          if (query) saveSearchTerm(query);
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
                            {highlightMatch(tool.name, query)}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">{highlightMatch(tool.desc, query)}</div>
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
                        if (query) saveSearchTerm(query);
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
                          {highlightMatch(tool.name, query)}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">{highlightMatch(tool.desc, query)}</div>
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
                      if (query) saveSearchTerm(query);
                      onSelectTab('request-hub');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition text-left border border-slate-800/60"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="text-xs font-medium text-purple-300 truncate">{highlightMatch(req.title, query)}</div>
                      <div className="text-[11px] text-slate-400 truncate">{highlightMatch(req.description, query)}</div>
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
