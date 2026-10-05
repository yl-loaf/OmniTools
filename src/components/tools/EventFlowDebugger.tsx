import React, { useState } from 'react';
import { Zap, ShieldAlert, CheckCircle, RefreshCcw } from 'lucide-react';

interface DomEventLog {
  id: string;
  type: string;
  target: string;
  phase: 'Capture' | 'Target' | 'Bubbling';
  timestamp: string;
  blocked: boolean;
}

export default function EventFlowDebugger() {
  const [events, setEvents] = useState<DomEventLog[]>([
    { id: '1', type: 'click', target: 'button.submit-btn', phase: 'Bubbling', timestamp: '10:14:02.120', blocked: false },
    { id: '2', type: 'keydown', target: 'input#search', phase: 'Target', timestamp: '10:14:04.890', blocked: false },
    { id: '3', type: 'scroll', target: 'window', phase: 'Bubbling', timestamp: '10:14:08.310', blocked: false },
  ]);
  const [isListening, setIsListening] = useState(true);

  const handleToggleBlock = (id: string) => {
    setEvents(events.map(ev => ev.id === id ? { ...ev, blocked: !ev.blocked } : ev));
  };

  const handleTriggerSim = () => {
    const types = ['click', 'mouseover', 'focus', 'input'];
    const targets = ['.card-header', 'input#email', 'button.action', 'div.container'];
    const newEv: DomEventLog = {
      id: Date.now().toString(),
      type: types[Math.floor(Math.random() * types.length)],
      target: targets[Math.floor(Math.random() * targets.length)],
      phase: 'Bubbling',
      timestamp: new Date().toTimeString().split(' ')[0] + '.' + Math.floor(Math.random() * 900 + 100),
      blocked: false,
    };
    setEvents([newEv, ...events]);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-400" />
            EventFlow Debugger
          </h2>
          <p className="text-sm text-slate-400 mt-1">Visually track and debug DOM events in real-time with propagation paths and listener blocking.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerSim}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium text-sm transition"
          >
            Simulate Event
          </button>
          <button
            onClick={() => setIsListening(!isListening)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              isListening ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {isListening ? 'Listening Active' : 'Paused'}
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Captured DOM Events Log</h3>
        <div className="space-y-3">
          {events.map((ev) => (
            <div key={ev.id} className={`p-4 rounded-xl border flex items-center justify-between transition ${
              ev.blocked ? 'bg-red-950/30 border-red-900/50 opacity-75' : 'bg-slate-800/80 border-slate-700/80'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-lg ${ev.blocked ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-100 text-sm">{ev.type}</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-700 text-slate-300 rounded font-mono">{ev.phase}</span>
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1">Target: {ev.target}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-slate-500">{ev.timestamp}</span>
                <button
                  onClick={() => handleToggleBlock(ev.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    ev.blocked ? 'bg-red-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  }`}
                >
                  {ev.blocked ? 'Event Blocked' : 'Block Event'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
