/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ToolRequest, UserProfile } from '../types';
import { Sparkles, X, PlusCircle } from 'lucide-react';

interface SuggestEnhancementModalProps {
  tool: { id: string; name: string };
  currentUser: UserProfile | null;
  isGuest: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (req: Omit<ToolRequest, 'id' | 'createdAt' | 'updatedAt' | 'votes' | 'voters' | 'pointsAwarded'>) => void;
  onOpenAuth: () => void;
}

export const SuggestEnhancementModal: React.FC<SuggestEnhancementModalProps> = ({
  tool,
  currentUser,
  isGuest,
  isOpen,
  onClose,
  onSubmit,
  onOpenAuth,
}) => {
  const [featureIdea, setFeatureIdea] = useState('');
  const [details, setDetails] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!featureIdea.trim()) return;

    const authorId = currentUser ? currentUser.uid : `guest-${Date.now()}`;
    const authorName = currentUser ? currentUser.displayName : 'Guest Contributor';

    onSubmit({
      title: `[Enhancement: ${tool.name}] ${featureIdea.trim()}`,
      description: details.trim() || `Proposed new function/feature to improve ${tool.name}.`,
      category: 'productivity',
      status: 'pending',
      authorId,
      authorName,
      authorPhoto: currentUser?.photoURL,
      isGuest: isGuest || !currentUser,
    });

    setFeatureIdea('');
    setDetails('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-full transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-950 text-purple-400 border border-purple-800/60">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Add Function / Enhance Tool</h3>
            <p className="text-xs text-slate-400">Suggest a new capability for <strong className="text-purple-300">{tool.name}</strong></p>
          </div>
        </div>

        {!currentUser ? (
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-3">
            <p className="text-xs text-slate-400">
              Sign in with Google to earn contribution points (<strong className="text-emerald-400">+2 CP</strong>) when your enhancement is reviewed.
            </p>
            <button
              onClick={onOpenAuth}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Sign In with Google
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">What new function to add?</label>
              <input
                type="text"
                value={featureIdea}
                onChange={(e) => setFeatureIdea(e.target.value)}
                placeholder="e.g. Add dark/light contrast toggle or batch export"
                maxLength={100}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-purple-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Details / How it should work (Optional)</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe how this new function would improve user workflow..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-purple-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-purple-500/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit Tool Enhancement (+2 CP)</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
