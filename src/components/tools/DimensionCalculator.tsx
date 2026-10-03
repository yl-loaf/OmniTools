import React, { useState, useMemo } from 'react';
import {
  Maximize,
  Maximize2,
  Printer,
  Monitor,
  Video,
  Copy,
  Check,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export const DimensionCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ratio' | 'dpi' | 'bitrate'>('ratio');

  // Aspect Ratio State
  const [ratioW, setRatioW] = useState(16);
  const [ratioH, setRatioH] = useState(9);
  const [inputWidth, setInputWidth] = useState(1920);
  const [inputHeight, setInputHeight] = useState(1080);
  const [lockDimension, setLockDimension] = useState<'width' | 'height'>('width');

  // DPI / Print State
  const [pixelWidth, setPixelWidth] = useState(3840);
  const [pixelHeight, setPixelHeight] = useState(2160);
  const [dpi, setDpi] = useState(300);

  // Video Bitrate State
  const [videoDurationMinutes, setVideoDurationMinutes] = useState(10);
  const [videoBitrateMbps, setVideoBitrateMbps] = useState(20);
  const [audioBitrateKbps, setAudioBitrateKbps] = useState(320);

  const [copied, setCopied] = useState(false);

  // Calculate Aspect Ratio target
  const calculatedHeight = useMemo(() => {
    if (ratioW <= 0) return 0;
    return Math.round((inputWidth * ratioH) / ratioW);
  }, [inputWidth, ratioW, ratioH]);

  const calculatedWidth = useMemo(() => {
    if (ratioH <= 0) return 0;
    return Math.round((inputHeight * ratioW) / ratioH);
  }, [inputHeight, ratioW, ratioH]);

  // DPI to Print Size
  const printSize = useMemo(() => {
    if (dpi <= 0) return { widthInches: 0, heightInches: 0, widthCm: 0, heightCm: 0 };
    const widthInches = Number((pixelWidth / dpi).toFixed(2));
    const heightInches = Number((pixelHeight / dpi).toFixed(2));
    const widthCm = Number((widthInches * 2.54).toFixed(2));
    const heightCm = Number((heightInches * 2.54).toFixed(2));
    return { widthInches, heightInches, widthCm, heightCm };
  }, [pixelWidth, pixelHeight, dpi]);

  // Video file size
  const videoFileSize = useMemo(() => {
    const totalSecs = (videoDurationMinutes || 0) * 60;
    const videoMegabits = totalSecs * (videoBitrateMbps || 0);
    const audioMegabits = (totalSecs * (audioBitrateKbps || 0)) / 1000;
    const totalMegaBytes = (videoMegabits + audioMegabits) / 8;
    const totalGigaBytes = (totalMegaBytes / 1024).toFixed(2);
    return { totalMegaBytes: Math.round(totalMegaBytes), totalGigaBytes };
  }, [videoDurationMinutes, videoBitrateMbps, audioBitrateKbps]);

  const setRatioPreset = (w: number, h: number) => {
    setRatioW(w);
    setRatioH(h);
  };

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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Maximize className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Aspect Ratio & Resolution Dimension Studio</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                Media Toolkit
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Calculate aspect ratios, pixel density print sizing, and video export file estimations.
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('ratio')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'ratio' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Aspect Ratio
          </button>
          <button
            onClick={() => setActiveTab('dpi')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'dpi' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Print & DPI
          </button>
          <button
            onClick={() => setActiveTab('bitrate')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'bitrate' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Video File Size
          </button>
        </div>
      </div>

      {/* 1. Aspect Ratio Tab */}
      {activeTab === 'ratio' && (
        <div className="space-y-4">
          {/* Preset Buttons */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400 mr-2">Presets:</span>
            {[
              { label: '16:9 (HD/4K)', w: 16, h: 9 },
              { label: '4:3 (Classic)', w: 4, h: 3 },
              { label: '1:1 (Square)', w: 1, h: 1 },
              { label: '9:16 (Story/Reel)', w: 9, h: 16 },
              { label: '21:9 (UltraWide)', w: 21, h: 9 },
              { label: '3:2 (Photo)', w: 3, h: 2 },
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => setRatioPreset(p.w, p.h)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                  ratioW === p.w && ratioH === p.h
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Input Parameters */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Dimension Inputs</h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Ratio Width (W)</label>
                  <input
                    type="number"
                    value={ratioW}
                    onChange={(e) => setRatioW(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Ratio Height (H)</label>
                  <input
                    type="number"
                    value={ratioH}
                    onChange={(e) => setRatioH(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs text-slate-400">Desired Pixel Width</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={inputWidth}
                    onChange={(e) => setInputWidth(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-xs text-cyan-300"
                  />
                  <span className="text-xs font-bold text-slate-500 font-mono">px</span>
                </div>
              </div>
            </div>

            {/* Calculated Output Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Calculated Resolution</h3>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center my-4 space-y-1">
                  <div className="text-[11px] text-slate-400">Optimal Proportional Resolution</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {inputWidth} × {calculatedHeight} px
                  </div>
                  <div className="text-xs text-slate-500 font-mono">Ratio: {ratioW}:{ratioH}</div>
                </div>
              </div>

              <button
                onClick={() => handleCopy(`${inputWidth}x${calculatedHeight}`)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-md"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied Resolution!' : 'Copy Resolution (WxH)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Print & DPI Tab */}
      {activeTab === 'dpi' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Pixel Dimensions</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Pixel Width</label>
                <input
                  type="number"
                  value={pixelWidth}
                  onChange={(e) => setPixelWidth(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Pixel Height</label>
                <input
                  type="number"
                  value={pixelHeight}
                  onChange={(e) => setPixelHeight(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-xs text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Print Quality DPI (Dots Per Inch)</label>
              <div className="flex items-center gap-2">
                {[72, 150, 300, 600].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDpi(d)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      dpi === d ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {d} DPI
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Physical Print Size</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase">Print Size (Inches)</div>
                <div className="text-lg font-bold text-cyan-400 font-mono mt-1">
                  {printSize.widthInches}" × {printSize.heightInches}"
                </div>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase">Print Size (Centimeters)</div>
                <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
                  {printSize.widthCm} × {printSize.heightCm} cm
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Video Bitrate Tab */}
      {activeTab === 'bitrate' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Video & Audio Bitrate</h3>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Duration (Minutes)</label>
              <input
                type="number"
                value={videoDurationMinutes}
                onChange={(e) => setVideoDurationMinutes(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Video Bitrate (Mbps)</label>
              <input
                type="number"
                value={videoBitrateMbps}
                onChange={(e) => setVideoBitrateMbps(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Audio Bitrate (Kbps)</label>
              <input
                type="number"
                value={audioBitrateKbps}
                onChange={(e) => setAudioBitrateKbps(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-xs text-white"
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg flex flex-col justify-center">
            <div className="text-center p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Estimated File Size</div>
              <div className="text-3xl font-black text-emerald-400 font-mono">
                {videoFileSize.totalMegaBytes >= 1024
                  ? `${videoFileSize.totalGigaBytes} GB`
                  : `${videoFileSize.totalMegaBytes} MB`}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                ({videoFileSize.totalMegaBytes} MB total)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
