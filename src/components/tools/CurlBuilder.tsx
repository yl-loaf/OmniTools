import React, { useState, useMemo } from 'react';
import { Terminal, Copy, Check, Sparkles, Send, Layers } from 'lucide-react';

export const CurlBuilder: React.FC = () => {
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'>('POST');
  const [url, setUrl] = useState('https://api.example.com/v1/users');
  const [headers, setHeaders] = useState('Authorization: Bearer my_secret_token_123\nContent-Type: application/json');
  const [body, setBody] = useState('{\n  "name": "Alex Contributor",\n  "role": "Architect"\n}');
  const [activeTab, setActiveTab] = useState<'curl' | 'fetch' | 'python'>('curl');
  const [copied, setCopied] = useState(false);

  // Generate cURL command
  const curlCommand = useMemo(() => {
    let cmd = `curl -X ${method} "${url}"`;
    const headerLines = headers.split('\n').filter(h => h.trim().length > 0);
    headerLines.forEach(h => {
      cmd += ` \\\n  -H "${h.trim()}"`;
    });
    if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
      cmd += ` \\\n  -d '${body.trim()}'`;
    }
    return cmd;
  }, [method, url, headers, body]);

  // Generate JS fetch
  const fetchCode = useMemo(() => {
    const headerObj: any = {};
    headers.split('\n').forEach(h => {
      const idx = h.indexOf(':');
      if (idx > -1) {
        headerObj[h.slice(0, idx).trim()] = h.slice(idx + 1).trim();
      }
    });

    return `const response = await fetch("${url}", {
  method: "${method}",
  headers: ${JSON.stringify(headerObj, null, 4)},
  ${['POST', 'PUT', 'PATCH'].includes(method) && body.trim() ? `body: JSON.stringify(${body.trim()})\n` : ''}});
const data = await response.json();
console.log(data);`;
  }, [method, url, headers, body]);

  // Generate Python requests
  const pythonCode = useMemo(() => {
    return `import requests

url = "${url}"
headers = {
${headers.split('\n').filter(h => h.includes(':')).map(h => {
  const idx = h.indexOf(':');
  return `    "${h.slice(0, idx).trim()}": "${h.slice(idx + 1).trim()}"`;
}).join(',\n')}
}
${['POST', 'PUT', 'PATCH'].includes(method) && body.trim() ? `payload = ${body.trim()}\nresponse = requests.${method.toLowerCase()}(url, json=payload, headers=headers)` : `response = requests.${method.toLowerCase()}(url, headers=headers)`}

print(response.status_code)
print(response.json())`;
  }, [method, url, headers, body]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>cURL Command & API Code Generator</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60 font-semibold">
                cURL &rarr; Fetch / Python
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Build REST API requests and generate instant cURL, JavaScript fetch, and Python scripts.
            </p>
          </div>
        </div>

        <button
          onClick={() => handleCopy(activeTab === 'curl' ? curlCommand : activeTab === 'fetch' ? fetchCode : pythonCode)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition shadow-md"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy Code'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Request Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center gap-2">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-emerald-400 font-mono focus:outline-hidden"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/endpoint"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-xs text-white focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-semibold">Request Headers (Key: Value per line)</label>
            <textarea
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-purple-300 focus:outline-hidden"
            />
          </div>

          {['POST', 'PUT', 'PATCH'].includes(method) && (
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold">JSON Request Body</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-cyan-300 focus:outline-hidden"
              />
            </div>
          )}
        </div>

        {/* Code Output Tabs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('curl')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  activeTab === 'curl' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                cURL
              </button>
              <button
                onClick={() => setActiveTab('fetch')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  activeTab === 'fetch' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                JavaScript Fetch
              </button>
              <button
                onClick={() => setActiveTab('python')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  activeTab === 'python' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Python Requests
              </button>
            </div>
          </div>

          <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 flex-1 overflow-x-auto leading-relaxed">
            {activeTab === 'curl' ? curlCommand : activeTab === 'fetch' ? fetchCode : pythonCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
