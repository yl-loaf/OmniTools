import React from 'react';
import { TOOLS_REGISTRY } from '../data/toolsRegistry';
import { Star, Activity, Sparkles, Flame } from 'lucide-react';

interface ActiveToolHeaderProps {
  activeTab: string;
  favoriteIds: string[];
  usageCount?: number;
  onToggleFavorite: (toolId: string) => void;
  onNavigateFavorites: () => void;
}

export const ActiveToolHeader: React.FC<ActiveToolHeaderProps> = ({
  activeTab,
  favoriteIds,
  usageCount = 0,
  onToggleFavorite,
  onNavigateFavorites,
}) => {
  const tool = TOOLS_REGISTRY.find((t) => t.id === activeTab);
  if (!tool) return null;

  const isFavorite = favoriteIds.includes(tool.id);
  const Icon = tool.icon;

  return (
    <div className="mb-4 bg-slate-900/80 backdrop-blur-xs border border-slate-800 rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 shadow-md flex-wrap">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/50">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-white">{tool.name}</span>
          <span className="text-[10px] font-medium px-2 py-0.2 rounded-full bg-slate-800 text-slate-400 border border-slate-700 capitalize">
            {tool.category}
          </span>
          {usageCount > 0 && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded-full bg-orange-950/60 text-orange-300 border border-orange-800/60 flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
              <span>{usageCount} {usageCount === 1 ? 'launch' : 'launches'}</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggleFavorite(tool.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
            isFavorite
              ? 'bg-amber-950/80 text-amber-300 border-amber-700/80 shadow-xs'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700'
          }`}
          title={isFavorite ? 'Starred in My Favorites' : 'Star this tool for quick access'}
        >
          <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
          <span>{isFavorite ? 'Favorited' : 'Star Tool'}</span>
        </button>

        {favoriteIds.length > 0 && (
          <button
            onClick={onNavigateFavorites}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-300 px-2 py-1 rounded-lg hover:bg-slate-800 transition"
          >
            <span>Favorites ({favoriteIds.length})</span>
          </button>
        )}
      </div>
    </div>
  );
};
