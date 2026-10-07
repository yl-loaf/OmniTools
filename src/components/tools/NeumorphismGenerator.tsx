import React, { useState } from 'react';
import { Palette, Copy, Check, Sparkles, Sliders } from 'lucide-react';

export const NeumorphismGenerator: React.FC = () => {
  const [bgColor, setBgColor] = useState<string>('#e0e5ec');
  const [distance, setDistance] = useState<number>(20);
  const [blur, setBlur] = useState<number>(60);
  const [intensity, setIntensity] = useState<number>(15);
  const [shape, setShape] = useState<'flat' | 'convex' | 'concave' | 'pressed'>('flat');
  const [borderRadius, setBorderRadius] = useState<number>(30);
  const [copied, setCopied] = useState<boolean>(false);

  // Helper to calculate lighter and darker shadow colors
  const hexToRgb = (hex: string) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return [num >> 16, (num >> 8) & 255, num & 255];
  };

  const [r, g, b] = hexToRgb(bgColor);
  const factor = intensity / 100;
  
  const lightR = Math.min(255, Math.floor(r + (255 - r) * (factor * 1.5)));
  const lightG = Math.min(255, Math.floor(g + (255 - g) * (factor * 1.5)));
  const lightB = Math.min(255, Math.floor(b + (255 - b) * (factor * 1.5)));

  const darkR = Math.max(0, Math.floor(r * (1 - factor)));
  const darkG = Math.max(0, Math.floor(g * (1 - factor)));
  const darkB = Math.max(0, Math.floor(b * (1 - factor)));

  const lightColor = `rgba(${lightR}, ${lightG}, ${lightB}, 0.9)`;
  const darkColor = `rgba(${darkR}, ${darkG}, ${darkB}, 0.7)`;

  let boxShadowStyle = `${distance}px ${distance}px ${blur}px ${darkColor}, -${distance}px -${distance}px ${blur}px ${lightColor}`;
  if (shape === 'pressed') {
    boxShadowStyle = `inset ${distance}px ${distance}px ${blur}px ${darkColor}, inset -${distance}px -${distance}px ${blur}px ${lightColor}`;
  } else if (shape === 'convex') {
    boxShadowStyle = `${distance}px ${distance}px ${blur}px ${darkColor}, -${distance}px -${distance}px ${blur}px ${lightColor}, inset 1px 1px 2px rgba(255,255,255,0.4)`;
  } else if (shape === 'concave') {
    boxShadowStyle = `${distance}px ${distance}px ${blur}px ${darkColor}, -${distance}px -${distance}px ${blur}px ${lightColor}, inset -1px -1px 2px rgba(0,0,0,0.1)`;
  }

  const cssCode = `background: ${bgColor};
border-radius: ${borderRadius}px;
box-shadow: ${boxShadowStyle};`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-pink-400" />
              <h1 className="text-2xl font-bold text-slate-100">Aesthetic Neumorphism & Soft UI CSS Generator</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Visually configure tactile soft-UI shadows, bevel depths, and background tones in real time.
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-pink-600/20"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied CSS!' : 'Copy CSS Code'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Controls */}
          <div className="space-y-5 bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-pink-400" /> Shadow Properties
            </h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Background Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg bg-transparent cursor-pointer border border-slate-700"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 uppercase"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Distance: {distance}px</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full accent-pink-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Blur Radius: {blur}px</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full accent-pink-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Intensity: {intensity}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full accent-pink-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Border Radius: {borderRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={borderRadius}
                onChange={(e) => setBorderRadius(Number(e.target.value))}
                className="w-full accent-pink-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-2">Element Effect</label>
              <div className="grid grid-cols-2 gap-2">
                {(['flat', 'convex', 'concave', 'pressed'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setShape(s)}
                    className={`py-2 text-xs font-medium rounded-lg capitalize transition ${
                      shape === s
                        ? 'bg-pink-600 text-white shadow'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview & Code */}
          <div className="lg:col-span-2 flex flex-col justify-between space-y-6">
            <div
              className="flex-1 min-h-[300px] rounded-2xl flex items-center justify-center p-8 transition-all duration-300 relative border border-slate-800/40"
              style={{ backgroundColor: bgColor }}
            >
              <div
                className="w-48 h-48 rounded-3xl flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: bgColor,
                  borderRadius: `${borderRadius}px`,
                  boxShadow: boxShadowStyle,
                }}
              >
                <span className="text-sm font-semibold" style={{ color: lightR > 150 ? '#333' : '#eee' }}>
                  Soft UI Card
                </span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Generated CSS</div>
              <pre className="text-xs text-pink-300 font-mono overflow-x-auto p-3 bg-slate-900 rounded-lg">
                {cssCode}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
