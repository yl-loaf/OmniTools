import React, { useState, useMemo } from 'react';
import { GitCompare, Copy, Check, Sparkles, RefreshCw, ArrowRight, Layers } from 'lucide-react';

const SAMPLE_ORIGINAL = `function calculateTotal(items, discountRate) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  if (discountRate > 0) {
    total = total - (total * discountRate);
  }
  return total;
}`;

const SAMPLE_MODIFIED = `function calculateTotal(items: CartItem[], discountRate: number = 0): number {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = discountRate > 0 ? subtotal * discountRate : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);
  return Number(finalTotal.toFixed(2));
}`;

export const DiffChecker: React.FC = () => {
  const [textA, setTextA] = useState(SAMPLE_ORIGINAL);
  const [textB, setTextB] = useState(SAMPLE_MODIFIED);
  const [copied, setCopied] = useState(false);

  // Line-by-line diff comparison
  const diffLines = useMemo(() => {
    const linesA = textA.split('\n');
    const linesB = textB.split('\n');
    const maxLen = Math.max(linesA.length, linesB.length);
    const result: Array<{ lineNum: number; left: string | null; right: string | null; type: 'same' | 'modified' | 'added' | 'removed' }> = [];

    let additions = 0;
    let deletions = 0;
    let modifications = 0;

    for (let i = 0; i < maxLen; i++) {
      const a = linesA[i];
      const b = linesB[i];

      if (a === b) {
        result.push({ lineNum: i + 1, left: a, right: b, type: 'same' });
      } else if (a !== undefined && b !== undefined) {
        result.push({ lineNum: i + 1, left: a, right: b, type: 'modified' });
        modifications++;
      } else if (a === undefined) {
        result.push({ lineNum: i + 1, left: null, right: b, type: 'added' });
        additions++;
      } else if (b === undefined) {
        result.push({ lineNum: i + 1, left: a, right: null, type: 'removed' });
        deletions++;
      }
    }

    return { result, additions, deletions, modifications };
  }, [textA, textB]);

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <GitCompare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Text & Code Diff Inspector</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60 font-semibold">
                Side-by-Side
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Compare differences, edits, additions, and deletions between two text or code files.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-emerald-400 font-bold">+{diffLines.additions} added</span>
          <span className="text-rose-400 font-bold">-{diffLines.deletions} removed</span>
          <span className="text-amber-400 font-bold">~{diffLines.modifications} changed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Input */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Original Text / File A</span>
            <button onClick={() => setTextA('')} className="text-[11px] text-slate-400 hover:text-rose-400">
              Clear
            </button>
          </div>
          <textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            rows={10}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 focus:outline-hidden leading-relaxed"
          />
        </div>

        {/* Right Input */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Modified Text / File B</span>
            <button onClick={() => setTextB('')} className="text-[11px] text-slate-400 hover:text-rose-400">
              Clear
            </button>
          </div>
          <textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            rows={10}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 focus:outline-hidden leading-relaxed"
          />
        </div>
      </div>

      {/* Visual Diff Output */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-xl">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Visual Line Diff</h3>
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto max-h-[360px] divide-y divide-slate-800/40 font-mono text-xs">
          {diffLines.result.map((row) => (
            <div
              key={row.lineNum}
              className={`grid grid-cols-12 py-1 px-3 items-center ${
                row.type === 'added'
                  ? 'bg-emerald-950/40 text-emerald-300'
                  : row.type === 'removed'
                  ? 'bg-rose-950/40 text-rose-300 line-through'
                  : row.type === 'modified'
                  ? 'bg-amber-950/30 text-amber-200'
                  : 'text-slate-400'
              }`}
            >
              <div className="col-span-1 text-[10px] text-slate-600 select-none">{row.lineNum}</div>
              <div className="col-span-5 pr-2 truncate">{row.left !== null ? row.left : ''}</div>
              <div className="col-span-1 text-center text-slate-600 select-none">
                {row.type === 'added' ? '+' : row.type === 'removed' ? '-' : row.type === 'modified' ? '≠' : '|'}
              </div>
              <div className="col-span-5 pl-2 truncate">{row.right !== null ? row.right : ''}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
