import React, { useState } from 'react';
import { TOOLS_REGISTRY } from '../data/toolsRegistry';
import { Star, Activity, Sparkles, Flame, AlertCircle, Share2, Check } from 'lucide-react';

interface ActiveToolHeaderProps {
  activeTab: string;
  favoriteIds: string[];
  usageCount?: number;
  onToggleFavorite: (toolId: string) => void;
  onNavigateFavorites: () => void;
  onReportBug: (toolId: string, toolName: string) => void;
}

export const ActiveToolHeader: React.FC<ActiveToolHeaderProps> = ({
  activeTab,
  favoriteIds,
  usageCount = 0,
  onToggleFavorite,
  onNavigateFavorites,
  onReportBug,
}) => {
  const [copiedShare, setCopiedShare] = useState(false);
  const tool = TOOLS_REGISTRY.find((t) => t.id === activeTab);
  if (!tool) return null;

  const isFavorite = favoriteIds.includes(tool.id);
  const Icon = tool.icon;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?tool=${tool.id}`;
    const shareData = {
      title: `${tool.name} — OmniTools`,
      text: `Check out ${tool.name}: ${tool.desc}`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {}
    }

    navigator.clipboard.writeText(shareUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

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

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-950/80 hover:bg-blue-900 text-blue-300 rounded-xl text-xs font-semibold transition border border-blue-700/60 shadow-xs"
          title="Share this tool with others or copy direct link"
        >
          {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-blue-400" />}
          <span>{copiedShare ? 'Link Copied!' : 'Share Tool'}</span>
        </button>

        <button
          onClick={() => onReportBug(tool.id, tool.name)}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 rounded-xl text-xs font-semibold transition border border-rose-800/60"
          title="Report a broken feature or bug (+3 CP reward when fixed)"
        >
          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>Report Bug</span>
        </button>

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
            className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-300 px-2 py-1 rounded-lg hover:bg-slate-800 transition"
          >
            <span>Favorites ({favoriteIds.length})</span>
          </button>
        )}
      </div>
    </div>
  );
};
