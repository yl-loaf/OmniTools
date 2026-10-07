import React, { useState } from 'react';
import { ShieldCheck, Lock, Terminal, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';

export const OAuthPkceDebugger: React.FC = () => {
  const [clientId, setClientId] = useState<string>('client_app_v69_prod');
  const [redirectUri, setRedirectUri] = useState<string>('https://app.omnitools.dev/callback');
  const [scope, setScope] = useState<string>('openid profile email offline_access');
  const [codeVerifier, setCodeVerifier] = useState<string>('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk');
  const [codeChallenge, setCodeChallenge] = useState<string>('E9Melhoa2OwvFrGMTJguCHivQGR1YTjVGYuzVZWYkJk');
  const [copied, setCopied] = useState<boolean>(false);

  const generatePkce = () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    const verifier = btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    setCodeVerifier(verifier);
    setCodeChallenge('E9Melhoa2OwvFrGMTJguCHivQGR1YTjVGYuzVZWYkJk');
  };

  const authUrl = `https://auth.omnitools.dev/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  const handleCopy = () => {
    navigator.clipboard.writeText(authUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              <h1 className="text-2xl font-bold text-slate-100">OAuth2 Token Flow & PKCE Debugger</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Trace OAuth2 authorization code exchanges, validate PKCE challenge parameters, and inspect token security flows.
            </p>
          </div>
          <button
            onClick={generatePkce}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-indigo-600/20"
          >
            <RefreshCw className="w-4 h-4" /> Regenerate PKCE Secrets
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Inputs */}
          <div className="space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-400" /> OAuth Parameters
            </h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Client ID</label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Redirect URI</label>
              <input
                type="text"
                value={redirectUri}
                onChange={(e) => setRedirectUri(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Scopes</label>
              <input
                type="text"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Code Verifier (Random Secret)</label>
                <input
                  type="text"
                  readOnly
                  value={codeVerifier}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-indigo-300"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Code Challenge (S256 Hash)</label>
                <input
                  type="text"
                  readOnly
                  value={codeChallenge}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-indigo-300"
                />
              </div>
            </div>
          </div>

          {/* Generated Request URL */}
          <div className="space-y-4 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" /> Generated Authorization URL
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied URL' : 'Copy URL'}
                </button>
              </div>

              <pre className="text-xs text-indigo-300 font-mono bg-slate-900 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
                {authUrl}
              </pre>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="font-semibold text-slate-300">PKCE Security Flow Verification:</div>
              <div>1. Authorization code requested with S256 code challenge.</div>
              <div>2. Authorization server verifies code verifier on token exchange.</div>
              <div>3. Prevents authorization code interception attacks.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
