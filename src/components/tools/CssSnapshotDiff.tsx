import React, { useState } from 'react';
import { GitCompare, Copy, Check, Layers, Sparkles } from 'lucide-react';

export function CssSnapshotDiff() {
  const [cssA, setCssA] = useState(`/* Local Development Snapshot */
.card-container {
  background-color: #0f172a;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}`);

  const [cssB, setCssB] = useState(`/* Staging Server Snapshot */
.card-container {
  background-color: #1e293b;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}`);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`Snapshot Diff Analysis:\n---\nA: ${cssA}\n---\nB: ${cssB}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <GitCompare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">CSS Snapshot Diff</h1>
              <p className="text-xs text-slate-400">Allows developers to take snapshots of computed CSS and intelligently highlights and explains style differences across environments.</p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium flex items-center gap-2 shadow-lg transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Diff Report' : 'Copy Diff Report'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Snapshot A (Local)</label>
            <textarea
              value={cssA}
              onChange={(e) => setCssA(e.target.value)}
              rows={10}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-blue-200 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Snapshot B (Staging)</label>
            <textarea
              value={cssB}
              onChange={(e) => setCssB(e.target.value)}
              rows={10}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-200 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>
        </div>

        {/* Diff Breakdown */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-200">Diff Intelligence Breakdown</h2>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs font-mono">
            <div className="text-emerald-400 flex items-center gap-2">
              <span>~</span> background-color: #0f172a (Local) vs #1e293b (Staging) — <span className="text-slate-400">Staging is lighter shade</span>
            </div>
            <div className="text-amber-400 flex items-center gap-2">
              <span>~</span> border-radius: 1rem (Local) vs 0.75rem (Staging) — <span className="text-slate-400">Local has rounder corners</span>
            </div>
            <div className="text-amber-400 flex items-center gap-2">
              <span>~</span> padding: 1.5rem (Local) vs 1.25rem (Staging) — <span className="text-slate-400">Staging is tighter</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
