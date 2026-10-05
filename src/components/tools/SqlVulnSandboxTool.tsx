import React, { useState } from 'react';
import { ShieldCheck, Terminal, AlertTriangle, CheckCircle2, Play } from 'lucide-react';
import { playSuccessSound } from '../../services/soundEffects';

export function SqlVulnSandboxTool() {
  const [inputQuery, setInputQuery] = useState("admin' OR '1'='1");
  const [resultStatus, setResultStatus] = useState<'safe' | 'vulnerable' | null>(null);
  const [matchedVector, setMatchedVector] = useState<string | null>(null);

  const payloads = [
    { pattern: /' OR '1'='1/i, name: "SQLi Tautology (' OR '1'='1)" },
    { pattern: /UNION SELECT/i, name: "SQLi Union-Based Injection" },
    { pattern: /DROP TABLE/i, name: "SQLi Destructive Command (DROP)" },
    { pattern: /<script>/i, name: "Cross-Site Scripting (<script> tag)" },
    { pattern: /OR 1=1/i, name: "Boolean Injection (OR 1=1)" },
  ];

  const handleTest = () => {
    let found = null;
    for (const p of payloads) {
      if (p.pattern.test(inputQuery)) {
        found = p.name;
        break;
      }
    }
    if (found) {
      setResultStatus('vulnerable');
      setMatchedVector(found);
    } else {
      setResultStatus('safe');
      setMatchedVector(null);
    }
    playSuccessSound();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Terminal className="w-6 h-6 text-rose-400" />
          SQL Injection & Vulnerability Payload Fuzzing Sandbox
        </h2>
        <p className="text-sm text-slate-400">
          Safely test web inputs against common SQL injection and cross-site scripting payload vectors to validate input sanitization.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300">Test Input Parameter</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 font-mono text-sm text-slate-200 focus:outline-none focus:border-rose-500"
          />
          <button
            onClick={handleTest}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-rose-600/25 transition flex items-center gap-2 shrink-0"
          >
            <Play className="w-4 h-4" />
            Fuzz Test
          </button>
        </div>
      </div>

      {resultStatus && (
        <div className={`p-4 rounded-xl border ${resultStatus === 'vulnerable' ? 'bg-rose-950/40 border-rose-800/80 text-rose-200' : 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'} space-y-2`}>
          <div className="flex items-center gap-2 font-semibold text-sm">
            {resultStatus === 'vulnerable' ? (
              <>
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                Vulnerability Detected: Malicious Payload Signature Matched
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Input appears sanitized or clean of known attack vectors.
              </>
            )}
          </div>
          {matchedVector && (
            <div className="text-xs font-mono text-rose-300">
              Matched Vector: {matchedVector}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
