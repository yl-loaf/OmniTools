import React, { useState } from 'react';
import { Play, Square, Circle, Code, Copy, Check, RefreshCw } from 'lucide-react';

interface RecordedEvent {
  id: string;
  type: string;
  target: string;
  value?: string;
  timestamp: string;
}

export default function InteractionFlowRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [events, setEvents] = useState<RecordedEvent[]>([
    { id: '1', type: 'click', target: 'button#submit-btn', timestamp: '00:01.200' },
    { id: '2', type: 'input', target: 'input#email-input', value: 'developer@example.com', timestamp: '00:03.450' },
    { id: '3', type: 'scroll', target: 'window', value: 'scrollTop: 450px', timestamp: '00:05.100' },
  ]);
  const [copied, setCopied] = useState(false);

  const handleToggleRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate adding a record event
      setTimeout(() => {
        setEvents(prev => [
          ...prev,
          { id: Date.now().toString(), type: 'click', target: 'a.nav-link', timestamp: '00:08.120' }
        ]);
      }, 2000);
    }
  };

  const scriptOutput = `// InteractionFlow Automated Test Script
async function runTest(page) {
${events.map(e => `  await page.${e.type}('${e.target}'${e.value ? `, { value: '${e.value}' }` : ''});`).join('\n')}
  console.log('Flow test completed successfully!');
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-slate-500'}`} />
            InteractionFlow Recorder
          </h2>
          <p className="text-sm text-slate-400 mt-1">Record user interaction sequences and export automated test scripts instantly.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleRecord}
            className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition ${
              isRecording ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Circle className="w-4 h-4 fill-current text-red-400" />}
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col h-[400px]">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Captured Events ({events.length})</h3>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {events.map((ev, i) => (
              <div key={ev.id} className="flex items-center justify-between p-3 bg-slate-800/70 border border-slate-700/60 rounded-lg text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-mono">{i + 1}</span>
                  <div>
                    <span className="font-semibold text-blue-400 font-mono">{ev.type}</span>
                    <span className="text-slate-300 text-xs ml-2 font-mono">{ev.target}</span>
                    {ev.value && <div className="text-slate-400 text-xs mt-0.5">Value: {ev.value}</div>}
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-mono">{ev.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-400" /> Generated Automation Script
            </h3>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-xs flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Script'}
            </button>
          </div>
          <pre className="flex-1 bg-slate-950 p-4 rounded-lg font-mono text-xs text-slate-300 overflow-auto border border-slate-800/80 leading-relaxed">
            {scriptOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}
