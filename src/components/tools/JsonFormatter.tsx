import React, { useState, useMemo } from 'react';
import {
  Braces,
  Copy,
  Check,
  Download,
  AlertCircle,
  FileCode,
  Sparkles,
  Minimize2,
  Maximize2,
  Code2,
  Layers,
  Search,
  Filter
} from 'lucide-react';

const SAMPLE_JSON = `{
  "app": "OmniTools Community Hub",
  "version": "1.0.2",
  "active": true,
  "stats": {
    "totalUsers": 1280,
    "shippedTools": 15,
    "uptimePercent": 99.98
  },
  "tags": [
    "productivity",
    "developer",
    "design",
    "utilities"
  ],
  "features": [
    { "id": "f1", "name": "Real-time Leaderboard", "points": 2 },
    { "id": "f2", "name": "Google Sheets Sync", "points": 2 },
    { "id": "f3", "name": "Offline Local Mode", "points": 1 }
  ]
}`;

export const JsonFormatter: React.FC = () => {
  const [inputJson, setInputJson] = useState(SAMPLE_JSON);
  const [indentSize, setIndentSize] = useState<2 | 4>(2);
  const [activeTab, setActiveTab] = useState<'formatted' | 'ts' | 'tree'>('formatted');
  const [copied, setCopied] = useState(false);
  const [searchKey, setSearchKey] = useState('');

  // Parse & Validate
  const validationResult = useMemo(() => {
    if (!inputJson.trim()) {
      return { valid: true, parsed: null, error: null, byteSize: 0 };
    }
    try {
      const parsed = JSON.parse(inputJson);
      const byteSize = new Blob([inputJson]).size;
      return { valid: true, parsed, error: null, byteSize };
    } catch (err: any) {
      return {
        valid: false,
        parsed: null,
        error: err.message || 'Invalid JSON syntax',
        byteSize: new Blob([inputJson]).size,
      };
    }
  }, [inputJson]);

  // Formatted output
  const formattedOutput = useMemo(() => {
    if (!validationResult.valid || !validationResult.parsed) return '';
    return JSON.stringify(validationResult.parsed, null, indentSize);
  }, [validationResult, indentSize]);

  // Minified output
  const minifiedOutput = useMemo(() => {
    if (!validationResult.valid || !validationResult.parsed) return '';
    return JSON.stringify(validationResult.parsed);
  }, [validationResult]);

  // Generate TypeScript Interface
  const typeScriptOutput = useMemo(() => {
    if (!validationResult.valid || !validationResult.parsed) return '// Enter valid JSON to generate TypeScript interfaces';

    const generateType = (obj: any, name: string = 'RootObject'): string => {
      if (Array.isArray(obj)) {
        if (obj.length === 0) return `export type ${name} = any[];\n`;
        const firstItem = obj[0];
        if (typeof firstItem === 'object' && firstItem !== null) {
          return `${generateType(firstItem, `${name}Item`)}\nexport type ${name} = ${name}Item[];\n`;
        }
        return `export type ${name} = ${typeof firstItem}[];\n`;
      }

      if (typeof obj === 'object' && obj !== null) {
        let result = `export interface ${name} {\n`;
        for (const key of Object.keys(obj)) {
          const val = obj[key];
          const valType = typeof val;
          if (val === null) {
            result += `  ${key}: any | null;\n`;
          } else if (Array.isArray(val)) {
            if (val.length > 0 && typeof val[0] === 'object') {
              const subName = `${key.charAt(0).toUpperCase() + key.slice(1)}Item`;
              result += `  ${key}: ${subName}[];\n`;
            } else {
              result += `  ${key}: ${val.length > 0 ? typeof val[0] : 'any'}[];\n`;
            }
          } else if (valType === 'object') {
            const subName = key.charAt(0).toUpperCase() + key.slice(1);
            result += `  ${key}: ${subName};\n`;
          } else {
            result += `  ${key}: ${valType};\n`;
          }
        }
        result += `}\n`;
        return result;
      }

      return `export type ${name} = ${typeof obj};\n`;
    };

    return generateType(validationResult.parsed);
  }, [validationResult]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([formattedOutput || inputJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBeautify = () => {
    if (validationResult.valid && validationResult.parsed) {
      setInputJson(JSON.stringify(validationResult.parsed, null, indentSize));
    }
  };

  const handleMinify = () => {
    if (validationResult.valid && validationResult.parsed) {
      setInputJson(JSON.stringify(validationResult.parsed));
    }
  };

  // Render collapsible JSON tree
  const renderTree = (data: any, path: string = 'root'): React.ReactNode => {
    if (data === null) return <span className="text-rose-400 font-mono">null</span>;
    if (typeof data === 'boolean') return <span className="text-amber-400 font-mono">{String(data)}</span>;
    if (typeof data === 'number') return <span className="text-cyan-400 font-mono">{data}</span>;
    if (typeof data === 'string') return <span className="text-emerald-300 font-mono">"{data}"</span>;

    if (Array.isArray(data)) {
      return (
        <div className="pl-4 border-l border-slate-800 my-1 font-mono text-xs">
          <span className="text-slate-500">[{data.length} items]</span>
          {data.map((item, idx) => (
            <div key={`${path}-${idx}`} className="my-0.5">
              <span className="text-slate-400 font-mono mr-1.5">{idx}:</span>
              {renderTree(item, `${path}.${idx}`)}
            </div>
          ))}
        </div>
      );
    }

    if (typeof data === 'object') {
      const keys = Object.keys(data).filter(k =>
        searchKey ? k.toLowerCase().includes(searchKey.toLowerCase()) : true
      );

      return (
        <div className="pl-4 border-l border-slate-800 my-1 font-mono text-xs space-y-1">
          {keys.map((key) => (
            <div key={`${path}-${key}`} className="flex flex-wrap items-start gap-1.5">
              <span className="text-blue-400 font-semibold">{key}:</span>
              <div className="flex-1">{renderTree(data[key], `${path}.${key}`)}</div>
            </div>
          ))}
        </div>
      );
    }

    return String(data);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Braces className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>JSON Studio & TypeScript Generator</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                validationResult.valid ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' : 'bg-rose-950 text-rose-300 border border-rose-800/60'
              }`}>
                {validationResult.valid ? 'Valid JSON' : 'Syntax Error'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Format, validate, minify, explore JSON trees, and export strongly-typed TypeScript interfaces.
            </p>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setIndentSize(2)}
              className={`px-2.5 py-1 rounded-lg transition ${
                indentSize === 2 ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              2 Spaces
            </button>
            <button
              onClick={() => setIndentSize(4)}
              className={`px-2.5 py-1 rounded-lg transition ${
                indentSize === 4 ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              4 Spaces
            </button>
          </div>

          <button
            onClick={handleBeautify}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
          >
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Format</span>
          </button>
          <button
            onClick={handleMinify}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
          >
            <Minimize2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Minify</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Input Editor */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-lg">
          <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-amber-400" /> Raw JSON Input
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setInputJson('')}
                className="text-[11px] text-slate-400 hover:text-rose-400 px-2 py-0.5 rounded transition"
              >
                Clear
              </button>
              <button
                onClick={() => setInputJson(SAMPLE_JSON)}
                className="text-[11px] text-slate-400 hover:text-blue-400 px-2 py-0.5 rounded transition"
              >
                Sample
              </button>
            </div>
          </div>
          <textarea
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder="Paste your JSON here..."
            rows={20}
            className="w-full flex-1 bg-slate-950 p-4 font-mono text-xs text-amber-300/90 resize-y focus:outline-hidden leading-relaxed"
          />
          {validationResult.error && (
            <div className="p-3 bg-rose-950/40 border-t border-rose-900/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="font-mono">{validationResult.error}</span>
            </div>
          )}
        </div>

        {/* Right: Tabs for Formatted, TypeScript, and Tree */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-lg">
          <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 flex-wrap gap-2">
            <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setActiveTab('formatted')}
                className={`px-2.5 py-1 rounded-md transition ${
                  activeTab === 'formatted' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Formatted
              </button>
              <button
                onClick={() => setActiveTab('ts')}
                className={`px-2.5 py-1 rounded-md transition ${
                  activeTab === 'ts' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                TypeScript
              </button>
              <button
                onClick={() => setActiveTab('tree')}
                className={`px-2.5 py-1 rounded-md transition ${
                  activeTab === 'tree' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tree View
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(activeTab === 'ts' ? typeScriptOutput : formattedOutput)}
                className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-400" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownload}
                title="Download JSON"
                className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded-lg border border-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 bg-slate-950 flex-1 overflow-y-auto max-h-[500px]">
            {activeTab === 'formatted' && (
              <pre className="font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
                {formattedOutput || '// No valid JSON to display'}
              </pre>
            )}

            {activeTab === 'ts' && (
              <pre className="font-mono text-xs text-cyan-300 leading-relaxed overflow-x-auto">
                {typeScriptOutput}
              </pre>
            )}

            {activeTab === 'tree' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Search className="w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                    placeholder="Search object keys..."
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-hidden w-full"
                  />
                </div>
                {validationResult.parsed ? (
                  renderTree(validationResult.parsed)
                ) : (
                  <div className="text-xs text-slate-500 font-mono">No valid JSON data loaded.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <span>Size: <strong className="text-white font-mono">{validationResult.byteSize} bytes</strong></span>
          <span>Status: <strong className={validationResult.valid ? 'text-emerald-400 font-mono' : 'text-rose-400 font-mono'}>{validationResult.valid ? 'Valid JSON' : 'Syntax Error'}</strong></span>
        </div>
        <div className="text-[11px] text-slate-500">
          Client-side instant parsing with TypeScript AST generation
        </div>
      </div>
    </div>
  );
};
