import React, { useState } from 'react';
import { Compass, Layers, Eye } from 'lucide-react';

export default function CssStackingVisualizer() {
  const [selectedContext, setSelectedContext] = useState('Header (z-index: 10)');

  const contexts = [
    { name: 'Root Document', zIndex: 'auto', reason: '<html> root element', children: 4 },
    { name: 'Header (z-index: 10)', zIndex: '10', reason: 'Positioned element with explicit z-index', children: 2 },
    { name: 'Modal Overlay', zIndex: '999', reason: 'Opacity < 1 & position fixed', children: 3 },
    { name: 'Dropdown Menu', zIndex: '50', reason: 'transform: translateZ(0)', children: 1 },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Compass className="w-6 h-6 text-purple-400" />
            CSS Stacking Context Visualizer
          </h2>
          <p className="text-sm text-slate-400 mt-1">Interactively inspect and debug z-index hierarchies and rendering order anomalies.</p>
        </div>
        <div className="px-3 py-1.5 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg text-xs font-semibold">
          DOM Layer Inspector
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Active Stacking Contexts</h3>
          {contexts.map((ctx, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedContext(ctx.name)}
              className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                selectedContext === ctx.name ? 'bg-purple-600/20 border-purple-500/50 text-purple-200' : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <div>
                <div className="font-bold text-sm font-mono">{ctx.name}</div>
                <div className="text-xs text-slate-400 mt-1">{ctx.reason}</div>
              </div>
              <span className="px-2.5 py-1 bg-slate-700 text-slate-300 rounded font-mono text-xs">z: {ctx.zIndex}</span>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" /> Rendering Order Breakdown
            </h3>
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 font-mono text-xs text-slate-300">
              <div className="text-purple-400 font-bold mb-2">Context: {selectedContext}</div>
              <div className="p-2.5 bg-slate-900 rounded border border-slate-800">1. Background color and background images</div>
              <div className="p-2.5 bg-slate-900 rounded border border-slate-800">2. Descendant stacking contexts with negative z-index</div>
              <div className="p-2.5 bg-slate-900 rounded border border-slate-800">3. In-flow, non-positioned block descendants</div>
              <div className="p-2.5 bg-slate-900 rounded border border-slate-800">4. Positioned descendants with positive z-index</div>
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-4">
            Ensures precise overlap debugging across complex layouts and modal dialogs.
          </div>
        </div>
      </div>
    </div>
  );
}
