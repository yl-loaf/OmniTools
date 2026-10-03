import React, { useState, useEffect } from 'react';
import { Keyboard, Copy, Check, Sparkles, Terminal } from 'lucide-react';

export const KeycodeEventTester: React.FC = () => {
  const [eventData, setEventData] = useState<{
    key: string;
    code: string;
    keyCode: number;
    which: number;
    location: number;
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    metaKey: boolean;
    repeat: boolean;
  }>({
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
    which: 13,
    location: 0,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    metaKey: false,
    repeat: false,
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser default on testing space/tab if inside tester
      if (['Tab', ' '].includes(e.key)) {
        e.preventDefault();
      }
      setEventData({
        key: e.key,
        code: e.code,
        keyCode: e.keyCode || e.which,
        which: e.which,
        location: e.location,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey,
        repeat: e.repeat,
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const jsCodeSnippet = `window.addEventListener('keydown', (e) => {
  if (e.key === '${eventData.key}' && e.code === '${eventData.code}') {
    console.log('Detected ${eventData.key} keypress!');
  }
});`;

  const handleCopy = () => {
    navigator.clipboard.writeText(jsCodeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Keyboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>JavaScript Keyboard Event & KeyCode Inspector</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60 font-semibold font-mono">
                e.key & e.code
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Press any key on your keyboard to instantly inspect JavaScript DOM event parameters.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition shadow-md"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>Copy JS Listener</span>
        </button>
      </div>

      {/* Hero Key Display */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3 shadow-xl">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
          PRESS ANY KEY ON YOUR KEYBOARD
        </div>
        <div className="text-5xl sm:text-7xl font-black font-mono text-cyan-400 select-all py-2">
          {eventData.key === ' ' ? 'Space' : eventData.key}
        </div>
        <div className="text-base font-bold text-slate-300 font-mono">
          Numeric KeyCode: <span className="text-amber-400 font-black text-xl">{eventData.keyCode}</span>
        </div>
      </div>

      {/* Event Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">event.key</div>
          <div className="text-lg font-bold text-emerald-400 font-mono mt-1">"{eventData.key}"</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">event.code</div>
          <div className="text-lg font-bold text-purple-400 font-mono mt-1">"{eventData.code}"</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">event.location</div>
          <div className="text-lg font-bold text-amber-400 font-mono mt-1">{eventData.location}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">event.which</div>
          <div className="text-lg font-bold text-cyan-400 font-mono mt-1">{eventData.which}</div>
        </div>
      </div>

      {/* Modifier Flags */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-around flex-wrap gap-2 text-xs font-mono">
        <span className={`px-3 py-1 rounded-lg border font-bold ${eventData.ctrlKey ? 'bg-cyan-950 border-cyan-700 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
          Ctrl: {eventData.ctrlKey ? 'TRUE' : 'false'}
        </span>
        <span className={`px-3 py-1 rounded-lg border font-bold ${eventData.shiftKey ? 'bg-cyan-950 border-cyan-700 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
          Shift: {eventData.shiftKey ? 'TRUE' : 'false'}
        </span>
        <span className={`px-3 py-1 rounded-lg border font-bold ${eventData.altKey ? 'bg-cyan-950 border-cyan-700 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
          Alt / Option: {eventData.altKey ? 'TRUE' : 'false'}
        </span>
        <span className={`px-3 py-1 rounded-lg border font-bold ${eventData.metaKey ? 'bg-cyan-950 border-cyan-700 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
          Meta / Cmd: {eventData.metaKey ? 'TRUE' : 'false'}
        </span>
      </div>
    </div>
  );
};
