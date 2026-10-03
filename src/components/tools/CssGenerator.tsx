import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Layers,
  Square,
  Scissors,
  Sliders,
  Sun
} from 'lucide-react';

export const CssGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'glass' | 'shadow' | 'clip'>('glass');
  const [copied, setCopied] = useState(false);

  // Glassmorphism state
  const [glassBlur, setGlassBlur] = useState(16);
  const [glassOpacity, setGlassOpacity] = useState(25);
  const [glassBorderOpacity, setGlassBorderOpacity] = useState(20);
  const [glassColor, setGlassColor] = useState('#ffffff');

  // Box Shadow state
  const [shadowX, setShadowX] = useState(0);
  const [shadowY, setShadowY] = useState(20);
  const [shadowBlur, setShadowBlur] = useState(30);
  const [shadowSpread, setShadowSpread] = useState(0);
  const [shadowColor, setShadowColor] = useState('rgba(0, 0, 0, 0.5)');
  const [isInset, setIsInset] = useState(false);

  // Clip Path state
  const [clipShape, setClipShape] = useState<string>('polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)');

  // Compute CSS
  const glassCss = `background: ${glassColor}${Math.round((glassOpacity / 100) * 255).toString(16).padStart(2, '0')};
backdrop-filter: blur(${glassBlur}px);
-webkit-backdrop-filter: blur(${glassBlur}px);
border: 1px solid rgba(255, 255, 255, ${glassBorderOpacity / 100});
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);`;

  const shadowCss = `box-shadow: ${isInset ? 'inset ' : ''}${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor};`;

  const clipCss = `clip-path: ${clipShape};
-webkit-clip-path: ${clipShape};`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>CSS Glassmorphism & Shadow Studio</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-semibold">
                Modern CSS3
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive visual generators for glass UI, layered box shadows, and geometric clip-paths.
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('glass')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'glass' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Glassmorphism
          </button>
          <button
            onClick={() => setActiveTab('shadow')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'shadow' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Box Shadow
          </button>
          <button
            onClick={() => setActiveTab('clip')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'clip' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Clip Path
          </button>
        </div>
      </div>

      {/* 1. Glassmorphism Tab */}
      {activeTab === 'glass' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Glass Controls</h3>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Blur Intensity</span>
                <span className="font-mono text-white">{glassBlur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={glassBlur}
                onChange={(e) => setGlassBlur(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Background Opacity</span>
                <span className="font-mono text-white">{glassOpacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={glassOpacity}
                onChange={(e) => setGlassOpacity(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Border Highlight Opacity</span>
                <span className="font-mono text-white">{glassBorderOpacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={glassBorderOpacity}
                onChange={(e) => setGlassBorderOpacity(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Generated CSS Code</span>
                <button
                  onClick={() => handleCopy(glassCss)}
                  className="flex items-center gap-1 text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-lg font-semibold transition"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy CSS'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto">
                {glassCss}
              </pre>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="relative rounded-2xl overflow-hidden p-8 flex items-center justify-center min-h-[350px] bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 shadow-xl">
            {/* Background floating gradient orbs */}
            <div className="absolute w-40 h-40 rounded-full bg-cyan-400 blur-2xl opacity-60 -top-10 -left-10 animate-pulse" />
            <div className="absolute w-48 h-48 rounded-full bg-pink-500 blur-3xl opacity-60 -bottom-10 -right-10" />

            {/* Live Glass Element */}
            <div
              className="relative z-10 w-full max-w-sm rounded-2xl p-6 text-white text-center space-y-3"
              style={{
                background: `${glassColor}${Math.round((glassOpacity / 100) * 255).toString(16).padStart(2, '0')}`,
                backdropFilter: `blur(${glassBlur}px)`,
                WebkitBackdropFilter: `blur(${glassBlur}px)`,
                border: `1px solid rgba(255, 255, 255, ${glassBorderOpacity / 100})`,
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
              }}
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white drop-shadow" />
              </div>
              <h4 className="font-extrabold text-base tracking-tight">Frosted Glass UI Card</h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Smooth multi-layer blur with translucent reflection borders.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Box Shadow Tab */}
      {activeTab === 'shadow' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Shadow Parameters</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Horizontal (X)</span>
                  <span className="font-mono text-white">{shadowX}px</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={shadowX}
                  onChange={(e) => setShadowX(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Vertical (Y)</span>
                  <span className="font-mono text-white">{shadowY}px</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={shadowY}
                  onChange={(e) => setShadowY(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Blur Radius</span>
                  <span className="font-mono text-white">{shadowBlur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={shadowBlur}
                  onChange={(e) => setShadowBlur(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Spread Radius</span>
                  <span className="font-mono text-white">{shadowSpread}px</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="50"
                  value={shadowSpread}
                  onChange={(e) => setShadowSpread(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={isInset}
                onChange={(e) => setIsInset(e.target.checked)}
                className="rounded text-indigo-500"
              />
              <span className="text-slate-200 font-semibold">Inset Shadow Mode</span>
            </label>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Generated CSS</span>
                <button
                  onClick={() => handleCopy(shadowCss)}
                  className="flex items-center gap-1 text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-lg font-semibold transition"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy CSS'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300">
                {shadowCss}
              </pre>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 flex items-center justify-center min-h-[350px]">
            <div
              className="w-48 h-48 bg-slate-900 border border-slate-700/60 rounded-2xl flex flex-col items-center justify-center p-4 text-center transition"
              style={{
                boxShadow: `${isInset ? 'inset ' : ''}${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor}`,
              }}
            >
              <Square className="w-8 h-8 text-indigo-400 mb-2" />
              <div className="text-xs font-bold text-white">Shadow Target</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Clip Path Tab */}
      {activeTab === 'clip' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Geometric Shapes</h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { name: 'Pentagon', value: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' },
                { name: 'Hexagon', value: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' },
                { name: 'Octagon', value: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' },
                { name: 'Star', value: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' },
                { name: 'Arrow Right', value: 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)' },
                { name: 'Message Bubble', value: 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)' },
                { name: 'Rhombus', value: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' },
                { name: 'Circle', value: 'circle(50% at 50% 50%)' },
              ].map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setClipShape(s.value)}
                  className={`p-2.5 rounded-xl border text-left font-semibold transition ${
                    clipShape === s.value
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Generated CSS</span>
                <button
                  onClick={() => handleCopy(clipCss)}
                  className="flex items-center gap-1 text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-lg font-semibold transition"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy CSS'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300 break-all">
                {clipCss}
              </pre>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 flex items-center justify-center min-h-[350px]">
            <div
              className="w-56 h-56 bg-gradient-to-tr from-cyan-400 via-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-2xl transition-all duration-300"
              style={{
                clipPath: clipShape,
                WebkitClipPath: clipShape,
              }}
            >
              Clipped Shape
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
