import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Zap, Sparkles, Clock } from 'lucide-react';

export const PrecisionTimerTool: React.FC = () => {
  const [totalSeconds, setTotalSeconds] = useState(60); // default 1 min
  const [customInput, setCustomInput] = useState('60');
  const [remainingMs, setRemainingMs] = useState(60000);
  const [isRunning, setIsRunning] = useState(false);
  const [decimals, setDecimals] = useState(6);

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const totalMs = totalSeconds * 1000;
  const elapsedMs = Math.max(0, totalMs - remainingMs);
  const rawPercentage = totalMs > 0 ? (elapsedMs / totalMs) * 100 : 0;
  const clampedPercentage = Math.min(100, Math.max(0, rawPercentage));

  const animate = (time: number) => {
    if (lastTimeRef.current !== null) {
      const delta = time - lastTimeRef.current;
      setRemainingMs((prev) => {
        const next = prev - delta;
        if (next <= 0) {
          setIsRunning(false);
          return 0;
        }
        return next;
      });
    }
    lastTimeRef.current = time;
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (isRunning) {
      lastTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      lastTimeRef.current = null;
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    if (remainingMs <= 0) {
      setRemainingMs(totalMs);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingMs(totalSeconds * 1000);
  };

  const handleSetPreset = (secs: number) => {
    setIsRunning(false);
    setTotalSeconds(secs);
    setCustomInput(String(secs));
    setRemainingMs(secs * 1000);
  };

  const handleCustomTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const secs = parseFloat(customInput);
    if (!isNaN(secs) && secs > 0) {
      setIsRunning(false);
      setTotalSeconds(secs);
      setRemainingMs(secs * 1000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/20">
            <Timer className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">High-Precision Percentage Timer</h2>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                10+ Ticks / Sec
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Timer with custom duration support and a high-precision percentage progress bar ticking smoothly.
            </p>
          </div>
        </div>
      </div>

      {/* Main Timer Console */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Presets & Custom Time Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Presets:</div>
            <div className="flex items-center gap-2 flex-wrap">
              {[10, 30, 60, 300, 1500].map((secs) => (
                <button
                  key={secs}
                  onClick={() => handleSetPreset(secs)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition border ${
                    totalSeconds === secs
                      ? 'bg-cyan-600 text-white border-cyan-500'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {secs >= 60 ? `${secs / 60}m` : `${secs}s`}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleCustomTimeSubmit} className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Set Custom Duration (Seconds):</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="e.g. 45"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-bold transition border border-slate-700"
              >
                Set Time
              </button>
            </div>
          </form>
        </div>

        {/* Big Percentage Display with Dynamic Decimals */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400 animate-pulse" />
            <span>Completion Percentage</span>
          </div>

          <div className="text-4xl sm:text-6xl lg:text-7xl font-mono font-black text-white tracking-tight">
            {clampedPercentage.toFixed(decimals)}
            <span className="text-cyan-400 text-2xl sm:text-4xl ml-1">%</span>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Time Remaining: <strong className="text-white">{(remainingMs / 1000).toFixed(2)}s</strong> / {totalSeconds}s
          </div>

          {/* Smooth Percentage Progress Bar */}
          <div className="w-full bg-slate-900 rounded-full h-4 overflow-hidden border border-slate-800 p-0.5 mt-4">
            <div
              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-full rounded-full transition-all duration-75"
              style={{ width: `${clampedPercentage}%` }}
            />
          </div>
        </div>

        {/* Controls & Decimal Precision Slider */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={handleStartPause}
              className={`flex-1 py-3 px-6 rounded-2xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 shadow-lg ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/30'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'Pause Timer' : 'Start Timer'}</span>
            </button>

            <button
              onClick={handleReset}
              className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">Decimal Precision:</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="2"
                max="8"
                value={decimals}
                onChange={(e) => setDecimals(parseInt(e.target.value))}
                className="accent-cyan-500 w-28"
              />
              <span className="text-xs font-mono font-bold text-cyan-400 w-6 text-right">.{decimals}d</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
