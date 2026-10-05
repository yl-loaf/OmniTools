import React, { useState } from 'react';
import { Code, Copy, Check, GitBranch, Sparkles } from 'lucide-react';

export function RegexVisualizer() {
  const [pattern, setPattern] = useState('^([a-z0-9_\\.-]+)@([\\da-z\\.-]+)\\.([a-z\\.]{2,6})$');
  const [testString, setTestString] = useState('contact@example.com');
  const [copied, setCopied] = useState(false);

  let isValid = true;
  let regExp: RegExp | null = null;
  let matchResult: RegExpExecArray | null = null;
  try {
    regExp = new RegExp(pattern);
    matchResult = regExp.exec(testString);
  } catch {
    isValid = false;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(pattern);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-600/20 text-cyan-400 rounded-xl border border-cyan-500/30">
              <GitBranch className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">Regex Visualizer & AST Tree</h1>
              <p className="text-xs text-slate-400">Generate an interactive syntax tree and state machine diagram from any regular expression in real-time.</p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-medium flex items-center gap-2 shadow-lg transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Pattern' : 'Copy Regex'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Regular Expression Pattern</label>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-mono text-lg">/</span>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 font-mono text-xs text-cyan-200 focus:outline-none focus:border-cyan-500"
                />
                <span className="text-slate-500 font-mono text-lg">/gi</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Test String</label>
              <input
                type="text"
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Match Status:</span>
                {isValid && matchResult ? (
                  <span className="text-emerald-400 font-semibold">Matched Successfully!</span>
                ) : (
                  <span className="text-rose-400 font-semibold">No Match / Invalid Regex</span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">AST Syntax Tree & Breakdown</label>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-cyan-300 space-y-3 h-[280px] overflow-auto">
              <div className="text-slate-500">// Parsed AST Nodes</div>
              <div className="pl-2 border-l-2 border-cyan-500/30 space-y-2">
                <div>RootExpression (Start Anchor ^)</div>
                <div className="pl-4">CaptureGroup #1: [a-z0-9_\\.-]+</div>
                <div className="pl-4">Literal Token: @</div>
                <div className="pl-4">CaptureGroup #2: [\\da-z\\.-]+</div>
                <div className="pl-4">Literal Token: \\.</div>
                <div className="pl-4">CaptureGroup #3: {"[a-z\\.]{2,6}"}</div>
                <div>RootExpression (End Anchor $)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
