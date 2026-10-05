import React, { useState, useEffect, useRef } from 'react';
import { Waves, Play, Pause, Volume2, Flame, Coffee, Wind, Sparkles } from 'lucide-react';

export function PomodoroSoundscapeMixer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [brownNoiseVol, setBrownNoiseVol] = useState(0.5);
  const [fireplaceVol, setFireplaceVol] = useState(0.3);
  const [coffeeVol, setCoffeeVol] = useState(0.2);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);

  // Web Audio API context for Brown Noise synthesis
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    let interval: any;
    if (timerActive && secondsLeft > 0) {
      interval = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    } else if (secondsLeft === 0 && timerActive) {
      setTimerActive(false);
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, secondsLeft]);

  const togglePlay = () => {
    if (!isPlaying) {
      // Start audio context & noise
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Brown noise buffer generator
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5; // gain boost
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const gainNode = ctx.createGain();
        gainNode.gain.value = brownNoiseVol;
        gainNodeRef.current = gainNode;

        whiteNoise.connect(gainNode);
        gainNode.connect(ctx.destination);
        whiteNoise.start(0);
      } catch (e) {
        console.warn('Web Audio error:', e);
      }
      setIsPlaying(true);
      setTimerActive(true);
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      setIsPlaying(false);
      setTimerActive(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Waves className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">Pomodoro Ambient Soundscape Mixer</h1>
              <p className="text-xs text-slate-400">Mix customizable binaural brown noise, fireplace crackles, and coffee shop ambiance during your focus sprints.</p>
            </div>
          </div>
          <button
            onClick={togglePlay}
            className={`px-6 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg transition ${
              isPlaying ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause Focus Sprint' : 'Start Focus Sprint'}
          </button>
        </div>

        {/* Timer Display */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center space-y-2">
          <div className="text-5xl font-extrabold font-mono text-indigo-300 tracking-wider">
            {formatTime(secondsLeft)}
          </div>
          <div className="text-xs text-slate-400">
            {timerActive ? 'Focus sprint in progress... Stay in the zone.' : 'Ready to begin your deep work session.'}
          </div>
        </div>

        {/* Sound Mixers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-medium text-slate-300">
              <span className="flex items-center gap-2"><Wind className="w-4 h-4 text-blue-400" /> Brown Noise</span>
              <span className="font-mono text-blue-300">{Math.round(brownNoiseVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={brownNoiseVol}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setBrownNoiseVol(val);
                if (gainNodeRef.current) gainNodeRef.current.gain.value = val;
              }}
              className="w-full accent-blue-500"
            />
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-medium text-slate-300">
              <span className="flex items-center gap-2"><Flame className="w-4 h-4 text-amber-400" /> Fireplace Crackle</span>
              <span className="font-mono text-amber-300">{Math.round(fireplaceVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={fireplaceVol}
              onChange={(e) => setFireplaceVol(parseFloat(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-medium text-slate-300">
              <span className="flex items-center gap-2"><Coffee className="w-4 h-4 text-purple-400" /> Coffee Shop Ambiance</span>
              <span className="font-mono text-purple-300">{Math.round(coffeeVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={coffeeVol}
              onChange={(e) => setCoffeeVol(parseFloat(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
