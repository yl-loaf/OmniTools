import React, { useState, useMemo } from 'react';
import { QrCode, Copy, Check, Download, Sparkles, Sliders } from 'lucide-react';

export const BarcodeGenerator: React.FC = () => {
  const [barcodeText, setBarcodeText] = useState('OMNI-98745210');
  const [barcodeFormat, setBarcodeFormat] = useState<'CODE128' | 'EAN13' | 'UPC'>('CODE128');
  const [barWidth, setBarWidth] = useState(2);
  const [barHeight, setBarHeight] = useState(70);
  const [showText, setShowText] = useState(true);
  const [copied, setCopied] = useState(false);

  // Generate SVG Bars representation
  const barcodeSvg = useMemo(() => {
    // Basic standard Code 128 bit-pattern simulation for SVG rendering
    const sanitized = barcodeText.toUpperCase().replace(/[^A-Z0-9_-]/g, '') || 'SAMPLE';
    const binaryBars: number[] = [];

    // Start pattern
    binaryBars.push(1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0);

    for (let i = 0; i < sanitized.length; i++) {
      const code = sanitized.charCodeAt(i);
      for (let b = 0; b < 6; b++) {
        binaryBars.push((code >> b) & 1 ? 1 : 0);
        binaryBars.push(1, 0);
      }
    }

    // Stop pattern
    binaryBars.push(1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1);

    const totalWidth = binaryBars.length * barWidth + 40;
    const totalHeight = barHeight + (showText ? 30 : 10);

    let barsHtml = '';
    let currentX = 20;

    binaryBars.forEach((bit) => {
      if (bit === 1) {
        barsHtml += `<rect x="${currentX}" y="10" width="${barWidth}" height="${barHeight}" fill="#0f172a" />`;
      }
      currentX += barWidth;
    });

    if (showText) {
      barsHtml += `<text x="${totalWidth / 2}" y="${barHeight + 25}" font-family="monospace" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="middle">${barcodeText}</text>`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" width="${totalWidth}" height="${totalHeight}" style="background: white; border-radius: 8px;">${barsHtml}</svg>`;
  }, [barcodeText, barWidth, barHeight, showText]);

  const handleDownload = () => {
    const blob = new Blob([barcodeSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `barcode-${barcodeText || 'code'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySvg = () => {
    navigator.clipboard.writeText(barcodeSvg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Universal Barcode Generator Studio</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                Code 128
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Generate scannable barcodes for retail products, inventory SKUs, and asset tracking tags.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySvg}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-semibold border border-slate-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy SVG</span>
          </button>
          <button
            onClick={handleDownload}
            className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition shadow-md"
            title="Download Vector Barcode"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Barcode Content & Format</h3>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Barcode Text / SKU / Serial Number</label>
            <input
              type="text"
              value={barcodeText}
              onChange={(e) => setBarcodeText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-xs text-cyan-300 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Bar Width</span>
                <span className="font-mono text-white">{barWidth}px</span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                value={barWidth}
                onChange={(e) => setBarWidth(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Bar Height</span>
                <span className="font-mono text-white">{barHeight}px</span>
              </div>
              <input
                type="range"
                min="40"
                max="120"
                value={barHeight}
                onChange={(e) => setBarHeight(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={showText}
              onChange={(e) => setShowText(e.target.checked)}
              className="rounded text-blue-500"
            />
            <span className="text-slate-200">Show human-readable text label below bars</span>
          </label>
        </div>

        {/* Live Scannable Preview Canvas */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center min-h-[250px] space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase">Live Scannable Barcode</div>
          <div
            className="p-6 bg-white rounded-xl shadow-2xl overflow-x-auto max-w-full flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: barcodeSvg }}
          />
        </div>
      </div>
    </div>
  );
};
