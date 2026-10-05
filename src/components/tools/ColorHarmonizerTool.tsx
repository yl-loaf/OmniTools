import React, { useState } from 'react';
import { Palette, Copy, Check, Sparkles, Sliders, ShieldCheck } from 'lucide-react';
import { playClickSound, playSuccessSound } from '../../services/soundEffects';

export function ColorHarmonizerTool() {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Helper to convert hex to rgb
  const hexToRgb = (hex: string) => {
    let cleaned = hex.replace('#', '');
    if (cleaned.length === 3) {
      cleaned = cleaned.split('').map(c => c + c).join('');
    }
    const num = parseInt(cleaned, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const clamped = Math.max(0, Math.min(255, Math.round(x)));
      return clamped.toString(16).padStart(2, '0');
    }).join('');
  };

  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const getContrastRatio = (rgb1: {r:number, g:number, b:number}, rgb2: {r:number, g:number, b:number}) => {
    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  };

  const baseRgb = hexToRgb(baseColor);

  // Generate harmonies
  const generateHarmonies = () => {
    // Simple hue shift in RGB space approximation or generate variants
    const { r, g, b } = baseRgb;
    const compHex = rgbToHex(255 - r, 255 - g, 255 - b);
    const lighterHex = rgbToHex(Math.min(255, r + 50), Math.min(255, g + 50), Math.min(255, b + 50));
    const darkerHex = rgbToHex(Math.max(0, r - 50), Math.max(0, g - 50), Math.max(0, b - 50));
    const analog1 = rgbToHex(r, Math.min(255, g + 60), Math.max(0, b - 40));
    const analog2 = rgbToHex(Math.min(255, r + 40), g, Math.min(255, b + 60));
    const triadic1 = rgbToHex(b, r, g);
    const triadic2 = rgbToHex(g, b, r);

    return [
      { name: 'Base Color', hex: baseColor },
      { name: 'Complementary', hex: compHex },
      { name: 'Analogous A', hex: analog1 },
      { name: 'Analogous B', hex: analog2 },
      { name: 'Triadic A', hex: triadic1 },
      { name: 'Triadic B', hex: triadic2 },
      { name: 'Tint Light', hex: lighterHex },
      { name: 'Shade Dark', hex: darkerHex },
    ];
  };

  const palette = generateHarmonies();

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    playSuccessSound();
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const whiteRgb = { r: 255, g: 255, b: 255 };
  const blackRgb = { r: 15, g: 23, b: 42 };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Palette className="w-6 h-6 text-indigo-400" />
            Aesthetic Color Palette Harmonizer & Contrast Matrix
          </h2>
          <p className="text-sm text-slate-400">
            Generate cohesive color theory harmonies and test WCAG contrast ratios across multiple background layers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-slate-300">Base Color:</label>
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
            />
            <span className="font-mono text-sm uppercase">{baseColor}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {palette.map((item, idx) => {
          const itemRgb = hexToRgb(item.hex);
          const contrastWhite = getContrastRatio(itemRgb, whiteRgb).toFixed(1);
          const contrastBlack = getContrastRatio(itemRgb, blackRgb).toFixed(1);
          const isWcagAa = Number(contrastWhite) >= 4.5 || Number(contrastBlack) >= 4.5;
          const isWcagAaa = Number(contrastWhite) >= 7.0 || Number(contrastBlack) >= 7.0;

          return (
            <div key={idx} className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
              <div
                className="h-28 w-full flex items-end justify-end p-2 transition-transform hover:scale-[1.02]"
                style={{ backgroundColor: item.hex }}
              >
                <button
                  onClick={() => handleCopy(item.hex)}
                  className="bg-slate-900/80 backdrop-blur text-white p-1.5 rounded-lg hover:bg-slate-900 transition flex items-center gap-1 text-xs font-mono"
                  title="Copy Hex"
                >
                  {copiedHex === item.hex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {item.hex.toUpperCase()}
                </button>
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="text-xs font-semibold text-slate-300">{item.name}</div>
                  <div className="text-[11px] font-mono text-slate-400">{item.hex}</div>
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-900 text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>vs White (255):</span>
                    <span className="font-mono font-bold text-slate-200">{contrastWhite}:1</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>vs Dark (15):</span>
                    <span className="font-mono font-bold text-slate-200">{contrastBlack}:1</span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <ShieldCheck className={`w-3.5 h-3.5 ${isWcagAaa ? 'text-emerald-400' : isWcagAa ? 'text-blue-400' : 'text-amber-400'}`} />
                    <span className="text-[10px] text-slate-300 font-medium">
                      {isWcagAaa ? 'WCAG AAA Compliant' : isWcagAa ? 'WCAG AA Compliant' : 'Low Contrast'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          CSS Custom Properties Export
        </h3>
        <pre className="p-3 bg-black/60 rounded-lg font-mono text-xs text-indigo-300 overflow-x-auto">
{`:root {
${palette.map((p, i) => `  --color-${p.name.toLowerCase().replace(/\\s+/g, '-')}: ${p.hex};`).join('\n')}
}`}
        </pre>
      </div>
    </div>
  );
}
