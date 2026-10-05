import React, { useState } from 'react';
import { Layers, Copy, Check, Grid, Sparkles } from 'lucide-react';

export function CssGridBuilder() {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [gap, setGap] = useState(16);
  const [copied, setCopied] = useState(false);

  const cssCode = `.grid-container {
  display: grid;
  grid-template-columns: repeat(${columns}, minmax(0, 1fr));
  grid-template-rows: repeat(${rows}, minmax(100px, auto));
  gap: ${gap}px;
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/30">
              <Grid className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">CSS Grid Visual Template Builder</h1>
              <p className="text-xs text-slate-400">Interactive CSS Grid area layout generator with instant production-ready CSS and HTML code export.</p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-medium flex items-center gap-2 shadow-lg transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied CSS' : 'Copy CSS Code'}
          </button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Columns: {columns}</label>
            <input
              type="range"
              min="1"
              max="6"
              value={columns}
              onChange={(e) => setColumns(parseInt(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Rows: {rows}</label>
            <input
              type="range"
              min="1"
              max="6"
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Gap: {gap}px</label>
            <input
              type="range"
              min="0"
              max="32"
              step="4"
              value={gap}
              onChange={(e) => setGap(parseInt(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>
        </div>

        {/* Live Preview */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-300">Live Grid Preview</label>
          <div
            className="bg-slate-950 border border-slate-800 rounded-xl p-6 min-h-[300px]"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(80px, auto))`,
              gap: `${gap}px`,
            }}
          >
            {Array.from({ length: columns * rows }).map((_, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-purple-500/30 rounded-xl p-4 flex items-center justify-center font-mono text-xs text-purple-300 shadow-lg hover:border-purple-400 transition"
              >
                Area {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Code Output */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-300">Generated CSS Code</label>
          <pre className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-purple-200 border border-slate-800 overflow-x-auto">
            {cssCode}
          </pre>
        </div>
      </div>
    </div>
  );
}
