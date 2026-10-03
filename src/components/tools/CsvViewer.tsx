import React, { useState, useMemo } from 'react';
import { Table, Copy, Check, Download, Search, FileSpreadsheet, Sparkles, Filter } from 'lucide-react';

const SAMPLE_CSV = `id,name,role,department,salary,status
101,Alex Chen,Senior Architect,Engineering,145000,Active
102,Elena Rostova,Lead Designer,Product,132000,Active
103,Marcus Kane,Backend Engineer,Platform,128000,On Leave
104,Sophia Zhang,Data Scientist,Analytics,138000,Active
105,Liam Davies,DevOps Specialist,Infrastructure,130000,Active
106,Aria Thorne,Product Manager,Growth,140000,Active`;

export const CsvViewer: React.FC = () => {
  const [csvRaw, setCsvRaw] = useState(SAMPLE_CSV);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Parse CSV
  const parsedData = useMemo(() => {
    if (!csvRaw.trim()) return { headers: [], rows: [] };
    const lines = csvRaw.trim().split('\n');
    if (lines.length === 0) return { headers: [], rows: [] };

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const rows = lines.slice(1).map(line => {
      return line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
    });

    return { headers, rows };
  }, [csvRaw]);

  // Filter rows
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return parsedData.rows;
    const q = searchQuery.toLowerCase();
    return parsedData.rows.filter(row =>
      row.some(cell => cell.toLowerCase().includes(q))
    );
  }, [parsedData.rows, searchQuery]);

  // Convert to JSON
  const jsonOutput = useMemo(() => {
    const list = parsedData.rows.map(row => {
      const obj: any = {};
      parsedData.headers.forEach((h, idx) => {
        obj[h] = row[idx] || '';
      });
      return obj;
    });
    return JSON.stringify(list, null, 2);
  }, [parsedData]);

  // Convert to Markdown Table
  const markdownOutput = useMemo(() => {
    if (parsedData.headers.length === 0) return '';
    const headerLine = `| ${parsedData.headers.join(' | ')} |`;
    const delimiterLine = `| ${parsedData.headers.map(() => '---').join(' | ')} |`;
    const rowLines = parsedData.rows.map(r => `| ${r.join(' | ')} |`);
    return [headerLine, delimiterLine, ...rowLines].join('\n');
  }, [parsedData]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([csvRaw], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <FileSpreadsheet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>CSV & TSV Data Grid Studio</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold">
                {parsedData.rows.length} Rows • {parsedData.headers.length} Columns
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Inspect, search, sort, and convert CSV data to JSON and Markdown tables.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleCopy(jsonOutput, 'json')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-semibold border border-slate-700 transition"
          >
            {copiedType === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy as JSON</span>
          </button>
          <button
            onClick={() => handleCopy(markdownOutput, 'md')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-xl text-xs font-semibold border border-slate-700 transition"
          >
            {copiedType === 'md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Markdown Table</span>
          </button>
          <button
            onClick={handleDownload}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Raw CSV Data Input</span>
          <button onClick={() => setCsvRaw(SAMPLE_CSV)} className="text-[11px] text-slate-400 hover:text-emerald-400">
            Reset Sample
          </button>
        </div>
        <textarea
          value={csvRaw}
          onChange={(e) => setCsvRaw(e.target.value)}
          rows={6}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-emerald-300 focus:outline-hidden leading-relaxed"
        />
      </div>

      {/* Interactive Table View */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Interactive Spreadsheet Table</h3>
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 w-72">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search table rows..."
              className="w-full bg-transparent text-xs text-white focus:outline-hidden"
            />
          </div>
        </div>

        <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold sticky top-0 border-b border-slate-800">
              <tr>
                {parsedData.headers.map((h, idx) => (
                  <th key={idx} className="p-3 border-r border-slate-800/60 last:border-r-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
              {filteredRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-800/30">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-3 border-r border-slate-800/40 last:border-r-0 truncate max-w-[200px]">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
