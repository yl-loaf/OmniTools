import React, { useState } from 'react';
import { Layers, Copy, Check, ShieldAlert, Sparkles, Plus, Trash2 } from 'lucide-react';

export function AssetOverrider() {
  const [rules, setRules] = useState([
    { id: 1, type: 'CSS', targetUrl: 'https://example.com/styles.css', overrideUrl: 'http://localhost:3000/local.css', enabled: true },
    { id: 2, type: 'JavaScript', targetUrl: 'https://example.com/analytics.js', overrideUrl: 'data:text/javascript,console.log("Blocked by AssetOverrider");', enabled: true },
  ]);
  const [copied, setCopied] = useState(false);

  const handleToggle = (id: number) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(rules, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-600/20 text-rose-400 rounded-xl border border-rose-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">Asset Overrider</h1>
              <p className="text-xs text-slate-400">Block specific CSS, JavaScript, or image assets or override them with local files to test changes without modifying source code.</p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-medium flex items-center gap-2 shadow-lg transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Rules' : 'Export Override Rules'}
          </button>
        </div>

        {/* Rules Table */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 font-medium text-xs text-slate-300 flex items-center justify-between">
            <span>Active Interception Rules ({rules.filter((r) => r.enabled).length})</span>
            <span className="text-[10px] text-slate-500">Local Proxy Simulation</span>
          </div>
          <div className="divide-y divide-slate-800">
            {rules.map((rule) => (
              <div key={rule.id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={() => handleToggle(rule.id)}
                    className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-800 rounded">{rule.type}</span>
                      <span className="font-mono text-xs text-slate-200">{rule.targetUrl}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-1">Override: {rule.overrideUrl}</div>
                  </div>
                </div>
                <button
                  onClick={() => setRules(rules.filter((r) => r.id !== rule.id))}
                  className="p-2 text-slate-500 hover:text-rose-400 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
