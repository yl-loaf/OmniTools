import React, { useState } from 'react';
import { FileText, Copy, Check, Search, ExternalLink, Sparkles } from 'lucide-react';

export function CodeDocContextTool() {
  const [query, setQuery] = useState('useEffect');
  const [copied, setCopied] = useState(false);

  const docs = [
    { title: 'React useEffect Hook', source: 'React Official Docs', snippet: 'Accepts a function that contains imperative, possibly effectful code. Cleans up when unmounted.', url: 'https://react.dev/reference/react/useEffect' },
    { title: 'Array.prototype.reduce()', source: 'MDN Web Docs', snippet: 'Executes a user-supplied "reducer" callback function on each element of the array.', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce' },
    { title: 'Tailwind CSS Grid Templates', source: 'Tailwind CSS', snippet: 'Utilities for specifying the columns and rows in a grid layout.', url: 'https://tailwindcss.com/docs/grid-template-columns' },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-600/20 text-amber-400 rounded-xl border border-amber-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">CodeDoc Context</h1>
              <p className="text-xs text-slate-400">Instantly fetch relevant documentation from popular sources like MDN, framework guides, or library docs without leaving your workflow.</p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-medium flex items-center gap-2 shadow-lg transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Term' : 'Copy Query'}
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search API or code snippet context..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {docs.map((doc, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded">{doc.source}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-100">{doc.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{doc.snippet}</p>
              </div>
              <a
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                className="pt-3 border-t border-slate-800 text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 font-medium"
              >
                Open Official Docs <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
