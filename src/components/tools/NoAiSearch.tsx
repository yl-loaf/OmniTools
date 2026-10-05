import React, { useState } from 'react';
import { Search, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

export default function NoAiSearch() {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Open in new page with &udm=14 parameter
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&udm=14`;
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto py-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" /> AI Overview & Summary Blocker
        </div>
        <h2 className="text-3xl font-extrabold text-slate-100">NoAI Web Search</h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Execute classic web searches using Google's <code className="text-blue-400">&udm=14</code> parameter to instantly strip out AI summaries and chat overviews.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <form onSubmit={handleSearch} className="space-y-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter search query (e.g. React 19 performance tips)..."
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 pl-12 pr-4 py-4 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-900/30 transition flex items-center justify-center gap-2 text-base"
          >
            <span>Search Web (No AI Summaries)</span>
            <ExternalLink className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
