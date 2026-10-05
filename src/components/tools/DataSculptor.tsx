import React, { useState } from 'react';
import { Sparkles, Copy, Check, Database, RefreshCw } from 'lucide-react';

export function DataSculptor() {
  const [count, setCount] = useState(5);
  const [schemaType, setSchemaType] = useState('users');
  const [copied, setCopied] = useState(false);

  const generateData = () => {
    const list = [];
    for (let i = 1; i <= count; i++) {
      if (schemaType === 'users') {
        list.push({
          id: `usr_${1000 + i}`,
          name: ['Alex Rivers', 'Elena Rostova', 'Marcus Vance', 'Sarah Jenkins', 'David Chen'][i % 5],
          email: `user${i}@example.com`,
          role: i === 1 ? 'admin' : 'member',
          status: i % 2 === 0 ? 'active' : 'pending',
          createdAt: new Date(Date.now() - i * 86400000).toISOString(),
        });
      } else if (schemaType === 'products') {
        list.push({
          productId: `prod_${500 + i}`,
          title: ['Mechanical Keyboard', 'UltraWide Monitor', 'Ergonomic Chair', 'USB-C Hub', 'Wireless Mouse'][i % 5],
          price: parseFloat((Math.random() * 150 + 29.99).toFixed(2)),
          inStock: i % 2 === 0,
          rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
        });
      } else {
        list.push({
          transactionId: `txn_${9000 + i}`,
          amount: parseFloat((Math.random() * 500 + 10).toFixed(2)),
          currency: 'USD',
          status: 'completed',
          timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        });
      }
    }
    return JSON.stringify(list, null, 2);
  };

  const [dataOutput, setDataOutput] = useState(generateData());

  const handleRegenerate = () => {
    setDataOutput(generateData());
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(dataOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">Data Sculptor (Mock Data Generator)</h1>
              <p className="text-xs text-slate-400">Intelligently generates dynamic mock data based on existing API responses or user-defined schemas without a live backend.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRegenerate}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-2 border border-slate-700 transition"
            >
              <RefreshCw className="w-4 h-4" /> Regenerate
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium flex items-center gap-2 shadow-lg transition"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Data' : 'Copy JSON'}
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Schema Template</label>
            <select
              value={schemaType}
              onChange={(e) => {
                setSchemaType(e.target.value);
                setTimeout(handleRegenerate, 50);
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="users">User Profiles</option>
              <option value="products">E-Commerce Products</option>
              <option value="transactions">Financial Transactions</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Item Count: {count}</label>
            <input
              type="range"
              min="1"
              max="20"
              value={count}
              onChange={(e) => {
                setCount(parseInt(e.target.value));
                setTimeout(handleRegenerate, 50);
              }}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>

        {/* Output */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-300">Generated Mock Data Payload</label>
          <pre className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 h-[320px] overflow-auto">
            {dataOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}
