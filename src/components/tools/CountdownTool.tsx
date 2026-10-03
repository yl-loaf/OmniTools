import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Calendar, Sparkles, AlertCircle } from 'lucide-react';

interface CountdownEvent {
  id: string;
  title: string;
  targetDate: string; // ISO string
  category: string;
}

export const CountdownTool: React.FC = () => {
  const [events, setEvents] = useState<CountdownEvent[]>(() => {
    try {
      const saved = localStorage.getItem('omnitools_countdown_events');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'evt-1',
        title: 'New Year Celebration 🎉',
        targetDate: new Date(new Date().getFullYear() + 1, 0, 1, 0, 0, 0).toISOString(),
        category: 'Holiday',
      },
      {
        id: 'evt-2',
        title: 'Product Launch v2.0 🚀',
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Work',
      },
    ];
  });

  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newCategory, setNewCategory] = useState('Personal');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('omnitools_countdown_events', JSON.stringify(events));
  }, [events]);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;

    const newEvt: CountdownEvent = {
      id: `evt-${Date.now()}`,
      title: newTitle.trim(),
      targetDate: new Date(newDate).toISOString(),
      category: newCategory,
    };

    setEvents([newEvt, ...events]);
    setNewTitle('');
    setNewDate('');
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const getTimeRemaining = (targetIso: string) => {
    const diff = new Date(targetIso).getTime() - now;
    if (diff <= 0) {
      return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const remDays = days % 30;

    return { months, days: remDays, hours, minutes, seconds, isPast: false };
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/20">
            <Clock className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">Event Countdown Timer</h2>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                mm:dd:hh:mm:ss
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Track important deadlines, trips, and milestones with real-time month, day, hour, minute, and second precision.
            </p>
          </div>
        </div>
      </div>

      {/* Add Event Form */}
      <form onSubmit={handleAddEvent} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" /> Create New Countdown Event
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-400">Event Title</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Summer Vacation 🌴"
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-400">Target Date & Time</label>
            <input
              type="datetime-local"
              required
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-400">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="Personal">Personal</option>
              <option value="Work">Work & Project</option>
              <option value="Holiday">Holiday & Trip</option>
              <option value="Milestone">Milestone</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Countdown</span>
          </button>
        </div>
      </form>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((evt) => {
          const t = getTimeRemaining(evt.targetDate);

          return (
            <div
              key={evt.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6 relative group transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase">
                    {evt.category}
                  </span>
                  <button
                    onClick={() => handleDelete(evt.id)}
                    className="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                    title="Delete countdown"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">{evt.title}</h3>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>{new Date(evt.targetDate).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Countdown Digits mm:dd:hh:mm:ss */}
              {t.isPast ? (
                <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl text-center text-xs font-bold text-emerald-300 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Event has arrived!
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-2 text-center font-mono">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3">
                    <div className="text-lg sm:text-xl font-black text-blue-400">{String(t.months).padStart(2, '0')}</div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">Months</div>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3">
                    <div className="text-lg sm:text-xl font-black text-white">{String(t.days).padStart(2, '0')}</div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">Days</div>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3">
                    <div className="text-lg sm:text-xl font-black text-amber-400">{String(t.hours).padStart(2, '0')}</div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">Hours</div>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3">
                    <div className="text-lg sm:text-xl font-black text-purple-400">{String(t.minutes).padStart(2, '0')}</div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">Mins</div>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3">
                    <div className="text-lg sm:text-xl font-black text-emerald-400">{String(t.seconds).padStart(2, '0')}</div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">Secs</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
