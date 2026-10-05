import React, { useState } from 'react';
import { Server, Copy, Check, Play, RefreshCw, Sparkles } from 'lucide-react';

export function ApiPlaybackMock() {
  const [requests, setRequests] = useState([
    { id: 1, method: 'GET', url: '/api/v1/user/profile', status: 200, latency: '42ms', timestamp: '10:42:15' },
    { id: 2, method: 'POST', url: '/api/v1/checkout/cart', status: 201, latency: '118ms', timestamp: '10:44:02' },
    { id: 3, method: 'GET', url: '/api/v1/analytics/metrics', status: 500, latency: '350ms', timestamp: '10:45:20' },
  ]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(requests, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/30">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">API Playback & Mock</h1>
              <p className="text-xs text-slate-400">Records XHR/Fetch requests and responses, allowing developers to replay them or mock custom offline responses.</p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-medium flex items-center gap-2 shadow-lg transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Mocks' : 'Export Mock Rules'}
          </button>
        </div>

        {/* Requests Table */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 font-medium text-xs text-slate-300 flex items-center justify-between">
            <span>Recorded Network Requests ({requests.length})</span>
            <span className="text-[10px] text-slate-500">Offline Mock Engine</span>
          </div>
          <div className="divide-y divide-slate-800">
            {requests.map((req) => (
              <div key={req.id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      req.method === 'GET'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : req.method === 'POST'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-purple-950 text-purple-300 border border-purple-800'
                    }`}
                  >
                    {req.method}
                  </span>
                  <span className="font-mono text-xs text-slate-200">{req.url}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded ${
                      req.status === 200 || req.status === 201 ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>{req.latency}</span>
                  <button
                    onClick={() => alert(`Replaying ${req.method} ${req.url}... Mock response returned successfully.`)}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1 transition"
                  >
                    <Play className="w-3.5 h-3.5 text-emerald-400" /> Replay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
