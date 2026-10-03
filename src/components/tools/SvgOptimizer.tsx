import React, { useState, useMemo } from 'react';
import { Image, Copy, Check, Sparkles, Download, Code, Eye, RefreshCw } from 'lucide-react';

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="200" height="200" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <line x1="12" y1="8" x2="12" y2="12"></line>
  <line x1="12" y1="16" x2="12.01" y2="16"></line>
</svg>`;

export const SvgOptimizer: React.FC = () => {
  const [svgInput, setSvgInput] = useState(SAMPLE_SVG);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Clean / Minify SVG
  const minifiedSvg = useMemo(() => {
    return svgInput
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/>\s+</g, '><') // Remove whitespace between tags
      .trim();
  }, [svgInput]);

  // Data URI Output
  const dataUri = useMemo(() => {
    return `data:image/svg+xml;utf8,${encodeURIComponent(minifiedSvg)}`;
  }, [minifiedSvg]);

  // Original vs Cleaned byte sizes
  const stats = useMemo(() => {
    const originalBytes = new Blob([svgInput]).size;
    const minifiedBytes = new Blob([minifiedSvg]).size;
    const savings = originalBytes > 0 ? (((originalBytes - minifiedBytes) / originalBytes) * 100).toFixed(1) : '0';
    return { originalBytes, minifiedBytes, savings };
  }, [svgInput, minifiedSvg]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([minifiedSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `optimized-vector-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Image className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>SVG Vector Cleaner & Data URI Generator</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800/60 font-semibold">
                {stats.savings}% Saved
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Minify vector paths, preview rendered SVGs, and generate ready-to-use CSS Data URIs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(dataUri, 'uri')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-pink-300 rounded-xl text-xs font-semibold border border-slate-700 transition"
          >
            {copiedKey === 'uri' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Data URI</span>
          </button>
          <button
            onClick={handleDownload}
            className="p-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-semibold transition shadow-md"
            title="Download Clean SVG"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* SVG Code Input & Output */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>SVG Vector Code</span>
            <button onClick={() => setSvgInput(SAMPLE_SVG)} className="text-[11px] text-slate-400 hover:text-pink-400">
              Reset Sample
            </button>
          </div>
          <textarea
            value={svgInput}
            onChange={(e) => setSvgInput(e.target.value)}
            rows={10}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-pink-300 focus:outline-hidden leading-relaxed"
          />

          <div className="space-y-1 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Cleaned / Minified Code</span>
              <button
                onClick={() => handleCopy(minifiedSvg, 'svg')}
                className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
              >
                {copiedKey === 'svg' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'svg' ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 break-all overflow-x-auto">
              {minifiedSvg}
            </pre>
          </div>
        </div>

        {/* Live Vector Preview Canvas */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-pink-400" /> Live Render Preview
            </h3>
            <div
              className="p-8 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center min-h-[220px]"
              dangerouslySetInnerHTML={{ __html: minifiedSvg }}
            />
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Original Size:</span>
              <strong className="text-white font-mono">{stats.originalBytes} B</strong>
            </div>
            <div className="flex justify-between">
              <span>Optimized Size:</span>
              <strong className="text-emerald-400 font-mono">{stats.minifiedBytes} B</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
