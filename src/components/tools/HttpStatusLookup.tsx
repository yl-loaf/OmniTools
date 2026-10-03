import React, { useState, useMemo } from 'react';
import { Search, Server, Copy, Check, Sparkles, Filter } from 'lucide-react';

const HTTP_CODES = [
  { code: 200, name: 'OK', category: '2xx Success', desc: 'Standard response for successful HTTP requests.' },
  { code: 201, name: 'Created', category: '2xx Success', desc: 'Request fulfilled and new resource created.' },
  { code: 204, name: 'No Content', category: '2xx Success', desc: 'Request succeeded but returns no response body.' },
  { code: 301, name: 'Moved Permanently', category: '3xx Redirection', desc: 'Resource URI permanently changed to a new address.' },
  { code: 302, name: 'Found (Temporary Redirect)', category: '3xx Redirection', desc: 'URI of requested resource has been changed temporarily.' },
  { code: 304, name: 'Not Modified', category: '3xx Redirection', desc: 'Client has cached version; no need to retransmit payload.' },
  { code: 400, name: 'Bad Request', category: '4xx Client Error', desc: 'Server cannot process request due to client syntax error.' },
  { code: 401, name: 'Unauthorized', category: '4xx Client Error', desc: 'Authentication required or invalid token credentials.' },
  { code: 403, name: 'Forbidden', category: '4xx Client Error', desc: 'Authenticated but insufficient permission/RBAC access.' },
  { code: 404, name: 'Not Found', category: '4xx Client Error', desc: 'Requested resource could not be found on the server.' },
  { code: 405, name: 'Method Not Allowed', category: '4xx Client Error', desc: 'Request method (e.g. DELETE) not supported on endpoint.' },
  { code: 409, name: 'Conflict', category: '4xx Client Error', desc: 'Request conflicts with current state (e.g. duplicate key).' },
  { code: 422, name: 'Unprocessable Entity', category: '4xx Client Error', desc: 'Syntactically correct but semantic validation errors.' },
  { code: 429, name: 'Too Many Requests', category: '4xx Client Error', desc: 'User has exceeded rate limiting threshold.' },
  { code: 500, name: 'Internal Server Error', category: '5xx Server Error', desc: 'Generic error when server encountered an unhandled exception.' },
  { code: 502, name: 'Bad Gateway', category: '5xx Server Error', desc: 'Invalid response from upstream gateway/proxy server.' },
  { code: 503, name: 'Service Unavailable', category: '5xx Server Error', desc: 'Server is temporarily overloaded or down for maintenance.' },
  { code: 504, name: 'Gateway Timeout', category: '5xx Server Error', desc: 'Upstream server did not respond in time.' },
];

export const HttpStatusLookup: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filteredCodes = useMemo(() => {
    return HTTP_CODES.filter(item => {
      const matchesSearch = item.code.toString().includes(search) ||
                            item.name.toLowerCase().includes(search.toLowerCase()) ||
                            item.desc.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'all' || item.category.startsWith(activeCategory);
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const handleCopy = (code: number, name: string) => {
    navigator.clipboard.writeText(`${code} ${name}`);
    setCopiedKey(`${code}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Server className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>HTTP Status Codes Reference & Guide</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60 font-semibold">
                RFC 7231 & REST API
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Lookup API response codes, error classifications, and client troubleshooting definitions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search code (e.g. 404, 500, Auth)..."
            className="w-full bg-transparent text-xs text-white focus:outline-hidden"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Statuses' },
          { id: '2xx', label: '2xx Success' },
          { id: '3xx', label: '3xx Redirection' },
          { id: '4xx', label: '4xx Client Errors' },
          { id: '5xx', label: '5xx Server Errors' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl font-semibold border transition shrink-0 ${
              activeCategory === cat.id
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Codes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCodes.map((item) => {
          const is2xx = item.code >= 200 && item.code < 300;
          const is3xx = item.code >= 300 && item.code < 400;
          const is4xx = item.code >= 400 && item.code < 500;
          const is5xx = item.code >= 500;

          return (
            <div
              key={item.code}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xl font-black font-mono ${
                    is2xx ? 'text-emerald-400' : is3xx ? 'text-cyan-400' : is4xx ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {item.code}
                  </span>
                  <button
                    onClick={() => handleCopy(item.code, item.name)}
                    className="text-slate-500 hover:text-white p-1 rounded-lg"
                    title="Copy status"
                  >
                    {copiedKey === `${item.code}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <h4 className="text-sm font-bold text-white">{item.name}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
                {item.category}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
