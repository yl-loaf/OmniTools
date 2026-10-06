import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Square, Sliders, Activity, Info, RefreshCw } from 'lucide-react';

export function AudioRoomAnalyzer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [signalType, setSignalType] = useState<'sine' | 'sweep' | 'white' | 'pink'>('sweep');
  const [frequency, setFrequency] = useState(440);
  const [volume, setVolume] = useState(0.2);
  const [sweepStart, setSweepStart] = useState(20);
  const [sweepEnd, setSweepEnd] = useState(20000);
  const [sweepDuration, setSweepDuration] = useState(5);
  const [sweepProgress, setSweepProgress] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const stopAudio = () => {
    if (oscillatorRef.current) {
      try { oscillatorRef.current.stop(); } catch {}
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    if (noiseNodeRef.current) {
      try { (noiseNodeRef.current as any).stop?.(); } catch {}
      noiseNodeRef.current.disconnect();
      noiseNodeRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsPlaying(false);
    setSweepProgress(0);
  };

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const startAudio = () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.connect(ctx.destination);
      gainNodeRef.current = gain;

      if (signalType === 'sine') {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        osc.connect(gain);
        osc.start();
        oscillatorRef.current = osc;
        setIsPlaying(true);
      } else if (signalType === 'sweep') {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(sweepStart, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(sweepEnd, ctx.currentTime + sweepDuration);
        osc.connect(gain);
        osc.start();
        oscillatorRef.current = osc;
        setIsPlaying(true);

        const startTime = performance.now();
        const updateProgress = () => {
          const elapsed = (performance.now() - startTime) / 1000;
          const prog = Math.min(100, (elapsed / sweepDuration) * 100);
          setSweepProgress(prog);
          if (elapsed < sweepDuration) {
            animationFrameRef.current = requestAnimationFrame(updateProgress);
          } else {
            stopAudio();
          }
        };
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      } else if (signalType === 'white' || signalType === 'pink') {
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (signalType === 'white') {
            data[i] = white * 0.5;
          } else {
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
            b6 = white * 0.115926;
          }
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        noise.connect(gain);
        noise.start();
        noiseNodeRef.current = noise;
        setIsPlaying(true);
      }
    } catch (e) {
      console.error(e);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  useEffect(() => {
    if (oscillatorRef.current && audioCtxRef.current && signalType === 'sine') {
      oscillatorRef.current.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);
    }
  }, [frequency]);

  const acousticModes = [
    { mode: 'Axial (Length)', freq: '34.4 Hz', description: 'Typical for rooms ~5 meters long. Often causes boomy bass nodes.' },
    { mode: 'Axial (Width)', freq: '48.6 Hz', description: 'Typical for rooms ~3.5 meters wide. Check speaker symmetry.' },
    { mode: 'Axial (Height)', freq: '57.3 Hz', description: 'Floor-to-ceiling mode (~3m ceiling). Common low-mid buildup.' },
    { mode: 'Tangential', freq: '74.2 Hz', description: 'Diagonal wall reflections interacting with corners.' },
    { mode: 'First Null', freq: '115.0 Hz', description: 'Typical SBIR (Speaker Boundary Interference Response) cancellation dip.' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-xl text-white shadow-lg">
              <Activity className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-teal-300 to-cyan-400">
              Audio Frequency Sweep & Room Resonance Analyzer
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Generate precise acoustic test tones, exponential sine sweeps, and calibrated pink noise to identify room modal resonances and speaker phase issues.
          </p>
        </div>
        <button
          onClick={startAudio}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all ${
            isPlaying
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40 animate-pulse'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
          }`}
        >
          {isPlaying ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          {isPlaying ? 'Stop Signal' : 'Start Signal'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-5 bg-slate-950 p-5 rounded-xl border border-slate-800">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" /> Signal Generator Settings
          </h2>

          <div className="space-y-3">
            <label className="text-xs font-medium text-slate-400">Signal Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'sweep', label: 'Sine Sweep' },
                { id: 'sine', label: 'Pure Tone' },
                { id: 'pink', label: 'Pink Noise' },
                { id: 'white', label: 'White Noise' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSignalType(item.id as any);
                    if (isPlaying) stopAudio();
                  }}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all text-center ${
                    signalType === item.id
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 shadow'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {signalType === 'sine' && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Frequency</span>
                <span className="font-mono text-indigo-300">{frequency} Hz</span>
              </div>
              <input
                type="range"
                min="20"
                max="20000"
                step="1"
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
              />
            </div>
          )}

          {signalType === 'sweep' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Sweep Range</span>
                  <span className="font-mono text-indigo-300">{sweepStart} Hz – {sweepEnd} Hz</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={sweepStart}
                    onChange={(e) => setSweepStart(Number(e.target.value))}
                    className="w-1/2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
                    placeholder="Start Hz"
                  />
                  <input
                    type="number"
                    value={sweepEnd}
                    onChange={(e) => setSweepEnd(Number(e.target.value))}
                    className="w-1/2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
                    placeholder="End Hz"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Duration</span>
                  <span className="font-mono text-indigo-300">{sweepDuration}s</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={sweepDuration}
                  onChange={(e) => setSweepDuration(Number(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                />
              </div>

              {isPlaying && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Sweep Progress</span>
                    <span className="font-mono text-emerald-400">{sweepProgress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-75"
                      style={{ width: `${sweepProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Master Volume</span>
              <span className="font-mono text-indigo-300">{(volume * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-teal-400" /> Estimated Room Modal Resonances (Standard 5m x 3.5m x 2.8m Room)
            </h2>
            <div className="space-y-3">
              {acousticModes.map((m, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold text-slate-200">{m.mode}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{m.description}</div>
                  </div>
                  <div className="px-3 py-1 bg-indigo-950 border border-indigo-800/60 rounded-lg font-mono text-indigo-300 text-sm font-semibold shrink-0">
                    {m.freq}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl mt-4 text-xs text-slate-400 space-y-2">
            <span className="font-bold text-slate-300 block">Pro Acoustic Calibration Tip:</span>
            <p>
              Play the <strong>Sine Sweep</strong> while walking around your studio or listening room. Note where bass frequencies balloon (modes) or cancel out (nulls). Adjust monitor placement 20-30cm away from front and side walls to minimize SBIR phase cancellation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
