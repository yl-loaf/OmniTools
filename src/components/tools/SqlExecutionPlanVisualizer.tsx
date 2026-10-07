import React, { useState } from 'react';
import { Database, Sparkles, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

export const SqlExecutionPlanVisualizer: React.FC = () => {
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT u.id, u.email, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.created_at > \'2026-01-01\' ORDER BY o.total DESC;');
  const [analyzed, setAnalyzed] = useState<boolean>(true);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <h1 className="text-2xl font-bold text-slate-100">SQL Execution Plan Visualizer & Index Advisor</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Analyze raw SQL queries and schema definitions to estimate execution costs and recommend optimal indexes.
            </p>
          </div>
          <button
            onClick={() => setAnalyzed(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-amber-600/20"
          >
            <Database className="w-4 h-4" /> Analyze Execution Plan
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Query Input */}
          <div className="space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" /> SQL Query Input
            </h3>
            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              rows={6}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
            />
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <div>Estimated Cost: 1,480.25 (High)</div>
              <div>Estimated Rows: 24,500 records</div>
            </div>
          </div>

          {/* Execution Tree & Index Advice */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Index Advisor & Bottleneck Diagnostics
            </h3>

            <div className="space-y-3">
              <div className="bg-slate-950 p-4 rounded-xl border border-amber-900/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <ShieldAlert className="w-4 h-4" /> Full Table Scan Detected on `orders`
                </div>
                <p className="text-xs text-slate-300">
                  The query performs a sequential scan on the <code className="text-amber-300">orders</code> table due to missing foreign key indexing on <code className="text-amber-300">user_id</code>.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Recommended Index Creation SQL
                </div>
                <pre className="text-xs font-mono text-emerald-300 bg-slate-900 p-3 rounded-lg overflow-x-auto">
                  {`CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_users_created_at ON users(created_at);`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
