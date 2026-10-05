import React, { useState } from 'react';
import { PackageOpen, AlertTriangle, CheckCircle, RefreshCw, BarChart3 } from 'lucide-react';

export default function BundleAnalyzer() {
  const [analyzing, setAnalyzing] = useState(false);
  const [modules, setModules] = useState([
    { name: 'vendor/react-dom.js', size: '132.4 KB', gzip: '42.1 KB', status: 'optimal' },
    { name: 'components/HeavyChart.tsx', size: '284.1 KB', gzip: '89.5 KB', status: 'warning', suggestion: 'Apply dynamic import() code-splitting' },
    { name: 'services/firebase-sdk.js', size: '198.0 KB', gzip: '58.2 KB', status: 'optimal' },
    { name: 'utils/lodash-all.js', size: '72.5 KB', gzip: '24.1 KB', status: 'warning', suggestion: 'Import individual lodash methods' },
    { name: 'App.tsx (Main Entry)', size: '45.2 KB', gzip: '12.8 KB', status: 'optimal' },
  ]);

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <PackageOpen className="w-6 h-6 text-indigo-400" />
            Code Splitting & Bundle Analyzer
          </h2>
          <p className="text-sm text-slate-400 mt-1">Inspect module dependencies, identify oversized components, and simulate optimal code-splitting reductions.</p>
        </div>
        <button
          onClick={handleRunAnalysis}
          disabled={analyzing}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
          {analyzing ? 'Analyzing App...' : 'Run Deep Audit'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Bundle Size</div>
          <div className="text-3xl font-extrabold text-slate-100 mt-2 font-mono">732.2 KB</div>
          <div className="text-xs text-emerald-400 mt-1 font-medium">Gzipped: 226.7 KB</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Estimated Load Time (3G)</div>
          <div className="text-3xl font-extrabold text-indigo-400 mt-2 font-mono">1.82s</div>
          <div className="text-xs text-slate-400 mt-1">Potential savings: ~45% with splitting</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Optimization Opportunities</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-2 font-mono">2 Modules</div>
          <div className="text-xs text-amber-400/80 mt-1">Heavy chart & utility trees</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-400" /> Module Breakdown & Recommendations
        </h3>
        <div className="space-y-3">
          {modules.map((mod, idx) => (
            <div key={idx} className="p-4 bg-slate-800/80 border border-slate-700/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-mono font-bold text-slate-200 text-sm">{mod.name}</div>
                {mod.suggestion && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 mt-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {mod.suggestion}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-mono text-sm text-slate-100 font-semibold">{mod.size}</div>
                  <div className="text-xs text-slate-400 font-mono">Gzip: {mod.gzip}</div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  mod.status === 'optimal' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {mod.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
