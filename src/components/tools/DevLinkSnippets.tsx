import React, { useState } from 'react';
import { Layers, Copy, Check, Code, Sparkles, ExternalLink } from 'lucide-react';

export function DevLinkSnippets() {
  const [snippets, setSnippets] = useState([
    { title: 'React useState Hook Template', category: 'React', snippet: 'const [state, setState] = useState<Type>(initialValue);' },
    { title: 'Tailwind Flex Center Container', category: 'Tailwind', snippet: 'className="flex items-center justify-center gap-4"' },
    { title: 'Express.js JSON API Endpoint', category: 'Node', snippet: 'app.get("/api/health", (req, res) => res.json({ status: "ok" }));' },
  ]);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">DevLink Snippets</h1>
              <p className="text-xs text-slate-400">Automatically saves and organizes code snippets and framework reference links based on detected libraries in your workflow.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {snippets.map((item, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded">{item.category}</span>
                <h3 className="text-sm font-bold text-slate-100">{item.title}</h3>
                <pre className="bg-slate-900 p-3 rounded-lg font-mono text-xs text-blue-200 overflow-x-auto border border-slate-800">
                  {item.snippet}
                </pre>
              </div>
              <button
                onClick={() => handleCopy(item.snippet)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-medium flex items-center justify-center gap-2 border border-slate-700 transition"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Snippet
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
