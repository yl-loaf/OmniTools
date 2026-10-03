import React, { useState } from 'react';
import { Type, Copy, Check, Trash2, ArrowRightLeft, Code, FileText, Sparkles } from 'lucide-react';

export const TextTools: React.FC = () => {
  const [text, setText] = useState<string>(
    'OmniTools is a fast, community-powered collection of browser utilities.\nRequest your own custom tools to be built!'
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [jsonMessage, setJsonMessage] = useState<string | null>(null);

  // Statistics
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lineCount = text ? text.split('\n').length : 0;
  const byteCount = new Blob([text]).size;
  const readingTimeMinutes = Math.ceil(wordCount / 200);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Case transforms
  const transformCase = (type: string) => {
    switch (type) {
      case 'upper':
        setText(text.toUpperCase());
        break;
      case 'lower':
        setText(text.toLowerCase());
        break;
      case 'title':
        setText(
          text.replace(
            /\w\S*/g,
            (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
          )
        );
        break;
      case 'camel':
        setText(
          text
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
        );
        break;
      case 'snake':
        setText(
          text
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^\w_]/g, '')
        );
        break;
      case 'kebab':
        setText(
          text
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '')
        );
        break;
      case 'trim':
        setText(text.replace(/[ \t]+/g, ' ').trim());
        break;
      case 'sortLines':
        setText(text.split('\n').sort().join('\n'));
        break;
      default:
        break;
    }
  };

  // Base64
  const handleBase64Encode = () => {
    try {
      setText(btoa(unescape(encodeURIComponent(text))));
    } catch {
      //
    }
  };

  const handleBase64Decode = () => {
    try {
      setText(decodeURIComponent(escape(atob(text))));
    } catch {
      setJsonMessage('Invalid Base64 string');
      setTimeout(() => setJsonMessage(null), 2500);
    }
  };

  // URL Encode/Decode
  const handleUrlEncode = () => setText(encodeURIComponent(text));
  const handleUrlDecode = () => {
    try {
      setText(decodeURIComponent(text));
    } catch {
      //
    }
  };

  // JSON Pretty print
  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(text);
      setText(JSON.stringify(parsed, null, 2));
      setJsonMessage('JSON formatted successfully!');
      setTimeout(() => setJsonMessage(null), 2000);
    } catch (e: any) {
      setJsonMessage(`Invalid JSON: ${e?.message}`);
      setTimeout(() => setJsonMessage(null), 3500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Type className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-extrabold text-white">Text & String Utilities</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Word counter, case manipulation (camelCase, snake_case, Title Case), Base64, URL encoding, and JSON formatting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>
          <button
            onClick={() => setText('')}
            className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-slate-750 rounded-xl border border-slate-700 transition"
            title="Clear text"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Characters</span>
          <div className="text-xl font-bold text-white font-mono mt-0.5">{charCount}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Words</span>
          <div className="text-xl font-bold text-blue-400 font-mono mt-0.5">{wordCount}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Lines</span>
          <div className="text-xl font-bold text-indigo-400 font-mono mt-0.5">{lineCount}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Bytes</span>
          <div className="text-xl font-bold text-cyan-400 font-mono mt-0.5">{byteCount}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Read Time</span>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">~{readingTimeMinutes} min</div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-[11px] text-slate-500 font-semibold self-center mr-1">Case:</span>
          <button
            onClick={() => transformCase('upper')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
          >
            UPPERCASE
          </button>
          <button
            onClick={() => transformCase('lower')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
          >
            lowercase
          </button>
          <button
            onClick={() => transformCase('title')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
          >
            Title Case
          </button>
          <button
            onClick={() => transformCase('camel')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700 transition font-mono"
          >
            camelCase
          </button>
          <button
            onClick={() => transformCase('snake')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700 transition font-mono"
          >
            snake_case
          </button>
          <button
            onClick={() => transformCase('kebab')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700 transition font-mono"
          >
            kebab-case
          </button>
          <button
            onClick={() => transformCase('trim')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
          >
            Collapse Spaces
          </button>
          <button
            onClick={() => transformCase('sortLines')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
          >
            Sort Lines A-Z
          </button>
        </div>

        <div className="flex flex-wrap gap-2 text-xs pt-2 border-t border-slate-800">
          <span className="text-[11px] text-slate-500 font-semibold self-center mr-1">Code & Enc:</span>
          <button
            onClick={handleBase64Encode}
            className="px-2.5 py-1 bg-blue-950 hover:bg-blue-900 text-blue-300 rounded-lg border border-blue-800/60 transition"
          >
            Base64 Encode
          </button>
          <button
            onClick={handleBase64Decode}
            className="px-2.5 py-1 bg-blue-950 hover:bg-blue-900 text-blue-300 rounded-lg border border-blue-800/60 transition"
          >
            Base64 Decode
          </button>
          <button
            onClick={handleUrlEncode}
            className="px-2.5 py-1 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 rounded-lg border border-indigo-800/60 transition"
          >
            URL Encode
          </button>
          <button
            onClick={handleUrlDecode}
            className="px-2.5 py-1 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 rounded-lg border border-indigo-800/60 transition"
          >
            URL Decode
          </button>
          <button
            onClick={handleFormatJson}
            className="px-2.5 py-1 bg-purple-950 hover:bg-purple-900 text-purple-300 rounded-lg border border-purple-800/60 transition flex items-center gap-1 font-semibold"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Format & Beautify JSON</span>
          </button>
        </div>

        {jsonMessage && (
          <div className="text-xs text-cyan-400 bg-cyan-950/60 p-2 rounded-lg border border-cyan-800">
            {jsonMessage}
          </div>
        )}
      </div>

      {/* Editor Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl">
        <textarea
          rows={12}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text, code, or JSON here..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-hidden focus:border-blue-500 leading-relaxed resize-y"
        />
      </div>
    </div>
  );
};
