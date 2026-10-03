import React, { useState, useMemo } from 'react';
import { Clock, Copy, Check, Play, Sparkles, Calendar } from 'lucide-react';

const CRON_PRESETS = [
  { label: 'Every Minute', expr: '* * * * *', desc: 'Runs every single minute' },
  { label: 'Every 5 Minutes', expr: '*/5 * * * *', desc: 'Runs every 5 minutes' },
  { label: 'Every Hour (Top)', expr: '0 * * * *', desc: 'Runs at minute 0 of every hour' },
  { label: 'Daily at Midnight', expr: '0 0 * * *', desc: 'Runs at 00:00 every day' },
  { label: 'Every Monday 9 AM', expr: '0 9 * * 1', desc: 'Runs at 09:00 on Monday' },
  { label: '1st Day of Month', expr: '0 0 1 * *', desc: 'Runs at 00:00 on day 1 of month' },
  { label: 'Weekdays at 8:30 AM', expr: '30 8 * * 1-5', desc: 'Runs Mon-Fri at 08:30' },
];

export const CronGenerator: React.FC = () => {
  const [minute, setMinute] = useState('0');
  const [hour, setHour] = useState('12');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');
  const [copied, setCopied] = useState(false);

  const cronExpression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;

  // Human description
  const humanDescription = useMemo(() => {
    let desc = `At ${minute === '*' ? 'every minute' : `minute ${minute}`}`;
    if (hour !== '*') desc += `, past hour ${hour}:00`;
    if (dayOfMonth !== '*') desc += `, on day-of-month ${dayOfMonth}`;
    if (month !== '*') desc += `, in month ${month}`;
    if (dayOfWeek !== '*') desc += `, on weekday ${dayOfWeek}`;
    return desc;
  }, [minute, hour, dayOfMonth, month, dayOfWeek]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cronExpression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadPreset = (expr: string) => {
    const parts = expr.split(' ');
    if (parts.length === 5) {
      setMinute(parts[0]);
      setHour(parts[1]);
      setDayOfMonth(parts[2]);
      setMonth(parts[3]);
      setDayOfWeek(parts[4]);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Cron Expression Builder & Explainer</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60 font-semibold font-mono">
                Standard 5-Field
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Build cron expressions visually, translate to plain English, and schedule recurring tasks.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold transition shadow-md"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Cron Copied!' : 'Copy Cron Expression'}</span>
        </button>
      </div>

      {/* Main Display */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3 shadow-lg">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Cron Expression</div>
        <div className="text-3xl sm:text-4xl font-black font-mono text-amber-400 tracking-wider">
          {cronExpression}
        </div>
        <div className="text-sm font-semibold text-white bg-slate-950 border border-slate-800 py-2.5 px-4 rounded-xl max-w-lg mx-auto">
          "{humanDescription}"
        </div>
      </div>

      {/* Quick Presets */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Common Presets</div>
        <div className="flex flex-wrap gap-2">
          {CRON_PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => loadPreset(p.expr)}
              className="text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-700 transition flex items-center gap-2"
            >
              <span className="font-semibold">{p.label}</span>
              <code className="text-[11px] font-mono text-amber-300">{p.expr}</code>
            </button>
          ))}
        </div>
      </div>

      {/* 5 Field Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <label className="text-xs font-bold text-white">Minute (0-59)</label>
          <input
            type="text"
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-xs text-amber-400 text-center"
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <label className="text-xs font-bold text-white">Hour (0-23)</label>
          <input
            type="text"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-xs text-amber-400 text-center"
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <label className="text-xs font-bold text-white">Day of Month (1-31)</label>
          <input
            type="text"
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-xs text-amber-400 text-center"
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <label className="text-xs font-bold text-white">Month (1-12)</label>
          <input
            type="text"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-xs text-amber-400 text-center"
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <label className="text-xs font-bold text-white">Day of Week (0-6 Sun-Sat)</label>
          <input
            type="text"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-xs text-amber-400 text-center"
          />
        </div>
      </div>
    </div>
  );
};
