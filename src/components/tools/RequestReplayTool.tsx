import React, { useState } from 'react';
import { Terminal, Copy, Check, Send, Sparkles } from 'lucide-react';

export function RequestReplayTool() {
  const [url, setUrl] = useState('https://api.example.com/v1/orders');
  const [method, setMethod] = useState('POST');
  const [body, setBody] = useState('{\n  "itemId": "item_9823",\n  "quantity": 2\n}');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${method} ${url}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">Request Replay</h1>
              <p className="text-xs text-slate-400">Capture and replay any network request made by your browser with modified parameters to test edge cases and simulate server responses.</p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium flex items-center gap-2 shadow-lg transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Request' : 'Copy Request Payload'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Request Body Payload</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-200 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Replay Response (Simulated 200 OK)</label>
            <pre className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-blue-300 h-[190px] overflow-auto">
              {JSON.stringify({ success: true, timestamp: new Date().toISOString(), replayedPayload: JSON.parse(body || '{}') }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
