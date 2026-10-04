import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, RotateCcw, Award, CheckCircle2, Timer, Zap } from 'lucide-react';

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog. Programming is the art of telling another human what one wants the computer to do with absolute precision and elegance.",
  "In software engineering, consistency and readability trump cleverness. Clean code always looks like it was written by someone who cares.",
  "OmniTools is an enterprise-grade utility suite designed for developers, designers, and power users seeking fast and responsive web tools without bloat.",
  "Artificial intelligence and machine learning models empower developers to architect creative solutions, automate repetitive workflows, and build resilient applications."
];

export const TypingSpeedTool: React.FC = () => {
  const [sampleText, setSampleText] = useState(SAMPLE_TEXTS[0]);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let timer: any;
    if (startTime && !isFinished) {
      timer = setInterval(() => {
        const seconds = (Date.now() - startTime) / 1000;
        setElapsedSeconds(seconds);

        const wordsTyped = userInput.trim().split(/\s+/).filter(Boolean).length;
        const currentWpm = seconds > 0 ? Math.round((wordsTyped / seconds) * 60) : 0;
        setWpm(currentWpm);
      }, 200);
    }
    return () => clearInterval(timer);
  }, [startTime, isFinished, userInput]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (!startTime && val.length > 0) {
      setStartTime(Date.now());
    }
    setUserInput(val);

    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === sampleText[i]) correctChars++;
    }
    const acc = val.length > 0 ? Math.round((correctChars / val.length) * 100) : 100;
    setAccuracy(acc);

    if (val.length >= sampleText.length) {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setUserInput('');
    setStartTime(null);
    setElapsedSeconds(0);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    const randomText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
    setSampleText(randomText);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-500/20">
            <Keyboard className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">Typing Speed Test (WPM)</h2>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                WPM & Accuracy
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Test your typing speed, words per minute (WPM), and character accuracy in real time.
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-2 border border-slate-700"
        >
          <RotateCcw className="w-4 h-4" />
          <span>New Test</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Speed</div>
          <div className="text-2xl sm:text-3xl font-mono font-black text-purple-400 mt-1">{wpm} <span className="text-xs text-slate-400">WPM</span></div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Accuracy</div>
          <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-400 mt-1">{accuracy}%</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Time Elapsed</div>
          <div className="text-2xl sm:text-3xl font-mono font-black text-white mt-1">{elapsedSeconds.toFixed(1)}s</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Characters</div>
          <div className="text-2xl sm:text-3xl font-mono font-black text-cyan-400 mt-1">{userInput.length}/{sampleText.length}</div>
        </div>
      </div>

      {/* Typing Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-sm sm:text-base leading-relaxed select-none">
          {sampleText.split('').map((char, index) => {
            let color = 'text-slate-500';
            if (index < userInput.length) {
              color = userInput[index] === char ? 'text-emerald-400 bg-emerald-950/40' : 'text-rose-400 bg-rose-950/40 underline';
            } else if (index === userInput.length) {
              color = 'text-white bg-slate-800 animate-pulse';
            }
            return (
              <span key={index} className={`${color} transition rounded-xs`}>
                {char}
              </span>
            );
          })}
        </div>

        <textarea
          ref={inputRef}
          rows={4}
          value={userInput}
          onChange={handleChange}
          disabled={isFinished}
          placeholder="Start typing the text above here..."
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-white font-mono focus:outline-hidden resize-none"
        />

        {isFinished && (
          <div className="p-4 bg-purple-950/50 border border-purple-800/80 rounded-2xl text-center space-y-2 animate-in fade-in">
            <div className="font-extrabold text-purple-300 flex items-center justify-center gap-1.5">
              <Award className="w-5 h-5 text-purple-400" /> Typing Test Completed!
            </div>
            <p className="text-xs text-slate-300">
              You typed at <strong className="text-purple-400">{wpm} WPM</strong> with <strong className="text-emerald-400">{accuracy}% accuracy</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
