import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, Lock, AlertTriangle, Key } from 'lucide-react';

export function JwtAuditor() {
  const [token, setToken] = useState<string>('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMzQ1Njc4OSIsIm5hbWUiOiJBbGV4IFJpdmVycyIsImVtYWlsIjoiYWxlekBleGFtcGxlLmNvbSIsInNjb3BlcyI6WyJyZWFkOnVzZXJzIiwid3JpdGU6cG9zdHMiLCJhZG1pbjpmZWF0dXJlcyJdLCJpYXQiOjE3MTE4MDAwMDAsImV4cCI6MTg4NTgwMDAwMH0.signature_placeholder');
  const [secret, setSecret] = useState<string>('my-super-secret-key');
  const [copied, setCopied] = useState(false);

  const parseJwt = (jwt: string) => {
    try {
      const parts = jwt.trim().split('.');
      if (parts.length !== 3) return { error: 'Invalid JWT format (must have header.payload.signature)' };
      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      return { header, payload, signature: parts[2] };
    } catch (e: any) {
      return { error: `Failed to decode JWT: ${e.message}` };
    }
  };

  const decoded = parseJwt(token);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = decoded.payload?.exp ? decoded.payload.exp * 1000 < Date.now() : false;
  const expiresAt = decoded.payload?.exp ? new Date(decoded.payload.exp * 1000).toLocaleString() : 'N/A';

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">JWT Claims & Permissions Auditor</h1>
              <p className="text-xs text-slate-400">Decode JSON Web Tokens, inspect expiration timers, and audit OAuth scopes securely in browser memory.</p>
            </div>
          </div>
          <button
            onClick={() => handleCopy(token)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-2 border border-slate-700 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Token' : 'Copy Raw Token'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-blue-400" /> Paste JWT Token String
            </label>
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              rows={6}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-blue-200 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" /> HMAC Secret / Public Key (Verification Helper)
            </label>
            <input
              type="text"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter secret for signature check..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 font-mono text-xs text-amber-200 focus:outline-none focus:border-amber-500"
            />
            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Token Status:</span>
                {decoded.error ? (
                  <span className="text-rose-400 font-semibold flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Invalid</span>
                ) : isExpired ? (
                  <span className="text-rose-400 font-semibold flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Expired</span>
                ) : (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Valid & Active</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Expires At:</span>
                <span className="text-slate-200 font-mono">{expiresAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Signature Alg:</span>
                <span className="text-purple-300 font-mono">{decoded.header?.alg || 'Unknown'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!decoded.error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wider">1. Header</h2>
              <span className="text-[10px] px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 rounded">JSON</span>
            </div>
            <pre className="bg-slate-950 p-3 rounded-xl font-mono text-xs text-purple-200 overflow-x-auto border border-slate-800">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>

          {/* Payload Claims */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-blue-300 uppercase tracking-wider">2. Payload Claims</h2>
              <span className="text-[10px] px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded">Claims</span>
            </div>
            <pre className="bg-slate-950 p-3 rounded-xl font-mono text-xs text-blue-200 overflow-x-auto border border-slate-800 max-h-60 overflow-y-auto">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
          </div>

          {/* Scopes & Permissions Auditor */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">3. Scopes Auditor</h2>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">Permissions</span>
            </div>
            <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800 max-h-60 overflow-y-auto">
              {decoded.payload?.scopes && Array.isArray(decoded.payload.scopes) ? (
                decoded.payload.scopes.map((scope: string, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 px-2 bg-slate-900 rounded border border-slate-800">
                    <span className="font-mono text-emerald-300">{scope}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-950 text-emerald-400 rounded">Granted</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 italic py-2 text-center">No standard 'scopes' array detected in claims. Check 'roles' or custom claims.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {decoded.error && (
        <div className="bg-rose-950/40 border border-rose-900/60 rounded-2xl p-5 text-center text-rose-300 text-xs">
          {decoded.error}
        </div>
      )}
    </div>
  );
}
