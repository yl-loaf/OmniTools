import React, { useState } from 'react';
import { Volume2, Play, Square, Music, Sparkles } from 'lucide-react';
import { playSuccessSound } from '../../services/soundEffects';

export function ChiptuneSynthTool() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveType, setWaveType] = useState<OscillatorType>('square');
  const [tempo, setTempo] = useState(120);

  const playNote = (freq: number) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = waveType;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
      playSuccessSound();
    } catch (e) {
      console.warn('Audio error:', e);
    }
  };

  const notes = [
    { name: 'C4', freq: 261.63 },
    { name: 'D4', freq: 293.66 },
    { name: 'E4', freq: 329.63 },
    { name: 'F4', freq: 349.23 },
    { name: 'G4', freq: 392.00 },
    { name: 'A4', freq: 440.00 },
    { name: 'B4', freq: 493.88 },
    { name: 'C5', freq: 523.25 },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Music className="w-6 h-6 text-yellow-400" />
          Retro Arcade Chiptune Synth Studio
        </h2>
        <p className="text-sm text-slate-400">
          Compose classic 8-bit chiptune melodies using pulse, triangle, and square waveforms with Web Audio API.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400">Waveform</label>
          <select
            value={waveType}
            onChange={(e) => setWaveType(e.target.value as OscillatorType)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200"
          >
            <option value="square">Square (Classic 8-bit)</option>
            <option value="triangle">Triangle (Sub-Bass)</option>
            <option value="sawtooth">Sawtooth (Lead)</option>
            <option value="sine">Sine (Pure Tone)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {notes.map((note) => (
          <button
            key={note.name}
            onClick={() => playNote(note.freq)}
            className="p-6 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-yellow-500 rounded-xl flex flex-col items-center justify-center gap-2 transition group"
          >
            <span className="text-lg font-bold font-mono text-yellow-400 group-hover:scale-110 transition-transform">
              {note.name}
            </span>
            <span className="text-xs text-slate-500 font-mono">{note.freq} Hz</span>
          </button>
        ))}
      </div>
    </div>
  );
}
