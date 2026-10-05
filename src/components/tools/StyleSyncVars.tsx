import React, { useState } from 'react';
import { Palette, Copy, Check, Layers, Sparkles, Plus, Trash2 } from 'lucide-react';

export function StyleSyncVars() {
  const [variables, setVariables] = useState([
    { name: '--color-primary', value: '#3b82f6', category: 'Colors' },
    { name: '--color-bg', value: '#0f172a', category: 'Colors' },
    { name: '--font-sans', value: 'Inter, sans-serif', category: 'Typography' },
    { name: '--radius-card', value: '1rem', category: 'Spacing' },
  ]);
  const [copied, setCopied] = useState(false);

  const cssOutput = `:root {\n` + variables.map((v) => `  ${v.name}: ${v.value};`).join('\n') + `\n}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cssOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/30">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">StyleSync CSS Variables</h1>
              <p className="text-xs text-slate-400">Visually manage, generate, and apply CSS custom properties (variables) across your web projects.</p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-medium flex items-center gap-2 shadow-lg transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied CSS Variables' : 'Copy CSS Root'}
          </button>
        </div>

        {/* Variables List */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 font-medium text-xs text-slate-300 flex items-center justify-between">
            <span>Configured CSS Custom Properties</span>
          </div>
          <div className="divide-y divide-slate-800">
            {variables.map((v, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  {v.value.startsWith('#') && (
                    <div className="w-5 h-5 rounded-md border border-slate-700 shadow" style={{ backgroundColor: v.value }} />
                  )}
                  <span className="font-mono text-xs text-purple-300">{v.name}</span>
                </div>
                <input
                  type="text"
                  value={v.value}
                  onChange={(e) => {
                    const updated = [...variables];
                    updated[idx].value = e.target.value;
                    setVariables(updated);
                  }}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* CSS Code Output */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-300">Generated :root CSS Snippet</label>
          <pre className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-purple-200 border border-slate-800 overflow-x-auto">
            {cssOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}
