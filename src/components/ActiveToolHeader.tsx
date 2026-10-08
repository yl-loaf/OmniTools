/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TOOLS_REGISTRY } from '../data/toolsRegistry';
import { UserProfile } from '../types';
import { initFirebase } from '../services/firebase';
import { doc, setDoc, collection, onSnapshot } from 'firebase/firestore';
import { Star, Activity, Sparkles, Flame, AlertCircle, Share2, Check } from 'lucide-react';

interface ActiveToolHeaderProps {
  activeTab: string;
  favoriteIds: string[];
  usageCount?: number;
  currentUser?: UserProfile | null;
  onToggleFavorite: (toolId: string) => void;
  onNavigateFavorites: () => void;
  onReportBug: (toolId: string, toolName: string) => void;
  onSuggestEnhancement: (toolId: string, toolName: string) => void;
}

export const ActiveToolHeader: React.FC<ActiveToolHeaderProps> = ({
  activeTab,
  favoriteIds,
  usageCount = 0,
  currentUser,
  onToggleFavorite,
  onNavigateFavorites,
  onReportBug,
  onSuggestEnhancement,
}) => {
  const [copiedShare, setCopiedShare] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const tool = TOOLS_REGISTRY.find((t) => t.id === activeTab);
  if (!tool) return null;

  const isFavorite = favoriteIds.includes(tool.id);
  const Icon = tool.icon;

  const getDeviceId = () => {
    let id = localStorage.getItem('omnitools_device_id');
    if (!id) {
      id = `guest-${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem('omnitools_device_id', id);
    }
    return id;
  };

  const userId = currentUser?.uid || getDeviceId();

  const getRatingsMap = (): Record<string, Record<string, number>> => {
    try {
      const saved = localStorage.getItem('omnitools_tool_ratings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  };

  const [ratingsMap, setRatingsMap] = useState<Record<string, Record<string, number>>>(getRatingsMap);

  useEffect(() => {
    const { db, isConfigured } = initFirebase();
    if (isConfigured && db) {
      const unsub = onSnapshot(collection(db, 'tool_ratings'), (snapshot) => {
        const remoteMap: Record<string, Record<string, number>> = {};
        snapshot.forEach((d) => {
          const data = d.data();
          if (data && data.toolId && data.ratings) {
            remoteMap[data.toolId] = data.ratings;
          }
        });
        setRatingsMap((prev) => {
          const merged = { ...prev, ...remoteMap };
          localStorage.setItem('omnitools_tool_ratings', JSON.stringify(merged));
          return merged;
        });
      }, (err) => {
        console.warn('Firestore tool_ratings listener warning:', err);
      });
      return () => unsub();
    }
  }, []);

  const toolRatings = ratingsMap[tool.id] || {};
  const ratingValues = Object.values(toolRatings);
  const ratingCount = ratingValues.length;
  const averageRating = ratingCount > 0 ? (ratingValues.reduce((a, b) => a + b, 0) / ratingCount).toFixed(1) : '0.0';
  const userRating = toolRatings[userId] || 0;

  const handleRate = (stars: number) => {
    const updatedToolRatings = {
      ...toolRatings,
      [userId]: stars,
    };
    const updatedMap = {
      ...ratingsMap,
      [tool.id]: updatedToolRatings,
    };
    setRatingsMap(updatedMap);
    localStorage.setItem('omnitools_tool_ratings', JSON.stringify(updatedMap));

    const { db, isConfigured } = initFirebase();
    if (isConfigured && db) {
      setDoc(doc(db, 'tool_ratings', tool.id), {
        toolId: tool.id,
        ratings: updatedToolRatings,
        updatedAt: new Date().toISOString(),
      }, { merge: true }).catch(() => {});
    }
  };

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
    <div className="mb-4 bg-slate-900/85 backdrop-blur-xs border border-slate-800 rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 shadow-md flex-wrap">
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
        {/* 5-Star Rating System */}
        <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-0.5" title="Click to rate this tool quality">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = star <= (hoverRating || userRating);
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleRate(star)}
                  className="p-0.5 focus:outline-hidden transition transform hover:scale-110 cursor-pointer"
                  title={`Rate ${star} out of 5 stars`}
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      active
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-600 hover:text-amber-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <span className="text-xs font-mono font-bold text-amber-300 ml-1">
            {averageRating}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            ({ratingCount})
          </span>
        </div>

        <button
          onClick={() => onSuggestEnhancement(tool.id, tool.name)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 rounded-xl text-xs font-semibold transition border border-purple-800/60 cursor-pointer shadow-xs"
          title="Suggest another function or feature to improve this existing tool"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Add Function</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-950/80 hover:bg-blue-900 text-blue-300 rounded-xl text-xs font-semibold transition border border-blue-700/60 shadow-xs cursor-pointer"
          title="Share this tool with others or copy direct link"
        >
          {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-blue-400" />}
          <span>{copiedShare ? 'Link Copied!' : 'Share Tool'}</span>
        </button>

        <button
          onClick={() => onReportBug(tool.id, tool.name)}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 rounded-xl text-xs font-semibold transition border border-rose-800/60 cursor-pointer"
          title="Report a broken feature or bug (+3 CP reward when fixed)"
        >
          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>Report Bug</span>
        </button>

        <button
          onClick={() => onToggleFavorite(tool.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border cursor-pointer ${
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
            className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-300 px-2 py-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <span>Favorites ({favoriteIds.length})</span>
          </button>
        )}
      </div>
    </div>
  );
};
