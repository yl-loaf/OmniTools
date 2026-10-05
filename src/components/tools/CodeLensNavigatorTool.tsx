import React, { useState } from 'react';
import { Layers, Copy, Check, Sparkles, Navigation } from 'lucide-react';

export function CodeLensNavigatorTool() {
  const [components, setComponents] = useState([
    { name: 'Navbar.tsx', type: 'React Component', lines: 120, status: 'Optimized' },
    { name: 'ActiveToolHeader.tsx', type: 'Header Bar', lines: 85, status: 'Optimized' },
    { name: 'AdminPortal.tsx', type: 'Dashboard', lines: 340, status: 'Secure' },
    { name: 'FavoritesHub.tsx', type: 'Grid View', lines: 95, status: 'Fast' },
  ]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(components, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">CodeLens Navigator</h1>
              <p className="text-xs text-slate-400">Analyzes webpage visual components and structure to suggest relevant code snippets or component library examples.</p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium flex items-center gap-2 shadow-lg transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Architecture' : 'Export Component Tree'}
          </button>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 font-medium text-xs text-slate-300">
            Detected Page Components & Structure
          </div>
          <div className="divide-y divide-slate-800">
            {components.map((comp, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-indigo-300 font-bold">{comp.name}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-900 text-slate-400 border border-slate-800 rounded">{comp.type}</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-slate-400">{comp.lines} lines</span>
                  <span className="text-emerald-400">{comp.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
