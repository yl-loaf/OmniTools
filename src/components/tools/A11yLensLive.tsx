import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, AlertTriangle, Sparkles } from 'lucide-react';

export function A11yLensLive() {
  const [issues, setIssues] = useState([
    { id: 1, type: 'Contrast Warning', element: '<button class="text-slate-400 bg-slate-900">', desc: 'Contrast ratio 3.1:1 is below WCAG AA minimum (4.5:1 for normal text).', severity: 'Medium' },
    { id: 2, type: 'Missing Alt Attribute', element: '<img src="/hero.png" />', desc: 'Image element missing alt text descriptor for screen readers.', severity: 'High' },
    { id: 3, type: 'Semantic Landmark', element: '<div class="footer">', desc: 'Consider replacing generic <div> with semantic <footer> element.', severity: 'Low' },
  ]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(issues, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">A11yLens Live</h1>
              <p className="text-xs text-slate-400">Real-time visual feedback on web accessibility issues, highlighting contrast problems, semantic structure gaps, and keyboard navigation issues.</p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium flex items-center gap-2 shadow-lg transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Audit Report' : 'Export Audit Report'}
          </button>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 font-medium text-xs text-slate-300 flex items-center justify-between">
            <span>Detected Accessibility Issues ({issues.length})</span>
            <span className="text-[10px] text-emerald-400">WCAG 2.1 AA Compliant Checker</span>
          </div>
          <div className="divide-y divide-slate-800">
            {issues.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-800 rounded">{item.type}</span>
                    <span className="font-mono text-xs text-slate-200">{item.element}</span>
                  </div>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
                <span
                  className={`text-[10px] px-2 py-1 rounded font-semibold ${
                    item.severity === 'High' ? 'bg-rose-950 text-rose-400' : 'bg-amber-950 text-amber-400'
                  }`}
                >
                  {item.severity} Priority
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
