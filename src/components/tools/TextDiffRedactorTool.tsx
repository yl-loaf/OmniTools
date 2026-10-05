import React, { useState } from 'react';
import { GitCompare, ShieldAlert, Copy, Check, EyeOff } from 'lucide-react';
import { playSuccessSound } from '../../services/soundEffects';

export function TextDiffRedactorTool() {
  const [originalText, setOriginalText] = useState('Hello John Doe, contact admin@company.com or call 555-0199 regarding server 192.168.1.50.');
  const [modifiedText, setModifiedText] = useState('Hello Jane Doe, contact admin@company.com or call 555-0199 regarding server 10.0.0.12.');
  const [redactedResult, setRedactedResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRedact = () => {
    let text = modifiedText;
    // Redact emails
    text = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');
    // Redact phone numbers
    text = text.replace(/(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g, '[REDACTED_PHONE]');
    // Redact IPv4
    text = text.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[REDACTED_IP]');
    setRedactedResult(text);
    playSuccessSound();
  };

  const handleCopyRedacted = () => {
    if (redactedResult) {
      navigator.clipboard.writeText(redactedResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const origLines = originalText.split('\n');
  const modLines = modifiedText.split('\n');

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <GitCompare className="w-6 h-6 text-purple-400" />
          TextDiff & Syntax Redactor
        </h2>
        <p className="text-sm text-slate-400">
          Compare document versions and automatically redact sensitive PII patterns (emails, phone numbers, IP addresses) before publishing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Original Document</label>
          <textarea
            rows={5}
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-purple-500 resize-y"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Modified Document</label>
          <textarea
            rows={5}
            value={modifiedText}
            onChange={(e) => setModifiedText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-purple-500 resize-y"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleRedact}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-purple-600/25 transition flex items-center gap-2"
        >
          <EyeOff className="w-4 h-4" />
          Auto-Redact PII in Modified Text
        </button>
      </div>

      {redactedResult && (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              Redacted Output
            </span>
            <button
              onClick={handleCopyRedacted}
              className="flex items-center gap-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 rounded-lg text-xs font-medium border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              Copy Redacted
            </button>
          </div>
          <pre className="p-3 bg-black/60 rounded-lg font-mono text-xs text-slate-300 whitespace-pre-wrap">
            {redactedResult}
          </pre>
        </div>
      )}
    </div>
  );
}
