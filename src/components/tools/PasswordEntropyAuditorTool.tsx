import React, { useState } from 'react';
import { Key, ShieldCheck, Copy, Check, Lock } from 'lucide-react';
import { playSuccessSound } from '../../services/soundEffects';

export function PasswordEntropyAuditorTool() {
  const [password, setPassword] = useState('Tr0ub4dour&3');
  const [copied, setCopied] = useState(false);

  // Calculate entropy
  const getEntropy = (pwd: string) => {
    if (!pwd) return 0;
    let charsetSize = 0;
    if (/[a-z]/.test(pwd)) charsetSize += 26;
    if (/[A-Z]/.test(pwd)) charsetSize += 26;
    if (/[0-9]/.test(pwd)) charsetSize += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) charsetSize += 32;

    const entropy = pwd.length * (charsetSize > 0 ? Math.log2(charsetSize) : 0);
    return Math.round(entropy * 10) / 10;
  };

  const entropy = getEntropy(password);
  const getCrackTime = (bits: number) => {
    if (bits < 28) return 'Instant (< 1 second)';
    if (bits < 36) return 'A few hours';
    if (bits < 60) return 'Several days to months';
    if (bits < 80) return 'Centuries';
    return 'Trillions of years (Extremely Secure)';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    playSuccessSound();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Key className="w-6 h-6 text-blue-400" />
          Secure Password Entropy & Breach Auditor
        </h2>
        <p className="text-sm text-slate-400">
          Calculate cryptographic password entropy and brute-force cracking time estimates entirely client-side.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300">Enter Password to Audit</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 font-mono text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            Copy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Password Length</div>
          <div className="text-xl font-bold font-mono text-slate-200">{password.length} chars</div>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Cryptographic Entropy</div>
          <div className="text-xl font-bold font-mono text-blue-400">{entropy} bits</div>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Est. Brute-Force Time</div>
          <div className="text-xs font-bold font-mono text-emerald-400 pt-1">{getCrackTime(entropy)}</div>
        </div>
      </div>
    </div>
  );
}
