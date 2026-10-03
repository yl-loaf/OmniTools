import React, { useState, useMemo } from 'react';
import { Terminal, Copy, Check, Shield, Sparkles } from 'lucide-react';

export const ChmodCalculator: React.FC = () => {
  // Permissions state [read, write, execute]
  const [owner, setOwner] = useState({ r: true, w: true, x: true }); // 7
  const [group, setGroup] = useState({ r: true, w: false, x: true }); // 5
  const [others, setOthers] = useState({ r: true, w: false, x: true }); // 5
  const [fileName, setFileName] = useState('script.sh');
  const [copied, setCopied] = useState(false);

  // Compute octal
  const octal = useMemo(() => {
    const o = (owner.r ? 4 : 0) + (owner.w ? 2 : 0) + (owner.x ? 1 : 0);
    const g = (group.r ? 4 : 0) + (group.w ? 2 : 0) + (group.x ? 1 : 0);
    const pub = (others.r ? 4 : 0) + (others.w ? 2 : 0) + (others.x ? 1 : 0);
    return `${o}${g}${pub}`;
  }, [owner, group, others]);

  // Compute symbolic (rwxr-xr-x)
  const symbolic = useMemo(() => {
    const o = `${owner.r ? 'r' : '-'}${owner.w ? 'w' : '-'}${owner.x ? 'x' : '-'}`;
    const g = `${group.r ? 'r' : '-'}${group.w ? 'w' : '-'}${group.x ? 'x' : '-'}`;
    const pub = `${others.r ? 'r' : '-'}${others.w ? 'w' : '-'}${others.x ? 'x' : '-'}`;
    return `${o}${g}${pub}`;
  }, [owner, group, others]);

  const chmodCommand = `chmod ${octal} ${fileName}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(chmodCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadPreset = (o: number, g: number, pub: number) => {
    setOwner({ r: (o & 4) !== 0, w: (o & 2) !== 0, x: (o & 1) !== 0 });
    setGroup({ r: (g & 4) !== 0, w: (g & 2) !== 0, x: (g & 1) !== 0 });
    setOthers({ r: (pub & 4) !== 0, w: (pub & 2) !== 0, x: (pub & 1) !== 0 });
  };

  return (
    <div className="space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Linux Permissions & `chmod` Calculator</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold font-mono">
                {octal} ({symbolic})
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Calculate numeric and symbolic permissions for Linux/macOS files and directories.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition shadow-md"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Command Copied!' : 'Copy chmod Command'}</span>
        </button>
      </div>

      {/* Result Display Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Generated Terminal Command</div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
            {chmodCommand}
          </div>
        </div>
        <div className="text-right font-mono text-sm bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-slate-300">
          Symbolic: <span className="text-cyan-300 font-bold">{symbolic}</span>
        </div>
      </div>

      {/* Presets */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-slate-400 mr-2">Presets:</span>
        {[
          { label: '755 (Exec Script/Folder)', o: 7, g: 5, pub: 5 },
          { label: '644 (Standard File/Doc)', o: 6, g: 4, pub: 4 },
          { label: '600 (Private SSH Key)', o: 6, g: 0, pub: 0 },
          { label: '777 (Full Access/Dangerous)', o: 7, g: 7, pub: 7 },
          { label: '700 (Private Executable)', o: 7, g: 0, pub: 0 },
        ].map((p, idx) => (
          <button
            key={idx}
            onClick={() => loadPreset(p.o, p.g, p.pub)}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 transition"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Permission Checkboxes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Owner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Owner (User)</h3>
            <span className="font-mono text-xs font-bold text-emerald-400">
              {(owner.r ? 4 : 0) + (owner.w ? 2 : 0) + (owner.x ? 1 : 0)}
            </span>
          </div>
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={owner.r}
                onChange={(e) => setOwner({ ...owner, r: e.target.checked })}
                className="rounded text-emerald-500"
              />
              <span className="text-slate-200">Read (r - 4)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={owner.w}
                onChange={(e) => setOwner({ ...owner, w: e.target.checked })}
                className="rounded text-emerald-500"
              />
              <span className="text-slate-200">Write (w - 2)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={owner.x}
                onChange={(e) => setOwner({ ...owner, x: e.target.checked })}
                className="rounded text-emerald-500"
              />
              <span className="text-slate-200">Execute (x - 1)</span>
            </label>
          </div>
        </div>

        {/* Group */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Group</h3>
            <span className="font-mono text-xs font-bold text-cyan-400">
              {(group.r ? 4 : 0) + (group.w ? 2 : 0) + (group.x ? 1 : 0)}
            </span>
          </div>
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={group.r}
                onChange={(e) => setGroup({ ...group, r: e.target.checked })}
                className="rounded text-cyan-500"
              />
              <span className="text-slate-200">Read (r - 4)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={group.w}
                onChange={(e) => setGroup({ ...group, w: e.target.checked })}
                className="rounded text-cyan-500"
              />
              <span className="text-slate-200">Write (w - 2)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={group.x}
                onChange={(e) => setGroup({ ...group, x: e.target.checked })}
                className="rounded text-cyan-500"
              />
              <span className="text-slate-200">Execute (x - 1)</span>
            </label>
          </div>
        </div>

        {/* Others / Public */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Public (Others)</h3>
            <span className="font-mono text-xs font-bold text-amber-400">
              {(others.r ? 4 : 0) + (others.w ? 2 : 0) + (others.x ? 1 : 0)}
            </span>
          </div>
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={others.r}
                onChange={(e) => setOthers({ ...others, r: e.target.checked })}
                className="rounded text-amber-500"
              />
              <span className="text-slate-200">Read (r - 4)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={others.w}
                onChange={(e) => setOthers({ ...others, w: e.target.checked })}
                className="rounded text-amber-500"
              />
              <span className="text-slate-200">Write (w - 2)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={others.x}
                onChange={(e) => setOthers({ ...others, x: e.target.checked })}
                className="rounded text-amber-500"
              />
              <span className="text-slate-200">Execute (x - 1)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
