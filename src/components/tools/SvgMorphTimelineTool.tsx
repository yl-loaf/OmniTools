import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Copy, Check, Layers } from 'lucide-react';
import { playSuccessSound } from '../../services/soundEffects';

export function SvgMorphTimelineTool() {
  const [pathStart, setPathStart] = useState('M10 80 Q 52.5 10, 95 80 T 180 80');
  const [pathEnd, setPathEnd] = useState('M10 20 Q 52.5 120, 95 20 T 180 20');
  const [duration, setDuration] = useState(3);
  const [isPlaying, setIsPlaying] = useState(true);
  const [copied, setCopied] = useState(false);

  const smilCode = `<svg viewBox="0 0 200 150" width="100%" height="200" className="bg-slate-950 rounded-xl">
  <path fill="none" stroke="#3b82f6" strokeWidth="4" d="${pathStart}">
    <animate attributeName="d" values="${pathStart}; ${pathEnd}; ${pathStart}" dur="${duration}s" repeatCount="indefinite" />
  </path>
</svg>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(smilCode);
    setCopied(true);
    playSuccessSound();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Layers className="w-6 h-6 text-pink-400" />
          SVG Path Morph & Animation Timeline
        </h2>
        <p className="text-sm text-slate-400">
          Visually sequence vector path transitions and export lightweight SMIL / CSS keyframe animation snippets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Start Path Data (d)</label>
          <input
            type="text"
            value={pathStart}
            onChange={(e) => setPathStart(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-xs text-slate-200 focus:outline-none focus:border-pink-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">End Path Data (d)</label>
          <input
            type="text"
            value={pathEnd}
            onChange={(e) => setPathEnd(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-xs text-slate-200 focus:outline-none focus:border-pink-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 flex-1">
          <label className="text-xs font-semibold text-slate-400">Duration ({duration}s):</label>
          <input
            type="range"
            min={1}
            max={10}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="flex-1 accent-pink-500 cursor-pointer"
          />
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? 'Pause Preview' : 'Play Preview'}
        </button>
      </div>

      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex items-center justify-center">
        <svg viewBox="0 0 200 150" className="w-64 h-48 bg-slate-900 rounded-xl border border-slate-800">
          <path
            fill="none"
            stroke="#ec4899"
            strokeWidth="4"
            d={pathStart}
          />
        </svg>
      </div>

      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-pink-400" />
            SMIL Animation Code
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 rounded-lg text-xs font-medium border border-slate-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            Copy Snippet
          </button>
        </div>
        <pre className="p-3 bg-black/60 rounded-lg font-mono text-xs text-pink-300 overflow-x-auto whitespace-pre-wrap">
          {smilCode}
        </pre>
      </div>
    </div>
  );
}
