import React, { useState, useMemo } from 'react';
import { ShieldCheck, Copy, Check, Lock, AlertCircle, Sparkles, Clock, UserCheck } from 'lucide-react';

const SAMPLE_JWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggRGV2ZWxvcGVyIiwicm9sZSI6ImFkbWluIiwiZW1haWwiOiJhbGV4QGV4YW1wbGUub3JnIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.4zU-3_B9w0Z3Kj5ZJ1W_4V7y_mP5Y9xK5w7W0Z3Kj5Y`;

export const JwtDebugger: React.FC = () => {
  const [token, setToken] = useState(SAMPLE_JWT);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Decode JWT safely
  const decoded = useMemo(() => {
    if (!token.trim()) return { valid: false, header: null, payload: null, signature: '', error: 'Enter a JWT string' };

    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      return { valid: false, header: null, payload: null, signature: '', error: 'A valid JWT must contain 3 dot-separated parts (Header.Payload.Signature)' };
    }

    try {
      const headerJson = JSON.parse(decodeURIComponent(escape(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')))));
      const payloadJson = JSON.parse(decodeURIComponent(escape(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))));

      // Check Expiration
      let isExpired = false;
      let expiryDate: string | null = null;
      if (payloadJson.exp) {
        const expMs = payloadJson.exp * 1000;
        isExpired = expMs < Date.now();
        expiryDate = new Date(expMs).toUTCString();
      }

      return {
        valid: true,
        header: headerJson,
        payload: payloadJson,
        signature: parts[2],
        isExpired,
        expiryDate,
        error: null,
      };
    } catch (e: any) {
      return { valid: false, header: null, payload: null, signature: parts[2] || '', error: 'Failed to decode Base64 payload in token.' };
    }
  }, [token]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-purple-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>JWT (JSON Web Token) Debugger & Inspector</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                decoded.valid ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' : 'bg-rose-950 text-rose-300 border border-rose-800/60'
              }`}>
                {decoded.valid ? 'Valid Structure' : 'Invalid JWT'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Decode headers, payload claims, timestamps, and signature without sending tokens to any server.
            </p>
          </div>
        </div>

        {decoded.valid && decoded.payload?.exp && (
          <div className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-semibold ${
            decoded.isExpired ? 'bg-rose-950/80 border-rose-800 text-rose-300' : 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{decoded.isExpired ? 'Token Expired' : 'Token Active (Valid Expiry)'}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Token Input */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg flex flex-col">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Encoded JWT String</span>
            <button onClick={() => setToken(SAMPLE_JWT)} className="text-[11px] text-slate-400 hover:text-rose-400">
              Reset Sample
            </button>
          </div>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            rows={14}
            className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-rose-300 focus:outline-hidden break-all leading-relaxed"
          />
          {decoded.error && (
            <div className="p-3 bg-rose-950/50 border border-rose-900/60 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{decoded.error}</span>
            </div>
          )}
        </div>

        {/* Decoded Blocks */}
        <div className="space-y-4">
          {/* Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-rose-400 font-mono">
              <span>Header: Algorithm & Token Type</span>
              {decoded.header && (
                <button
                  onClick={() => handleCopy(JSON.stringify(decoded.header, null, 2), 'header')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedKey === 'header' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>
            <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-rose-300 overflow-x-auto">
              {decoded.header ? JSON.stringify(decoded.header, null, 2) : '// No valid header'}
            </pre>
          </div>

          {/* Payload */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-purple-400 font-mono">
              <span>Payload: Claims & Data</span>
              {decoded.payload && (
                <button
                  onClick={() => handleCopy(JSON.stringify(decoded.payload, null, 2), 'payload')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedKey === 'payload' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>
            <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-purple-300 overflow-x-auto">
              {decoded.payload ? JSON.stringify(decoded.payload, null, 2) : '// No valid payload'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
