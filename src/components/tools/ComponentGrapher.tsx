import React, { useState } from 'react';
import { GitBranch, Layers, ChevronRight, Cpu } from 'lucide-react';

export default function ComponentGrapher() {
  const [selectedNode, setSelectedNode] = useState('App');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-cyan-400" />
            ComponentGrapher
          </h2>
          <p className="text-sm text-slate-400 mt-1">Visualize React/Vue component trees, parent-child relationships, and prop flows.</p>
        </div>
        <div className="px-3 py-1.5 bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-semibold">
          Live DOM Tree Inspector
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tree hierarchy */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl md:col-span-1">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Component Hierarchy</h3>
          <div className="space-y-2 font-mono text-sm">
            <div
              onClick={() => setSelectedNode('App')}
              className={`p-2.5 rounded-lg cursor-pointer transition flex items-center gap-2 ${selectedNode === 'App' ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'}`}
            >
              <Cpu className="w-4 h-4 text-cyan-400" /> &lt;App /&gt;
            </div>
            <div className="pl-4 space-y-2 border-l border-slate-800 ml-2">
              <div
                onClick={() => setSelectedNode('Navbar')}
                className={`p-2 rounded-lg cursor-pointer transition flex items-center gap-2 ${selectedNode === 'Navbar' ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'}`}
              >
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" /> &lt;Navbar /&gt;
              </div>
              <div
                onClick={() => setSelectedNode('Dashboard')}
                className={`p-2 rounded-lg cursor-pointer transition flex items-center gap-2 ${selectedNode === 'Dashboard' ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'}`}
              >
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" /> &lt;Dashboard /&gt;
              </div>
              <div className="pl-4 space-y-2 border-l border-slate-800 ml-2">
                <div
                  onClick={() => setSelectedNode('MetricsCard')}
                  className={`p-2 rounded-lg cursor-pointer transition flex items-center gap-2 ${selectedNode === 'MetricsCard' ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'}`}
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" /> &lt;MetricsCard /&gt;
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Node inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-100 font-mono">&lt;{selectedNode} /&gt;</h3>
                <span className="text-xs text-slate-400">File: src/components/{selectedNode}.tsx</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-mono">Render: 1.2ms</span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Props & State</h4>
                <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs text-slate-300 border border-slate-800/80 space-y-1">
                  <div><span className="text-purple-400">theme:</span> <span className="text-amber-300">"indigo"</span></div>
                  <div><span className="text-purple-400">user:</span> <span className="text-blue-300">{`{ uid: "u_109", role: "admin" }`}</span></div>
                  <div><span className="text-purple-400">activeTab:</span> <span className="text-emerald-300">"{selectedNode.toLowerCase()}"</span></div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">DOM Node Statistics</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                    <div className="text-xs text-slate-400">Child Elements</div>
                    <div className="text-lg font-bold text-slate-100 font-mono mt-0.5">14 nodes</div>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                    <div className="text-xs text-slate-400">Re-renders</div>
                    <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">3 times</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
