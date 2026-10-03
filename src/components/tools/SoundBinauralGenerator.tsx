import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Sparkles, Sliders, Waves, CloudRain, Wind } from 'lucide-react';

export const SoundBinauralGenerator: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundType, setSoundType] = useState<'white' | 'pink' | 'binaural'>('white');
  const [volume, setVolume] = useState(0.3);
  const [binauralBaseFreq, setBinauralBaseFreq] = useState(216); // Hz
  const [binauralBeatFreq, setBinauralBeatFreq] = useState(4.5); // Theta wave (4-8 Hz for Deep Focus)

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodesRef = useRef<any[]>([]);

  const stopAudio = () => {
    sourceNodesRef.current.forEach(node => {
      try { node.stop(); } catch {}
      try { node.disconnect(); } catch {}
    });
    sourceNodesRef.current = [];
    setIsPlaying(false);
  };

  const startAudio = () => {
    stopAudio();

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioContextClass();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.connect(ctx.destination);
    gainNodeRef.current = gainNode;

    if (soundType === 'white') {
      // White noise buffer
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;
      whiteNoise.connect(gainNode);
      whiteNoise.start();
      sourceNodesRef.current.push(whiteNoise);
    } else if (soundType === 'pink') {
      // Pink noise approximation
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
      const pinkNoise = ctx.createBufferSource();
      pinkNoise.buffer = noiseBuffer;
      pinkNoise.loop = true;
      pinkNoise.connect(gainNode);
      pinkNoise.start();
      sourceNodesRef.current.push(pinkNoise);
    } else if (soundType === 'binaural') {
      // Stereo Binaural Beats (left ear baseFreq, right ear baseFreq + beatFreq)
      const merger = ctx.createChannelMerger(2);

      const oscLeft = ctx.createOscillator();
      oscLeft.type = 'sine';
      oscLeft.frequency.setValueAtTime(binauralBaseFreq, ctx.currentTime);

      const oscRight = ctx.createOscillator();
      oscRight.type = 'sine';
      oscRight.frequency.setValueAtTime(binauralBaseFreq + binauralBeatFreq, ctx.currentTime);

      oscLeft.connect(merger, 0, 0); // Left channel
      oscRight.connect(merger, 0, 1); // Right channel
      merger.connect(gainNode);

      oscLeft.start();
      oscRight.start();
      sourceNodesRef.current.push(oscLeft, oscRight);
    }

    setIsPlaying(true);
  };

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div className="space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Waves className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Binaural Beats & White Noise Generator</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-semibold">
                Web Audio Synth
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Synthesize client-side white noise, pink noise, and brainwave entrainment frequencies for deep focus.
            </p>
          </div>
        </div>

        <button
          onClick={isPlaying ? stopAudio : startAudio}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-lg ${
            isPlaying
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
          <span>{isPlaying ? 'Stop Sound' : 'Start Focus Audio'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sound Preset Picker */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Audio Mode</h3>

          <div className="space-y-2">
            {[
              { id: 'white', label: 'White Noise', desc: 'Equal energy per frequency, mask background distractions' },
              { id: 'pink', label: 'Pink Noise (Rain/Wind)', desc: 'Deeper resonance, natural soothing sound curve' },
              { id: 'binaural', label: 'Binaural Beats (Theta)', desc: 'Brainwave entrainment for meditation & laser focus' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSoundType(s.id as any);
                  if (isPlaying) {
                    setTimeout(() => startAudio(), 50);
                  }
                }}
                className={`w-full text-left p-3 rounded-xl border transition ${
                  soundType === s.id
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">{s.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders & Parameters */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-lg flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Volume & Synthesizer Controls</h3>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><Volume2 className="w-4 h-4 text-cyan-400" /> Master Volume</span>
                <span className="font-mono text-white">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            {soundType === 'binaural' && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Base Pitch</span>
                    <span className="font-mono text-cyan-300">{binauralBaseFreq} Hz</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="440"
                    value={binauralBaseFreq}
                    onChange={(e) => setBinauralBaseFreq(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Beat Frequency (Theta)</span>
                    <span className="font-mono text-indigo-300">{binauralBeatFreq} Hz</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={binauralBeatFreq}
                    onChange={(e) => setBinauralBeatFreq(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Requires stereo headphones for Binaural Beats effect.</span>
            <span className="font-mono text-indigo-400 font-bold">100% Client-Side Web Audio</span>
          </div>
        </div>
      </div>
    </div>
  );
};
