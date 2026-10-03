import React, { useState, useMemo } from 'react';
import {
  Palette,
  Copy,
  Check,
  Sparkles,
  Sliders,
  Sun,
  Eye,
  Layers,
  Shuffle
} from 'lucide-react';

// Color conversion helpers
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    return { r, g, b };
  }
  if (cleaned.length === 6) {
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  h = (h % 360 + 360) % 360;
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

// Relative luminance for contrast
function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 1;
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (lightest + 0.05) / (darkest + 0.05);
}

export const ColorStudio: React.FC = () => {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [textColor, setTextColor] = useState('#ffffff');
  const [gradientColor2, setGradientColor2] = useState('#8b5cf6');
  const [gradientAngle, setGradientAngle] = useState(135);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const rgb = useMemo(() => hexToRgb(baseColor) || { r: 59, g: 130, b: 246 }, [baseColor]);
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);

  // Color Harmonies
  const harmonies = useMemo(() => {
    const { h, s, l } = hsl;
    return {
      complementary: [baseColor, hslToHex(h + 180, s, l)],
      analogous: [hslToHex(h - 30, s, l), baseColor, hslToHex(h + 30, s, l)],
      triadic: [baseColor, hslToHex(h + 120, s, l), hslToHex(h + 240, s, l)],
      splitComplementary: [baseColor, hslToHex(h + 150, s, l), hslToHex(h + 210, s, l)],
      monochromatic: [
        hslToHex(h, s, Math.max(15, l - 30)),
        hslToHex(h, s, Math.max(25, l - 15)),
        baseColor,
        hslToHex(h, s, Math.min(85, l + 15)),
        hslToHex(h, s, Math.min(95, l + 30)),
      ],
    };
  }, [baseColor, hsl]);

  // Contrast checking
  const contrastRatio = useMemo(() => {
    return Number(getContrastRatio(baseColor, textColor).toFixed(2));
  }, [baseColor, textColor]);

  const wcagResults = useMemo(() => {
    return {
      aaNormal: contrastRatio >= 4.5,
      aaLarge: contrastRatio >= 3.0,
      aaaNormal: contrastRatio >= 7.0,
      aaaLarge: contrastRatio >= 4.5,
    };
  }, [contrastRatio]);

  const gradientCss = `linear-gradient(${gradientAngle}deg, ${baseColor}, ${gradientColor2})`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRandomize = () => {
    const randomHex = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    const randomHex2 = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    setBaseColor(randomHex);
    setGradientColor2(randomHex2);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Color Harmony & Contrast Studio</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60 font-semibold">
                WCAG 2.1
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Generate balanced color palettes, check accessibility contrast ratios, and build CSS gradients.
            </p>
          </div>
        </div>

        <button
          onClick={handleRandomize}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
        >
          <Shuffle className="w-3.5 h-3.5 text-purple-400" />
          <span>Randomize</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Section 1: Color Picker & Formats */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-blue-400" /> Base Color & Codes
          </h3>

          <div className="flex items-center gap-3">
            <input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="w-16 h-16 rounded-xl cursor-pointer border-2 border-slate-700 bg-transparent"
            />
            <div className="flex-1 space-y-1">
              <label className="text-[11px] text-slate-400 font-medium">HEX Value</label>
              <input
                type="text"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="text-slate-400 font-mono">RGB:</span>
              <span className="text-white font-mono">{rgb.r}, {rgb.g}, {rgb.b}</span>
              <button
                onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}
                className="text-slate-400 hover:text-white"
              >
                {copiedKey === 'rgb' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="text-slate-400 font-mono">HSL:</span>
              <span className="text-white font-mono">{hsl.h}°, {hsl.s}%, {hsl.l}%</span>
              <button
                onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}
                className="text-slate-400 hover:text-white"
              >
                {copiedKey === 'hsl' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: WCAG Accessibility Checker */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-400" /> WCAG Contrast Checker
          </h3>

          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-[11px] text-slate-400">Foreground Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-700 bg-transparent"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-white"
                />
              </div>
            </div>
          </div>

          {/* Live Preview Pill */}
          <div
            className="p-4 rounded-xl text-center font-bold text-sm shadow-inner transition border border-white/10"
            style={{ backgroundColor: baseColor, color: textColor }}
          >
            The quick brown fox jumps over the lazy dog.
          </div>

          {/* Ratio Score Card */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase">Contrast Ratio</div>
              <div className="text-lg font-extrabold text-amber-400 font-mono mt-0.5">{contrastRatio} : 1</div>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-center flex flex-col justify-center">
              <div className="text-[10px] text-slate-400 uppercase">WCAG AA Rating</div>
              <div className={`text-xs font-bold mt-0.5 ${wcagResults.aaNormal ? 'text-emerald-400' : 'text-rose-400'}`}>
                {wcagResults.aaNormal ? 'PASSED (AA)' : 'FAIL (< 4.5:1)'}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: CSS Gradient Studio */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-pink-400" /> CSS Gradient Generator
          </h3>

          <div
            className="h-20 rounded-xl border border-white/10 shadow-inner flex items-center justify-center text-white text-xs font-bold drop-shadow-md"
            style={{ background: gradientCss }}
          >
            Live Gradient Preview
          </div>

          <div className="grid grid-cols-2 gap-2 items-center">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400">Stop 2 Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={gradientColor2}
                  onChange={(e) => setGradientColor2(e.target.value)}
                  className="w-7 h-7 rounded-lg cursor-pointer border border-slate-700 bg-transparent"
                />
                <input
                  type="text"
                  value={gradientColor2}
                  onChange={(e) => setGradientColor2(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-mono text-white"
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Angle</span>
                <span className="font-mono text-white">{gradientAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={gradientAngle}
                onChange={(e) => setGradientAngle(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>
          </div>

          <button
            onClick={() => handleCopy(`background: ${gradientCss};`, 'grad')}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center justify-center gap-1.5"
          >
            {copiedKey === 'grad' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-pink-400" />}
            <span>{copiedKey === 'grad' ? 'Gradient CSS Copied!' : 'Copy Gradient CSS'}</span>
          </button>
        </div>
      </div>

      {/* Color Harmonies Palettes */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-400" /> Harmonic Color Palettes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Complementary */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-400">Complementary</div>
            <div className="flex h-12 rounded-xl overflow-hidden border border-slate-700">
              {harmonies.complementary.map((col, idx) => (
                <button
                  key={idx}
                  onClick={() => setBaseColor(col)}
                  className="flex-1 transition hover:opacity-90 relative group"
                  style={{ backgroundColor: col }}
                  title={`Click to use: ${col}`}
                />
              ))}
            </div>
          </div>

          {/* Analogous */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-400">Analogous</div>
            <div className="flex h-12 rounded-xl overflow-hidden border border-slate-700">
              {harmonies.analogous.map((col, idx) => (
                <button
                  key={idx}
                  onClick={() => setBaseColor(col)}
                  className="flex-1 transition hover:opacity-90"
                  style={{ backgroundColor: col }}
                  title={`Click to use: ${col}`}
                />
              ))}
            </div>
          </div>

          {/* Triadic */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-400">Triadic</div>
            <div className="flex h-12 rounded-xl overflow-hidden border border-slate-700">
              {harmonies.triadic.map((col, idx) => (
                <button
                  key={idx}
                  onClick={() => setBaseColor(col)}
                  className="flex-1 transition hover:opacity-90"
                  style={{ backgroundColor: col }}
                  title={`Click to use: ${col}`}
                />
              ))}
            </div>
          </div>

          {/* Monochromatic */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-400">Monochromatic Tints</div>
            <div className="flex h-12 rounded-xl overflow-hidden border border-slate-700">
              {harmonies.monochromatic.map((col, idx) => (
                <button
                  key={idx}
                  onClick={() => setBaseColor(col)}
                  className="flex-1 transition hover:opacity-90"
                  style={{ backgroundColor: col }}
                  title={`Click to use: ${col}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
