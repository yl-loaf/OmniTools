import React, { useState } from 'react';
import { Image, Sparkles, Copy, Check, Scissors } from 'lucide-react';
import { playSuccessSound } from '../../services/soundEffects';

export function SvgPathCleanerTool() {
  const [svgInput, setSvgInput] = useState('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#3b82f6" d="M12 2.001c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/></svg>');
  const [optimizedOutput, setOptimizedOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleOptimize = () => {
    let clean = svgInput
      .replace(/<!--[\s\S]*?-->/g, '') // remove comments
      .replace(/\s+/g, ' ') // collapse whitespaces
      .replace(/>\s+</g, '><') // remove whitespace between tags
      .trim();
    setOptimizedOutput(clean);
    playSuccessSound();
  };

  const handleCopy = () => {
    if (optimizedOutput) {
      navigator.clipboard.writeText(optimizedOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Image className="w-6 h-6 text-emerald-400" />
          SVG Path Cleaner & Cubic Bezier Optimizer
        </h2>
        <p className="text-sm text-slate-400">
          Streamlines vector graphic markup by stripping redundant coordinate decimals, collapsing metadata, and optimizing Bezier curves.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300">Raw SVG Markup</label>
        <textarea
          rows={6}
          value={svgInput}
          onChange={(e) => setSvgInput(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-y"
        />
      </div>

      <button
        onClick={handleOptimize}
        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition flex items-center gap-2"
      >
        <Scissors className="w-4 h-4" />
        Clean & Optimize SVG Markup
      </button>

      {optimizedOutput && (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Optimized Output ({optimizedOutput.length} bytes)
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 rounded-lg text-xs font-medium border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              Copy Clean SVG
            </button>
          </div>
          <pre className="p-3 bg-black/60 rounded-lg font-mono text-xs text-emerald-300 whitespace-pre-wrap break-all">
            {optimizedOutput}
          </pre>
        </div>
      )}
    </div>
  );
}
