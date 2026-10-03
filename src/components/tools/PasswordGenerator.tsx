import React, { useState, useEffect, useMemo } from 'react';
import {
  Key,
  Copy,
  Check,
  RefreshCw,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Hash,
  Sparkles,
  Sliders,
  Layers
} from 'lucide-react';

const PASSPHRASE_WORDS = [
  'apple', 'beach', 'cloud', 'dragon', 'eagle', 'forest', 'galaxy', 'harbor',
  'island', 'jungle', 'knight', 'lemon', 'matrix', 'nebula', 'ocean', 'planet',
  'quantum', 'river', 'shadow', 'thunder', 'universe', 'volcano', 'wizard', 'xenon',
  'yellow', 'zenith', 'beacon', 'crystal', 'falcon', 'glacier', 'horizon', 'meteor'
];

export const PasswordGenerator: React.FC = () => {
  const [mode, setMode] = useState<'password' | 'passphrase' | 'uuid'>('password');

  // Password Config
  const [length, setLength] = useState(18);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');

  // Passphrase Config
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-');
  const [capitalizeWords, setCapitalizeWords] = useState(true);
  const [includeNumberInPassphrase, setIncludeNumberInPassphrase] = useState(true);
  const [generatedPassphrase, setGeneratedPassphrase] = useState('');

  // UUID Config
  const [uuidQuantity, setUuidQuantity] = useState(5);
  const [uuidUppercase, setUuidUppercase] = useState(false);
  const [uuidNoHyphens, setUuidNoHyphens] = useState(false);
  const [generatedUuids, setGeneratedUuids] = useState<string[]>([]);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Generate standard random password
  const generatePassword = () => {
    let chars = '';
    if (includeUpper) chars += excludeAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLower) chars += excludeAmbiguous ? 'abcdefghijkmnopqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += excludeAmbiguous ? '23456789' : '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      setGeneratedPassword('Please select at least one character set');
      return;
    }

    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[randomValues[i] % chars.length];
    }
    setGeneratedPassword(result);
  };

  // Generate Memorable Passphrase
  const generatePassphrase = () => {
    const selectedWords: string[] = [];
    const randomArray = new Uint32Array(wordCount);
    crypto.getRandomValues(randomArray);

    for (let i = 0; i < wordCount; i++) {
      let word = PASSPHRASE_WORDS[randomArray[i] % PASSPHRASE_WORDS.length];
      if (capitalizeWords) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      selectedWords.push(word);
    }

    let phrase = selectedWords.join(separator);
    if (includeNumberInPassphrase) {
      const num = Math.floor(Math.random() * 90 + 10);
      phrase += `${separator}${num}`;
    }
    setGeneratedPassphrase(phrase);
  };

  // Generate UUID v4
  const generateUuids = () => {
    const uuids: string[] = [];
    for (let i = 0; i < uuidQuantity; i++) {
      let id: string = crypto.randomUUID();
      if (uuidNoHyphens) id = id.replace(/-/g, '');
      if (uuidUppercase) id = id.toUpperCase();
      uuids.push(id);
    }
    setGeneratedUuids(uuids);
  };

  useEffect(() => {
    if (mode === 'password') generatePassword();
    else if (mode === 'passphrase') generatePassphrase();
    else if (mode === 'uuid') generateUuids();
  }, [mode, length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous, wordCount, separator, capitalizeWords, includeNumberInPassphrase, uuidQuantity, uuidUppercase, uuidNoHyphens]);

  // Compute Password Entropy
  const entropyStats = useMemo(() => {
    const pwd = mode === 'passphrase' ? generatedPassphrase : generatedPassword;
    if (!pwd) return { bits: 0, strength: 'Weak', crackTime: 'Instant' };

    let pool = 0;
    if (/[a-z]/.test(pwd)) pool += 26;
    if (/[A-Z]/.test(pwd)) pool += 26;
    if (/[0-9]/.test(pwd)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) pool += 32;
    if (pool === 0) pool = 10;

    const bits = Math.round(pwd.length * Math.log2(pool));

    let strength = 'Weak';
    let crackTime = '< 1 second';

    if (bits > 80) {
      strength = 'Very Strong';
      crackTime = 'Centuries (Uncrackable)';
    } else if (bits > 60) {
      strength = 'Strong';
      crackTime = 'Several Years';
    } else if (bits > 40) {
      strength = 'Moderate';
      crackTime = 'Few Months';
    }

    return { bits, strength, crackTime };
  }, [generatedPassword, generatedPassphrase, mode]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Key className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>UUID & Cryptographic Password Generator</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold">
                NIST Compliant
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Generate secure random passwords, memorable passphrases, and bulk UUID v4 strings.
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setMode('password')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              mode === 'password' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Random Password
          </button>
          <button
            onClick={() => setMode('passphrase')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              mode === 'passphrase' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Passphrase
          </button>
          <button
            onClick={() => setMode('uuid')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              mode === 'uuid' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            UUID v4 Bulk
          </button>
        </div>
      </div>

      {/* 1. Standard Password Generator */}
      {mode === 'password' && (
        <div className="space-y-4">
          {/* Main Display Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between gap-3 bg-slate-950 border border-slate-800 rounded-xl p-4">
              <span className="font-mono text-base sm:text-lg text-emerald-400 break-all select-all font-bold">
                {generatedPassword}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={generatePassword}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                  title="Generate new password"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCopy(generatedPassword, 'pwd')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition shadow-md"
                >
                  {copiedKey === 'pwd' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'pwd' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Entropy Meter */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400">Entropy Strength:</span>
                <div className={`font-bold mt-0.5 ${
                  entropyStats.bits > 70 ? 'text-emerald-400' : entropyStats.bits > 45 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {entropyStats.strength} ({entropyStats.bits} bits)
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs sm:col-span-2">
                <span className="text-slate-400">Estimated Crack Time (Brute Force):</span>
                <div className="font-bold text-cyan-300 mt-0.5 font-mono">{entropyStats.crackTime}</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Password Length</span>
                <span className="text-amber-400 font-mono text-sm">{length} characters</span>
              </div>
              <input
                type="range"
                min="6"
                max="64"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs">
              <label className="flex items-center gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeUpper}
                  onChange={(e) => setIncludeUpper(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span className="text-slate-200">Uppercase (A-Z)</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeLower}
                  onChange={(e) => setIncludeLower(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span className="text-slate-200">Lowercase (a-z)</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span className="text-slate-200">Numbers (0-9)</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span className="text-slate-200">Symbols (!@#$)</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 2. Passphrase Generator */}
      {mode === 'passphrase' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between gap-3 bg-slate-950 border border-slate-800 rounded-xl p-4">
              <span className="font-mono text-base sm:text-lg text-cyan-400 break-all select-all font-bold">
                {generatedPassphrase}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={generatePassphrase}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCopy(generatedPassphrase, 'phrase')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition shadow-md"
                >
                  {copiedKey === 'phrase' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'phrase' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Number of Words</span>
                <span className="text-cyan-400 font-mono text-sm">{wordCount} words</span>
              </div>
              <input
                type="range"
                min="3"
                max="8"
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <label className="flex items-center gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={capitalizeWords}
                  onChange={(e) => setCapitalizeWords(e.target.checked)}
                  className="rounded text-cyan-500"
                />
                <span className="text-slate-200">Capitalize Words</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNumberInPassphrase}
                  onChange={(e) => setIncludeNumberInPassphrase(e.target.checked)}
                  className="rounded text-cyan-500"
                />
                <span className="text-slate-200">Append Number</span>
              </label>
              <div className="flex items-center gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">Separator:</span>
                <input
                  type="text"
                  value={separator}
                  maxLength={2}
                  onChange={(e) => setSeparator(e.target.value)}
                  className="bg-slate-900 border border-slate-700 w-12 text-center rounded text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. UUID v4 Bulk Generator */}
      {mode === 'uuid' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-white">Quantity:</span>
                {[1, 5, 10, 20].map((q) => (
                  <button
                    key={q}
                    onClick={() => setUuidQuantity(q)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      uuidQuantity === q ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleCopy(generatedUuids.join('\n'), 'allUuids')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700"
              >
                {copiedKey === 'allUuids' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy All</span>
              </button>
            </div>

            <div className="space-y-2 bg-slate-950 border border-slate-800 rounded-xl p-3 max-h-[320px] overflow-y-auto font-mono text-xs text-amber-300">
              {generatedUuids.map((id, idx) => (
                <div key={idx} className="flex items-center justify-between p-1.5 hover:bg-slate-900 rounded-lg group">
                  <span>{id}</span>
                  <button
                    onClick={() => handleCopy(id, `uuid-${idx}`)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white p-1"
                    title="Copy UUID"
                  >
                    {copiedKey === `uuid-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
