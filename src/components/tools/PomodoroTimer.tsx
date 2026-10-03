import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Volume2, VolumeX, Flag, Coffee, Briefcase, Zap } from 'lucide-react';

export const PomodoroTimer: React.FC = () => {
  // Modes: 'pomodoro' | 'stopwatch' | 'custom'
  const [activeMode, setActiveMode] = useState<'pomodoro' | 'stopwatch' | 'custom'>('pomodoro');

  // Pomodoro Phase: 'focus' (25m), 'shortBreak' (5m), 'longBreak' (15m)
  const [pomoPhase, setPomoPhase] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [completedSessions, setCompletedSessions] = useState<number>(0);

  // Custom countdown timer
  const [customMinutes, setCustomMinutes] = useState<number>(10);

  // Stopwatch state
  const [stopwatchMs, setStopwatchMs] = useState<number>(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<number[]>([]);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playChime = (freq: number, duration: number, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not supported or blocked
    }
  };

  // Switch Pomodoro phase
  const setPhase = (phase: 'focus' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false);
    setPomoPhase(phase);
    if (phase === 'focus') setSecondsRemaining(25 * 60);
    if (phase === 'shortBreak') setSecondsRemaining(5 * 60);
    if (phase === 'longBreak') setSecondsRemaining(15 * 60);
  };

  // Timer Countdown Effect
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          const next = prev - 1;
          if (next === 0) {
            setIsRunning(false);
            playChime(660, 0.7, 'triangle');
            if (pomoPhase === 'focus') {
              setCompletedSessions((c) => c + 1);
            }
          } else if (next <= 3 && next > 0) {
            playChime(440, 0.1, 'sine');
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining, pomoPhase, soundEnabled]);

  // Stopwatch Interval
  useEffect(() => {
    let interval: any = null;
    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchMs((prev) => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isStopwatchRunning]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatStopwatch = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const hundredths = Math.floor((ms % 1000) / 10);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}.${hundredths < 10 ? '0' : ''}${hundredths}`;
  };

  const totalPhaseSeconds = pomoPhase === 'focus' ? 25 * 60 : pomoPhase === 'shortBreak' ? 5 * 60 : 15 * 60;
  const progressPercent = ((totalPhaseSeconds - secondsRemaining) / totalPhaseSeconds) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Timer className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-extrabold text-white">Productivity Timer & Precision Stopwatch</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Focus Pomodoro intervals, custom countdowns, and millisecond lap stopwatch with audio chimes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl text-xs font-medium border transition ${
              soundEnabled
                ? 'bg-amber-950/60 border-amber-700/60 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title={soundEnabled ? 'Mute buzzer sound' : 'Unmute buzzer sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveMode('pomodoro')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeMode === 'pomodoro' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pomodoro
            </button>
            <button
              onClick={() => setActiveMode('custom')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeMode === 'custom' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Countdown
            </button>
            <button
              onClick={() => setActiveMode('stopwatch')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeMode === 'stopwatch' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Stopwatch
            </button>
          </div>
        </div>
      </div>

      {activeMode === 'pomodoro' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-xl mx-auto text-center space-y-6 shadow-2xl">
          {/* Phase selector buttons */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setPhase('focus')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                pomoPhase === 'focus'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Focus (25m)</span>
            </button>
            <button
              onClick={() => setPhase('shortBreak')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                pomoPhase === 'shortBreak'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Short Break (5m)</span>
            </button>
            <button
              onClick={() => setPhase('longBreak')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                pomoPhase === 'longBreak'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Long Break (15m)</span>
            </button>
          </div>

          {/* Time Display */}
          <div className="font-mono text-7xl sm:text-8xl font-black tracking-tight text-white select-none">
            {formatTime(secondsRemaining)}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 transition-all duration-1000 ${
                pomoPhase === 'focus' ? 'bg-rose-500' : pomoPhase === 'shortBreak' ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 transition shadow-xl ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
              <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
            </button>

            <button
              onClick={() => setPhase(pomoPhase)}
              className="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700"
              title="Reset current session"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          <div className="text-xs text-slate-400 pt-2 border-t border-slate-800">
            Sessions Completed Today: <strong className="text-white font-mono">{completedSessions}</strong>
          </div>
        </div>
      )}

      {activeMode === 'custom' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-xl mx-auto text-center space-y-6 shadow-2xl">
          <div className="flex justify-center items-center gap-3 text-xs text-slate-300">
            <span>Set Minutes:</span>
            {[5, 10, 15, 30, 45, 60].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setCustomMinutes(m);
                  setSecondsRemaining(m * 60);
                  setIsRunning(false);
                }}
                className={`px-2.5 py-1 rounded-lg font-mono font-semibold transition ${
                  customMinutes === m ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {m}m
              </button>
            ))}
          </div>

          <div className="font-mono text-7xl sm:text-8xl font-black text-white select-none">
            {formatTime(secondsRemaining)}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 transition shadow-xl ${
                isRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{isRunning ? 'Pause' : 'Start Countdown'}</span>
            </button>

            <button
              onClick={() => {
                setIsRunning(false);
                setSecondsRemaining(customMinutes * 60);
              }}
              className="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {activeMode === 'stopwatch' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-xl mx-auto space-y-6 shadow-2xl">
          <div className="text-center font-mono text-6xl sm:text-7xl font-black text-cyan-300 select-none">
            {formatStopwatch(stopwatchMs)}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 text-white transition ${
                isStopwatchRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              {isStopwatchRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isStopwatchRunning ? 'Pause' : 'Start'}</span>
            </button>

            <button
              onClick={() => {
                if (stopwatchMs > 0) setLaps([stopwatchMs, ...laps]);
              }}
              disabled={!isStopwatchRunning}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 disabled:opacity-40"
            >
              <Flag className="w-4 h-4" />
              <span>Record Lap</span>
            </button>

            <button
              onClick={() => {
                setIsStopwatchRunning(false);
                setStopwatchMs(0);
                setLaps([]);
              }}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl border border-slate-700 transition"
              title="Reset stopwatch"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {laps.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recorded Lap Times</h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {laps.map((lap, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs font-mono bg-slate-800/60 px-3 py-1.5 rounded-lg text-slate-300">
                    <span className="text-slate-500">Lap #{laps.length - idx}</span>
                    <span className="text-emerald-400 font-bold">{formatStopwatch(lap)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
