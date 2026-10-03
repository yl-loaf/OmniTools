import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  Copy,
  Check,
  Lock,
  FileText,
  Upload,
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  Hash
} from 'lucide-react';

export const CryptoEncoder: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'base64' | 'hash' | 'url'>('base64');

  // Base64 State
  const [base64Input, setBase64Input] = useState('Hello, OmniTools World! 🚀');
  const [base64Output, setBase64Output] = useState('');
  const [base64Mode, setBase64Mode] = useState<'encode' | 'decode'>('encode');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Hash State
  const [hashInput, setHashInput] = useState('SecureHashPassword_2026!');
  const [sha256, setSha256] = useState('');
  const [sha512, setSha512] = useState('');
  const [sha1, setSha1] = useState('');

  // URL State
  const [urlInput, setUrlInput] = useState('https://example.com/search?query=web utilities&category=developer tools&filter=active#results');
  const [urlOutput, setUrlOutput] = useState('');
  const [urlMode, setUrlMode] = useState<'encode' | 'decode'>('encode');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Handle Base64 Text
  useEffect(() => {
    try {
      if (base64Mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(base64Input)));
        setBase64Output(encoded);
      } else {
        const decoded = decodeURIComponent(escape(atob(base64Input)));
        setBase64Output(decoded);
      }
    } catch {
      setBase64Output('Error: Invalid string for Base64 operation.');
    }
  }, [base64Input, base64Mode]);

  // Handle Hashes using Web Crypto API
  useEffect(() => {
    async function calculateHashes() {
      if (!hashInput) {
        setSha256('');
        setSha512('');
        setSha1('');
        return;
      }
      const msgBuffer = new TextEncoder().encode(hashInput);

      // SHA-256
      const hashBuffer256 = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray256 = Array.from(new Uint8Array(hashBuffer256));
      setSha256(hashArray256.map(b => b.toString(16).padStart(2, '0')).join(''));

      // SHA-512
      const hashBuffer512 = await crypto.subtle.digest('SHA-512', msgBuffer);
      const hashArray512 = Array.from(new Uint8Array(hashBuffer512));
      setSha512(hashArray512.map(b => b.toString(16).padStart(2, '0')).join(''));

      // SHA-1
      const hashBuffer1 = await crypto.subtle.digest('SHA-1', msgBuffer);
      const hashArray1 = Array.from(new Uint8Array(hashBuffer1));
      setSha1(hashArray1.map(b => b.toString(16).padStart(2, '0')).join(''));
    }

    calculateHashes();
  }, [hashInput]);

  // Handle URL Encoding/Decoding
  useEffect(() => {
    try {
      if (urlMode === 'encode') {
        setUrlOutput(encodeURIComponent(urlInput));
      } else {
        setUrlOutput(decodeURIComponent(urlInput));
      }
    } catch {
      setUrlOutput('Error: Invalid URL component.');
    }
  }, [urlInput, urlMode]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setBase64Input(dataUrl);
      setBase64Output(dataUrl);
      if (file.type.startsWith('image/')) {
        setImagePreview(dataUrl);
      } else {
        setImagePreview(null);
      }
    };
    reader.readAsDataURL(file);
  };

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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Base64, Hash & URL Crypto Suite</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold">
                Web Crypto API
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Encode/decode Base64 text & files, compute SHA-256 / SHA-512 hashes, and sanitize URLs.
            </p>
          </div>
        </div>

        {/* Subtab selection */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setActiveSubTab('base64')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeSubTab === 'base64' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Base64 Studio
          </button>
          <button
            onClick={() => setActiveSubTab('hash')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeSubTab === 'hash' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Crypto Hashes
          </button>
          <button
            onClick={() => setActiveSubTab('url')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeSubTab === 'url' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            URL Encoder
          </button>
        </div>
      </div>

      {/* 1. Base64 Tab */}
      {activeSubTab === 'base64' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBase64Mode('encode')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  base64Mode === 'encode' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Encode to Base64
              </button>
              <button
                onClick={() => setBase64Mode('decode')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  base64Mode === 'decode' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Decode from Base64
              </button>
            </div>

            <label className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer border border-slate-700 transition">
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Upload Image/File</span>
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="text-xs font-bold text-slate-300">Input Data</div>
              <textarea
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                placeholder="Enter string or paste data URL..."
                rows={10}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-hidden"
              />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Base64 Output</span>
                <button
                  onClick={() => handleCopy(base64Output, 'b64')}
                  className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition"
                >
                  {copiedKey === 'b64' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-cyan-400" />}
                  <span>{copiedKey === 'b64' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                readOnly
                value={base64Output}
                rows={10}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-emerald-300 focus:outline-hidden"
              />
            </div>
          </div>

          {imagePreview && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
              <img src={imagePreview} alt="Base64 Preview" className="max-h-24 max-w-24 rounded-lg border border-slate-700 object-cover" />
              <div>
                <div className="text-xs font-bold text-white">Image Data URI Preview</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Ready to embed directly into HTML or CSS</div>
                <button
                  onClick={() => handleCopy(`<img src="${base64Output}" alt="Embedded image" />`, 'imgTag')}
                  className="mt-2 text-xs bg-slate-800 hover:bg-slate-700 text-blue-300 px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5"
                >
                  {copiedKey === 'imgTag' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy HTML &lt;img&gt; tag</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Crypto Hash Tab */}
      {activeSubTab === 'hash' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
            <label className="text-xs font-bold text-white uppercase tracking-wider">Input Plaintext</label>
            <input
              type="text"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              placeholder="Enter text to hash..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 font-mono text-xs text-white focus:outline-hidden"
            />
          </div>

          <div className="space-y-3">
            {/* SHA-256 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1.5 shadow-md">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 font-mono">SHA-256 (256-bit)</span>
                <button
                  onClick={() => handleCopy(sha256, 'sha256')}
                  className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition"
                >
                  {copiedKey === 'sha256' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-emerald-400" />}
                  <span>{copiedKey === 'sha256' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-slate-300 break-all select-all border border-slate-800">
                {sha256 || 'Generating...'}
              </div>
            </div>

            {/* SHA-512 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1.5 shadow-md">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-400 font-mono">SHA-512 (512-bit)</span>
                <button
                  onClick={() => handleCopy(sha512, 'sha512')}
                  className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition"
                >
                  {copiedKey === 'sha512' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-cyan-400" />}
                  <span>{copiedKey === 'sha512' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-slate-300 break-all select-all border border-slate-800">
                {sha512 || 'Generating...'}
              </div>
            </div>

            {/* SHA-1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1.5 shadow-md">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 font-mono">SHA-1 (160-bit Legacy)</span>
                <button
                  onClick={() => handleCopy(sha1, 'sha1')}
                  className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition"
                >
                  {copiedKey === 'sha1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-400" />}
                  <span>{copiedKey === 'sha1' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-slate-300 break-all select-all border border-slate-800">
                {sha1 || 'Generating...'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. URL Encoder Tab */}
      {activeSubTab === 'url' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-3">
            <button
              onClick={() => setUrlMode('encode')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                urlMode === 'encode' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Encode URL Component
            </button>
            <button
              onClick={() => setUrlMode('decode')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                urlMode === 'decode' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Decode URL Component
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="text-xs font-bold text-slate-300">Input URL / Query String</div>
              <textarea
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                rows={8}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-hidden"
              />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Output URL</span>
                <button
                  onClick={() => handleCopy(urlOutput, 'url')}
                  className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition"
                >
                  {copiedKey === 'url' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-cyan-400" />}
                  <span>{copiedKey === 'url' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                readOnly
                value={urlOutput}
                rows={8}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-emerald-300 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
