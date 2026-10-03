import React, { useState, useMemo } from 'react';
import { Database, Copy, Check, Sparkles, Download, Maximize2, Minimize2, FileCode } from 'lucide-react';

const SAMPLE_SQL = `SELECT u.id, u.display_name, u.email, COUNT(r.id) AS total_requests, SUM(r.points_awarded) AS total_points FROM users u LEFT JOIN tool_requests r ON u.id = r.author_id WHERE u.status = 'active' AND (r.status = 'completed' OR r.status IS NULL) GROUP BY u.id, u.display_name, u.email HAVING COUNT(r.id) >= 2 ORDER BY total_points DESC LIMIT 50;`;

export const SqlFormatter: React.FC = () => {
  const [sqlInput, setSqlInput] = useState(SAMPLE_SQL);
  const [copied, setCopied] = useState(false);

  const formattedSql = useMemo(() => {
    if (!sqlInput.trim()) return '';
    let text = sqlInput.trim();

    // Standard SQL Keywords formatting
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'HAVING', 'GROUP BY', 'ORDER BY',
      'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'CROSS JOIN', 'JOIN',
      'ON', 'LIMIT', 'OFFSET', 'UNION ALL', 'UNION', 'INSERT INTO', 'VALUES',
      'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'DROP TABLE', 'ALTER TABLE'
    ];

    // Replace multiple whitespaces
    text = text.replace(/\s+/g, ' ');

    keywords.forEach((kw) => {
      const reg = new RegExp(`\\b${kw}\\b`, 'gi');
      text = text.replace(reg, `\n${kw.toUpperCase()}`);
    });

    // Indent clauses
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    const formattedLines = lines.map((line) => {
      const trimmed = line.trim();
      const isMajorClause = keywords.some(k => trimmed.toUpperCase().startsWith(k));
      return isMajorClause ? trimmed : `  ${trimmed}`;
    });

    return formattedLines.join('\n').trim();
  }, [sqlInput]);

  const minifiedSql = useMemo(() => {
    return sqlInput.replace(/\s+/g, ' ').trim();
  }, [sqlInput]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>SQL Query Beautifier & Minifier</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60 font-semibold">
                ANSI / PostgreSQL / MySQL
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Beautify, uppercase keywords, and compact complex SQL database queries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSqlInput(formattedSql)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
          >
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Format</span>
          </button>
          <button
            onClick={() => setSqlInput(minifiedSql)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
          >
            <Minimize2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Minify</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Input SQL</span>
            <button onClick={() => setSqlInput('')} className="text-[11px] text-slate-400 hover:text-rose-400">
              Clear
            </button>
          </div>
          <textarea
            value={sqlInput}
            onChange={(e) => setSqlInput(e.target.value)}
            rows={14}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-blue-300 focus:outline-hidden leading-relaxed"
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg flex flex-col">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Beautified Output</span>
            <button
              onClick={() => handleCopy(formattedSql)}
              className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-blue-400" />}
              <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
            </button>
          </div>
          <textarea
            readOnly
            value={formattedSql}
            rows={14}
            className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-emerald-300 focus:outline-hidden leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
