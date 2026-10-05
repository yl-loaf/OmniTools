import React, { useState } from 'react';
import { FileText, Copy, Check, ArrowRightLeft } from 'lucide-react';
import { playSuccessSound } from '../../services/soundEffects';

export function MarkdownTableCsvTool() {
  const [markdownInput, setMarkdownInput] = useState(`| Name | Age | Role |
| --- | --- | --- |
| Alice | 30 | Developer |
| Bob | 25 | Designer |`);
  const [csvOutput, setCsvOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    const lines = markdownInput.split('\n').filter(l => l.trim().startsWith('|'));
    if (lines.length < 2) return;

    const parseRow = (line: string) => line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
    const rows = lines.map(parseRow).filter(r => r.length > 0 && !r[0].includes('---'));

    const csvLines = rows.map(r => r.map(cell => `"${cell}"`).join(','));
    setCsvOutput(csvLines.join('\n'));
    playSuccessSound();
  };

  const handleCopy = () => {
    if (csvOutput) {
      navigator.clipboard.writeText(csvOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-400" />
          Markdown Table Formatting & CSV Converter
        </h2>
        <p className="text-sm text-slate-400">
          Format, align, and convert raw pipe-delimited Markdown tables into clean CSV files instantly.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300">Markdown Table</label>
        <textarea
          rows={6}
          value={markdownInput}
          onChange={(e) => setMarkdownInput(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-y"
        />
      </div>

      <button
        onClick={handleConvert}
        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition flex items-center gap-2"
      >
        <ArrowRightLeft className="w-4 h-4" />
        Convert to CSV
      </button>

      {csvOutput && (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-400">CSV Output</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 rounded-lg text-xs font-medium border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              Copy CSV
            </button>
          </div>
          <pre className="p-3 bg-black/60 rounded-lg font-mono text-xs text-indigo-300 whitespace-pre-wrap">
            {csvOutput}
          </pre>
        </div>
      )}
    </div>
  );
}
