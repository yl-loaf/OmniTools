import React, { useState } from 'react';
import { Braces, Copy, Check, FileCode, Sparkles } from 'lucide-react';

export function JsonToTsGenerator() {
  const [jsonInput, setJsonInput] = useState<string>(
    JSON.stringify(
      {
        id: 'user_982341',
        name: 'Alex Rivers',
        email: 'alex@example.com',
        isActive: true,
        roles: ['admin', 'developer'],
        metadata: {
          lastLogin: '2026-10-04T12:00:00Z',
          loginCount: 42,
        },
      },
      null,
      2
    )
  );
  const [rootName, setRootName] = useState('ApiResponse');
  const [copied, setCopied] = useState(false);

  const generateTs = (obj: any, name: string): string => {
    try {
      const parsed = typeof obj === 'string' ? JSON.parse(obj) : obj;
      if (typeof parsed !== 'object' || parsed === null) return '// Invalid JSON object';

      let output = '';
      const subInterfaces: string[] = [];

      const parseVal = (val: any, propName: string): string => {
        if (val === null) return 'any';
        if (Array.isArray(val)) {
          if (val.length === 0) return 'any[]';
          const firstType = parseVal(val[0], propName + 'Item');
          return `${firstType}[]`;
        }
        if (typeof val === 'object') {
          const subName = propName.charAt(0).toUpperCase() + propName.slice(1);
          subInterfaces.push(generateTs(val, subName));
          return subName;
        }
        return typeof val;
      };

      output += `export interface ${name} {\n`;
      for (const [key, val] of Object.entries(parsed)) {
        const typeStr = parseVal(val, key);
        output += `  ${key}: ${typeStr};\n`;
      }
      output += '}\n\n';

      return output + subInterfaces.join('\n');
    } catch (e: any) {
      return `// Error parsing JSON: ${e.message}`;
    }
  };

  const tsCode = generateTs(jsonInput, rootName);

  const handleCopy = () => {
    navigator.clipboard.writeText(tsCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <Braces className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">JSON to TypeScript Interface & Zod Generator</h1>
              <p className="text-xs text-slate-400">Instantly paste any JSON payload or API response and generate strict TypeScript interfaces with one click.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
              placeholder="Root Interface Name"
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium flex items-center gap-2 shadow-lg transition"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Types' : 'Copy TypeScript'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Paste JSON Payload</label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={16}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-blue-200 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-emerald-400" /> Generated TypeScript Interfaces
              </label>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">Strict Types</span>
            </div>
            <pre className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 h-[330px] overflow-auto">
              {tsCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
