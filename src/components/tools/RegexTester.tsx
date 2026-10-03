import React, { useState, useMemo } from 'react';
import {
  Code,
  Copy,
  Check,
  Search,
  BookOpen,
  Sparkles,
  Layers,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

const PRESET_PATTERNS = [
  { name: 'Email Address', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'g', desc: 'Validates standard user emails' },
  { name: 'URL / Web Link', pattern: 'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)', flags: 'gi', desc: 'Matches HTTP/HTTPS web links' },
  { name: 'IPv4 Address', pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b', flags: 'g', desc: 'Matches standard IPv4 addresses' },
  { name: 'HEX Color Code', pattern: '#(?:[a-fA-F0-9]{6}|[a-fA-F0-9]{3})\\b', flags: 'gi', desc: 'Matches 3 or 6 hex digits' },
  { name: 'ISO Date (YYYY-MM-DD)', pattern: '\\b\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])\\b', flags: 'g', desc: 'Matches date format YYYY-MM-DD' },
  { name: 'HTML / XML Tags', pattern: '<(\\/?[a-zA-Z0-9]+)(?:\\s+[^>]*)?>', flags: 'g', desc: 'Matches open and closing markup tags' },
  { name: 'Phone Number (US/Intl)', pattern: '\\+?[0-9]{1,3}?[-.\\s]?\\(?[0-9]{3}\\)?[-.\\s]?[0-9]{3}[-.\\s]?[0-9]{4}', flags: 'g', desc: 'Matches phone numbers' },
];

const SAMPLE_TEXT = `Welcome to OmniTools regex testing lab!
Contact our architect team at support@omnitools.dev or admin@example.org.
Check our repository https://github.com/omnitools/core and documentation https://omnitools.dev/docs/v1.
Server IP: 192.168.1.1 or gateway 10.0.0.254.
Release date: 2026-10-03, build color: #3b82f6 with accent #10b981.
Emergency hotline: +1 (555) 234-5678.`;

export const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState<{ g: boolean; i: boolean; m: boolean; s: boolean }>({
    g: true,
    i: true,
    m: false,
    s: false,
  });
  const [testText, setTestText] = useState(SAMPLE_TEXT);
  const [replacePattern, setReplacePattern] = useState('[REDACTED]');
  const [activeTab, setActiveTab] = useState<'matches' | 'replace'>('matches');
  const [copied, setCopied] = useState(false);

  // Compile active regex flags
  const activeFlagsString = useMemo(() => {
    let f = '';
    if (flags.g) f += 'g';
    if (flags.i) f += 'i';
    if (flags.m) f += 'm';
    if (flags.s) f += 's';
    return f;
  }, [flags]);

  // Compute matches
  const matchResult = useMemo(() => {
    if (!pattern.trim()) return { matches: [], error: null };
    try {
      const regex = new RegExp(pattern, activeFlagsString);
      const matches: Array<{ match: string; index: number; groups: string[] }> = [];

      if (flags.g) {
        let m: RegExpExecArray | null;
        let count = 0;
        while ((m = regex.exec(testText)) !== null && count < 200) {
          matches.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1),
          });
          if (m.index === regex.lastIndex) regex.lastIndex++;
          count++;
        }
      } else {
        const m = regex.exec(testText);
        if (m) {
          matches.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1),
          });
        }
      }

      return { matches, error: null };
    } catch (err: any) {
      return { matches: [], error: err.message || 'Invalid regular expression' };
    }
  }, [pattern, activeFlagsString, testText, flags.g]);

  // Replace result
  const replacedOutput = useMemo(() => {
    if (!pattern.trim() || matchResult.error) return testText;
    try {
      const regex = new RegExp(pattern, activeFlagsString);
      return testText.replace(regex, replacePattern);
    } catch {
      return testText;
    }
  }, [pattern, activeFlagsString, testText, replacePattern, matchResult.error]);

  const toggleFlag = (flag: 'g' | 'i' | 'm' | 's') => {
    setFlags(prev => ({ ...prev, [flag]: !prev[flag] }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadPreset = (preset: typeof PRESET_PATTERNS[0]) => {
    setPattern(preset.pattern);
    setFlags({
      g: preset.flags.includes('g'),
      i: preset.flags.includes('i'),
      m: preset.flags.includes('m'),
      s: preset.flags.includes('s'),
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Code className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Regex Match & Replace Studio</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                matchResult.error ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-purple-950 text-purple-300 border border-purple-800/60'
              }`}>
                {matchResult.error ? 'Invalid Regex' : `${matchResult.matches.length} Matches`}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Test expressions in real-time, inspect capturing groups, and execute string substitutions.
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'matches' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Match Inspector
          </button>
          <button
            onClick={() => setActiveTab('replace')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'replace' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Replace Studio
          </button>
        </div>
      </div>

      {/* Regex Expression Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="flex items-center flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
            <span className="text-slate-500 font-mono text-sm mr-1.5 font-bold">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern (e.g. [a-z]+)"
              className="w-full bg-transparent font-mono text-xs text-purple-300 focus:outline-hidden"
            />
            <span className="text-slate-500 font-mono text-sm ml-1.5 font-bold">/{activeFlagsString}</span>
          </div>

          {/* Flags Toggles */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs self-start md:self-auto">
            <button
              onClick={() => toggleFlag('g')}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold transition ${
                flags.g ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Global match"
            >
              g
            </button>
            <button
              onClick={() => toggleFlag('i')}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold transition ${
                flags.i ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Case-insensitive"
            >
              i
            </button>
            <button
              onClick={() => toggleFlag('m')}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold transition ${
                flags.m ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Multiline"
            >
              m
            </button>
            <button
              onClick={() => toggleFlag('s')}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold transition ${
                flags.s ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Dot matches all (singleline)"
            >
              s
            </button>
          </div>
        </div>

        {matchResult.error && (
          <div className="p-2.5 bg-rose-950/40 border border-rose-900/60 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-mono">{matchResult.error}</span>
          </div>
        )}
      </div>

      {/* Preset Library Drawer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
        <div className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Common Regex Presets
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_PATTERNS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => loadPreset(p)}
              className="text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
            >
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Test Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Test String Input */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Test Text Input</span>
            <button
              onClick={() => setTestText(SAMPLE_TEXT)}
              className="text-[11px] text-slate-400 hover:text-purple-400 transition"
            >
              Reset Sample
            </button>
          </div>
          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            rows={12}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-hidden leading-relaxed"
          />
        </div>

        {/* Matches / Replace Output */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg flex flex-col">
          {activeTab === 'matches' ? (
            <>
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Matched Results ({matchResult.matches.length})</span>
                <span className="text-[11px] text-slate-400">Indexed occurrences</span>
              </div>
              <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 overflow-y-auto max-h-[300px] space-y-2">
                {matchResult.matches.length === 0 ? (
                  <div className="text-xs text-slate-500 font-mono italic">No matches found for the given pattern.</div>
                ) : (
                  matchResult.matches.map((m, idx) => (
                    <div key={idx} className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono flex items-start justify-between gap-2">
                      <div>
                        <div className="text-emerald-400 font-bold break-all">"{m.match}"</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Position: index {m.index}</div>
                        {m.groups.length > 0 && (
                          <div className="mt-1 pl-2 border-l border-slate-800 text-[10px] text-purple-300">
                            Groups: {m.groups.map((g, gi) => `$${gi + 1}: "${g}"`).join(', ')}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleCopy(m.match)}
                        className="text-slate-500 hover:text-slate-300 p-1"
                        title="Copy match"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Replacement String / Variable ($1, $2)</label>
                <input
                  type="text"
                  value={replacePattern}
                  onChange={(e) => setReplacePattern(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 font-mono text-xs text-purple-300 focus:outline-hidden"
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>Replaced Result</span>
                  <button
                    onClick={() => handleCopy(replacedOutput)}
                    className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded-lg border border-slate-700"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-purple-400" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  value={replacedOutput}
                  rows={9}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-purple-200 focus:outline-hidden"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
