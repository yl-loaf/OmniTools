import React, { useState, useMemo } from 'react';
import { Code2, Copy, Check, Search, Sparkles } from 'lucide-react';

const COMMON_ENTITIES = [
  { char: '&', entity: '&amp;', hex: '&#x26;', desc: 'Ampersand' },
  { char: '<', entity: '&lt;', hex: '&#x3C;', desc: 'Less than' },
  { char: '>', entity: '&gt;', hex: '&#x3E;', desc: 'Greater than' },
  { char: '"', entity: '&quot;', hex: '&#x22;', desc: 'Quotation mark' },
  { char: "'", entity: '&apos;', hex: '&#x27;', desc: 'Apostrophe' },
  { char: '©', entity: '&copy;', hex: '&#xA9;', desc: 'Copyright' },
  { char: '®', entity: '&reg;', hex: '&#xAE;', desc: 'Registered trademark' },
  { char: '™', entity: '&trade;', hex: '&#x2122;', desc: 'Trademark' },
  { char: '€', entity: '&euro;', hex: '&#x20AC;', desc: 'Euro sign' },
  { char: '£', entity: '&pound;', hex: '&#xA3;', desc: 'Pound sign' },
  { char: '¥', entity: '&yen;', hex: '&#xA5;', desc: 'Yen sign' },
  { char: '•', entity: '&bull;', hex: '&#x2022;', desc: 'Bullet point' },
  { char: '—', entity: '&mdash;', hex: '&#x2014;', desc: 'Em dash' },
  { char: '–', entity: '&ndash;', hex: '&#x2013;', desc: 'En dash' },
  { char: '°', entity: '&deg;', hex: '&#xB0;', desc: 'Degree symbol' },
  { char: '±', entity: '&plusmn;', hex: '&#xB1;', desc: 'Plus-minus sign' },
  { char: '×', entity: '&times;', hex: '&#xD7;', desc: 'Multiplication sign' },
  { char: '÷', entity: '&divide;', hex: '&#xF7;', desc: 'Division sign' },
  { char: '→', entity: '&rarr;', hex: '&#x2192;', desc: 'Right arrow' },
  { char: '←', entity: '&larr;', hex: '&#x2190;', desc: 'Left arrow' },
];

export const HtmlEntityEncoder: React.FC = () => {
  const [inputText, setInputText] = useState('<div class="hero">Hello & Welcome © 2026!</div>');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const outputText = useMemo(() => {
    if (mode === 'encode') {
      return inputText.replace(/[\u00A0-\u9999<>&"']/gim, (i) => `&#${i.charCodeAt(0)};`);
    } else {
      const doc = new DOMParser().parseFromString(inputText, 'text/html');
      return doc.documentElement.textContent || '';
    }
  }, [inputText, mode]);

  const filteredEntities = useMemo(() => {
    if (!searchFilter.trim()) return COMMON_ENTITIES;
    const q = searchFilter.toLowerCase();
    return COMMON_ENTITIES.filter(
      e => e.char.includes(q) || e.entity.toLowerCase().includes(q) || e.desc.toLowerCase().includes(q)
    );
  }, [searchFilter]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>HTML Entity Encoder & Symbol Library</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60 font-semibold">
                Unicode & ASCII
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Escape special characters to HTML entities and look up standard Unicode entity codes.
            </p>
          </div>
        </div>

        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setMode('encode')}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              mode === 'encode' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Escape Entities
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              mode === 'decode' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Decode Entities
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg">
          <div className="text-xs font-bold text-slate-300">Input String</div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={8}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-hidden leading-relaxed"
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg flex flex-col">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Result Output</span>
            <button
              onClick={() => handleCopy(outputText, 'mainOutput')}
              className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition"
            >
              {copiedKey === 'mainOutput' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-400" />}
              <span>{copiedKey === 'mainOutput' ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <textarea
            readOnly
            value={outputText}
            rows={8}
            className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-amber-300 focus:outline-hidden leading-relaxed"
          />
        </div>
      </div>

      {/* Common Entity Reference Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Quick Symbol & Entity Reference</h3>
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 w-64">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search symbols..."
              className="w-full bg-transparent text-xs text-white focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-2">
          {filteredEntities.map((ent, idx) => (
            <button
              key={idx}
              onClick={() => handleCopy(ent.entity, `ent-${idx}`)}
              className="p-3 bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl text-left transition group relative flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg font-bold text-white group-hover:text-amber-400">{ent.char}</span>
                <span className="text-[10px] text-slate-500 font-mono">{ent.hex}</span>
              </div>
              <div className="text-xs font-mono text-emerald-400">{ent.entity}</div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">{ent.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
