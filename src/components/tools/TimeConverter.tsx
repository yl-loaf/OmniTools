import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Copy,
  Check,
  Globe,
  Calendar,
  ArrowRightLeft,
  Sparkles,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';

const TIMEZONES = [
  { name: 'San Francisco (PT)', tz: 'America/Los_Angeles' },
  { name: 'New York (ET)', tz: 'America/New_York' },
  { name: 'London (GMT/BST)', tz: 'Europe/London' },
  { name: 'Paris (CET)', tz: 'Europe/Paris' },
  { name: 'Dubai (GST)', tz: 'Asia/Dubai' },
  { name: 'Singapore / HK (SGT)', tz: 'Asia/Singapore' },
  { name: 'Tokyo (JST)', tz: 'Asia/Tokyo' },
  { name: 'Sydney (AEST)', tz: 'Australia/Sydney' },
];

export const TimeConverter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'unix' | 'world' | 'diff'>('unix');
  const [now, setNow] = useState<Date>(new Date());
  const [isLiveTicker, setIsLiveTicker] = useState(true);

  // Unix conversion states
  const [timestampInput, setTimestampInput] = useState(Math.floor(Date.now() / 1000).toString());
  const [dateInput, setDateInput] = useState(new Date().toISOString().slice(0, 16));

  // Date difference state
  const [diffDate1, setDiffDate1] = useState(new Date().toISOString().slice(0, 10));
  const [diffDate2, setDiffDate2] = useState(new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 10));

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live ticker
  useEffect(() => {
    if (!isLiveTicker) return;
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [isLiveTicker]);

  // Parse Timestamp
  const parsedTimestamp = useMemo(() => {
    const num = Number(timestampInput);
    if (!num || isNaN(num)) return null;
    // Check if seconds or milliseconds
    const date = num > 1e11 ? new Date(num) : new Date(num * 1000);
    if (isNaN(date.getTime())) return null;

    return {
      utc: date.toUTCString(),
      iso: date.toISOString(),
      local: date.toString(),
      relative: getRelativeTimeString(date),
    };
  }, [timestampInput]);

  function getRelativeTimeString(date: Date): string {
    const diffSec = Math.round((date.getTime() - Date.now()) / 1000);
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second');
    const diffMin = Math.round(diffSec / 60);
    if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
    const diffHr = Math.round(diffMin / 60);
    if (Math.abs(diffHr) < 24) return rtf.format(diffHr, 'hour');
    const diffDay = Math.round(diffHr / 24);
    return rtf.format(diffDay, 'day');
  }

  // Parse Date to Timestamp
  const convertedTimestamp = useMemo(() => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return null;
    return {
      seconds: Math.floor(d.getTime() / 1000),
      millis: d.getTime(),
    };
  }, [dateInput]);

  // Date difference calculation
  const dateDiffResult = useMemo(() => {
    const d1 = new Date(diffDate1);
    const d2 = new Date(diffDate2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

    const diffMs = Math.abs(d2.getTime() - d1.getTime());
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = (totalDays / 7).toFixed(1);
    const totalMonths = (totalDays / 30.4375).toFixed(1);
    const totalHours = totalDays * 24;

    return { totalDays, totalWeeks, totalMonths, totalHours };
  }, [diffDate1, diffDate2]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Unix Timestamp & World Clock Lab</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold font-mono">
                {Math.floor(now.getTime() / 1000)}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Convert epoch timestamps, compare multi-timezone clocks, and calculate date durations.
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('unix')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'unix' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Unix Converter
          </button>
          <button
            onClick={() => setActiveTab('world')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'world' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            World Clocks
          </button>
          <button
            onClick={() => setActiveTab('diff')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'diff' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Date Difference
          </button>
        </div>
      </div>

      {/* 1. Unix Timestamp Converter */}
      {activeTab === 'unix' && (
        <div className="space-y-4">
          {/* Live Epoch Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase">Current Epoch Timestamp</div>
                <div className="font-mono text-xl font-black text-white">
                  {Math.floor(now.getTime() / 1000)}{' '}
                  <span className="text-xs text-slate-500 font-normal font-sans">({now.getTime()} ms)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setTimestampInput(Math.floor(Date.now() / 1000).toString())}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-semibold border border-slate-700 transition"
              >
                Set to Now
              </button>
              <button
                onClick={() => handleCopy(Math.floor(now.getTime() / 1000).toString(), 'nowEpoch')}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition"
              >
                {copiedKey === 'nowEpoch' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Now</span>
              </button>
            </div>
          </div>

          {/* Converters Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Timestamp to Date */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Timestamp &rarr; Human Date</h3>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Unix Timestamp (Seconds or Milliseconds)</label>
                <input
                  type="text"
                  value={timestampInput}
                  onChange={(e) => setTimestampInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-xs text-cyan-300 focus:outline-hidden"
                />
              </div>

              {parsedTimestamp && (
                <div className="space-y-2 pt-2 text-xs font-mono">
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">ISO 8601 (UTC)</div>
                      <div className="text-emerald-400">{parsedTimestamp.iso}</div>
                    </div>
                    <button onClick={() => handleCopy(parsedTimestamp.iso, 'iso')} className="text-slate-500 hover:text-white">
                      {copiedKey === 'iso' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Local Timezone</div>
                      <div className="text-white">{parsedTimestamp.local}</div>
                    </div>
                    <button onClick={() => handleCopy(parsedTimestamp.local, 'local')} className="text-slate-500 hover:text-white">
                      {copiedKey === 'local' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Relative Timing</div>
                    <div className="text-amber-300 font-sans font-semibold">{parsedTimestamp.relative}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Date to Timestamp */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Human Date &rarr; Timestamp</h3>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Date & Time Selector</label>
                <input
                  type="datetime-local"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-xs text-white focus:outline-hidden"
                />
              </div>

              {convertedTimestamp && (
                <div className="space-y-2 pt-2 text-xs font-mono">
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Seconds (Standard Unix)</div>
                      <div className="text-cyan-400 font-bold text-sm">{convertedTimestamp.seconds}</div>
                    </div>
                    <button onClick={() => handleCopy(convertedTimestamp.seconds.toString(), 'sec')} className="text-slate-500 hover:text-white">
                      {copiedKey === 'sec' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Milliseconds (JS Epoch)</div>
                      <div className="text-purple-400 font-bold text-sm">{convertedTimestamp.millis}</div>
                    </div>
                    <button onClick={() => handleCopy(convertedTimestamp.millis.toString(), 'ms')} className="text-slate-500 hover:text-white">
                      {copiedKey === 'ms' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. World Timezone Clocks */}
      {activeTab === 'world' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIMEZONES.map((tzItem, idx) => {
            const timeString = new Intl.DateTimeFormat('en-US', {
              timeZone: tzItem.tz,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            }).format(now);

            const dateString = new Intl.DateTimeFormat('en-US', {
              timeZone: tzItem.tz,
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            }).format(now);

            return (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" /> {tzItem.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{dateString}</span>
                </div>
                <div className="text-2xl font-black font-mono text-emerald-400">{timeString}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Date Difference Calculator */}
      {activeTab === 'diff' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Calculate Days & Duration Between Dates</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Start Date</label>
              <input
                type="date"
                value={diffDate1}
                onChange={(e) => setDiffDate1(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-hidden"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">End Date</label>
              <input
                type="date"
                value={diffDate2}
                onChange={(e) => setDiffDate2(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-hidden"
              />
            </div>
          </div>

          {dateDiffResult && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Days</div>
                <div className="text-xl font-black text-cyan-400 font-mono mt-1">{dateDiffResult.totalDays} days</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Weeks</div>
                <div className="text-xl font-bold text-purple-400 font-mono mt-1">{dateDiffResult.totalWeeks} wks</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Months</div>
                <div className="text-xl font-bold text-amber-400 font-mono mt-1">{dateDiffResult.totalMonths} mos</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Hours</div>
                <div className="text-xl font-bold text-emerald-400 font-mono mt-1">{dateDiffResult.totalHours.toLocaleString()} hrs</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
