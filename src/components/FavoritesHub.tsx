import React, { useState, useMemo } from 'react';
import { TOOLS_REGISTRY, ToolMeta } from '../data/toolsRegistry';
import {
  Star,
  StarOff,
  Sparkles,
  ArrowRight,
  Search,
  Grid,
  Heart,
  Plus,
  Compass,
  Check,
  Flame,
  TrendingUp,
  Activity
} from 'lucide-react';

interface FavoritesHubProps {
  favoriteIds: string[];
  usageCounts?: Record<string, number>;
  onToggleFavorite: (toolId: string) => void;
  onSelectTool: (toolId: string) => void;
}

export const FavoritesHub: React.FC<FavoritesHubProps> = ({
  favoriteIds,
  usageCounts = {},
  onToggleFavorite,
  onSelectTool,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'most_used' | 'name'>('most_used');

  const favoriteTools = useMemo(() => {
    let list = TOOLS_REGISTRY.filter((t) => favoriteIds.includes(t.id));
    if (sortBy === 'most_used') {
      list = [...list].sort((a, b) => (usageCounts[b.id] || 0) - (usageCounts[a.id] || 0));
    } else {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [favoriteIds, sortBy, usageCounts]);

  const filteredFavorites = useMemo(() => {
    return favoriteTools.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.desc.toLowerCase().includes(search.toLowerCase()) ||
        t.shortLabel.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [favoriteTools, search, categoryFilter]);

  // All tools sorted by usage count for the "Most Used" section
  const mostUsedTools = useMemo(() => {
    return [...TOOLS_REGISTRY]
      .sort((a, b) => (usageCounts[b.id] || 0) - (usageCounts[a.id] || 0))
      .slice(0, 8);
  }, [usageCounts]);

  // Suggested tools not yet in favorites
  const suggestedTools = useMemo(() => {
    return TOOLS_REGISTRY.filter((t) => !favoriteIds.includes(t.id));
  }, [favoriteIds]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-500 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/20 shrink-0">
            <Star className="w-7 h-7 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">My Starred Favorites</h2>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                {favoriteTools.length} Pinned
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
              Your personalized utility dashboard. Star frequently used tools for instant 1-click launching and keyboard access.
            </p>
          </div>
        </div>

        {/* Quick Search & Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto relative z-10">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search favorites..."
              className="w-full bg-transparent text-white focus:outline-hidden placeholder:text-slate-500"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 font-medium focus:outline-hidden"
          >
            <option value="most_used">Sort: Most Used</option>
            <option value="name">Sort: Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* 1. MOST USED TOOLS SECTION (Powered by Firestore Usage Counts) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-950 text-orange-400 border border-orange-800/60">
              <Flame className="w-5 h-5 fill-orange-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <span>Most Used & Trending Utilities</span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-orange-950 text-orange-300 border border-orange-800 font-bold">
                  Live Firestore Stats
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Top utilities ranked by real-time community and personal launch frequency.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          {mostUsedTools.map((tool, idx) => {
            const Icon = tool.icon;
            const count = usageCounts[tool.id] || 0;
            const isFav = favoriteIds.includes(tool.id);

            return (
              <div
                key={tool.id}
                className="bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between group transition hover:shadow-xl hover:shadow-orange-500/5 relative"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black font-mono px-1.5 py-0.5 rounded ${
                        idx === 0
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : idx === 1
                          ? 'bg-slate-700 text-slate-200'
                          : idx === 2
                          ? 'bg-amber-900/40 text-amber-400'
                          : 'bg-slate-900 text-slate-500'
                      }`}>
                        #{idx + 1}
                      </span>
                      <div className="p-1.5 rounded-lg bg-slate-900 text-blue-400 group-hover:text-white group-hover:bg-blue-600 transition">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(tool.id);
                      }}
                      className="p-1 text-slate-500 hover:text-amber-400 transition"
                      title={isFav ? 'Remove from favorites' : 'Star tool'}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition truncate">
                      {tool.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{tool.desc}</p>
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-slate-900 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] font-mono text-orange-400 font-bold">
                    <Activity className="w-3 h-3 text-orange-500" />
                    <span>{count} {count === 1 ? 'launch' : 'launches'}</span>
                  </div>

                  <button
                    onClick={() => onSelectTool(tool.id)}
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN FAVORITE CARDS GRID */}
      {favoriteTools.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 mx-auto flex items-center justify-center">
            <Star className="w-8 h-8 text-slate-500" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-white">You haven't starred any tools yet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click the star icon (⭐) on any tool or browse the suggestions below to build your custom quick-access toolbox!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            <span>Pinned Quick-Launch Utilities ({filteredFavorites.length})</span>
            <span className="text-[11px] text-slate-500">1-Click Launch</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFavorites.map((tool) => {
              const Icon = tool.icon;
              const count = usageCounts[tool.id] || 0;

              return (
                <div
                  key={tool.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between group transition hover:shadow-2xl hover:shadow-blue-500/5 relative"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-slate-800 group-hover:bg-blue-600 text-blue-400 group-hover:text-white transition shadow-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(tool.id);
                        }}
                        className="p-1.5 text-amber-400 hover:text-slate-500 transition rounded-lg hover:bg-slate-800"
                        title="Remove from favorites"
                      >
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition">
                          {tool.name}
                        </h4>
                        {tool.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                        {tool.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                        {tool.category}
                      </span>
                      {count > 0 && (
                        <span className="text-[10px] font-mono text-orange-400 font-bold bg-orange-950/40 px-1.5 py-0.2 rounded border border-orange-800/40">
                          {count} uses
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => onSelectTool(tool.id)}
                      className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 group-hover:translate-x-0.5 transition"
                    >
                      <span>Open Tool</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. EXPLORE MORE / SUGGESTED TRAY */}
      {suggestedTools.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Explore More Tools to Pin
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              {suggestedTools.length} more available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {suggestedTools.slice(0, 8).map((tool) => {
              const Icon = tool.icon;
              const count = usageCounts[tool.id] || 0;

              return (
                <div
                  key={tool.id}
                  className="bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3.5 flex items-center justify-between gap-3 group transition"
                >
                  <button
                    onClick={() => onSelectTool(tool.id)}
                    className="flex items-center gap-2.5 min-w-0 text-left flex-1"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-900 text-blue-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-200 group-hover:text-blue-300 truncate">
                        {tool.shortLabel}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate flex items-center gap-1.5">
                        <span>{tool.category}</span>
                        {count > 0 && <span className="text-orange-400 font-mono font-bold">• {count} uses</span>}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => onToggleFavorite(tool.id)}
                    className="p-1.5 text-slate-500 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition shrink-0"
                    title="Add to Favorites"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
