import React, { useState } from 'react';
import { Clock, CheckSquare, Compass, BookOpen, Heart, Calendar, Plus, Trash2 } from 'lucide-react';

export const ProductivityTimeSuite: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
          <Clock className="w-7 h-7 text-blue-400" />
          <span>Productivity & Time Suite (Part 3)</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Timezone world call planner, habit tracker, ETA travel time calculator, daily todo matrix, and reading time estimator.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimezonePlanner />
        <EtaCalculator />
        <DailyTodoMatrix />
        <ReadingTimeCalculator />
      </div>
    </div>
  );
};

// 9. Timezone Meeting Planner
const TimezonePlanner = () => {
  const [localHour, setLocalHour] = useState(14); // 2 PM

  const cities = [
    { name: 'New York (EST)', offset: -5 },
    { name: 'London (GMT)', offset: 0 },
    { name: 'Berlin (CET)', offset: 1 },
    { name: 'Dubai (GST)', offset: 4 },
    { name: 'Tokyo (JST)', offset: 9 },
    { name: 'Sydney (AEST)', offset: 10 },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" /> World Timezone Meeting Planner
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
          Scheduling
        </span>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1">
          <span>Base Hour (UTC):</span>
          <span className="font-mono font-bold text-blue-400">{localHour}:00 UTC</span>
        </div>
        <input
          type="range"
          min="0"
          max="23"
          value={localHour}
          onChange={(e) => setLocalHour(parseInt(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {cities.map((city, idx) => {
          const cityHour = (localHour + city.offset + 24) % 24;
          const isWorkingHour = cityHour >= 8 && cityHour <= 18;

          return (
            <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <div className="text-[11px] text-slate-400 truncate">{city.name}</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono font-bold text-white">{String(cityHour).padStart(2, '0')}:00</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                  isWorkingHour ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isWorkingHour ? 'Working' : 'Off Hours'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 10. ETA Speed & Distance Calculator
const EtaCalculator = () => {
  const [distance, setDistance] = useState(120); // km or miles
  const [speed, setSpeed] = useState(80); // km/h or mph

  const hours = speed > 0 ? distance / speed : 0;
  const hrs = Math.floor(hours);
  const mins = Math.round((hours - hrs) * 60);

  const now = new Date();
  now.setMinutes(now.getMinutes() + Math.round(hours * 60));
  const arrivalTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" /> Speed, Distance & ETA Calculator
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
          Travel
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Distance</label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Average Speed</label>
          <input
            type="number"
            value={speed}
            onChange={(e) => setSpeed(Math.max(1, parseFloat(e.target.value) || 1))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
      </div>

      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-2 gap-3 text-center">
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Travel Duration</div>
          <div className="text-base font-mono font-bold text-cyan-400 mt-1">{hrs}h {mins}m</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Estimated Arrival (ETA)</div>
          <div className="text-base font-mono font-black text-emerald-400 mt-1">{arrivalTime}</div>
        </div>
      </div>
    </div>
  );
};

// 11. Daily Todo Matrix
const DailyTodoMatrix = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Review quarterly budget proposal', done: false },
    { id: 2, text: 'Book dentist appointment', done: true },
    { id: 3, text: 'Grocery shopping for dinner', done: false },
  ]);
  const [newText, setNewText] = useState('');

  const addTask = () => {
    if (!newText.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newText.trim(), done: false }]);
    setNewText('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-purple-400" /> Daily Priority Tasks
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
          Focus
        </span>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a new daily task..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
        />
        <button
          onClick={addTask}
          className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {tasks.map((t) => (
          <div key={t.id} className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
            <label className="flex items-center gap-2.5 cursor-pointer flex-1">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => setTasks(tasks.map(x => x.id === t.id ? { ...x, done: !x.done } : x))}
                className="rounded border-slate-700 bg-slate-900 accent-purple-500"
              />
              <span className={`text-xs ${t.done ? 'line-through text-slate-500' : 'text-white'}`}>{t.text}</span>
            </label>
            <button
              onClick={() => setTasks(tasks.filter(x => x.id !== t.id))}
              className="text-slate-600 hover:text-rose-400 p-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 12. Reading Time Calculator
const ReadingTimeCalculator = () => {
  const [text, setText] = useState('Type or paste your essay, email, or article here to instantly calculate reading time at an average speed of 238 words per minute...');
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const minutes = Math.ceil(words / 238);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" /> Reading Time & Speech Estimator
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
          Content
        </span>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-hidden resize-none font-mono"
      />

      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Word Count</div>
          <div className="text-sm font-mono font-bold text-white mt-0.5">{words}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Characters</div>
          <div className="text-sm font-mono font-bold text-white mt-0.5">{chars}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Read Time</div>
          <div className="text-sm font-mono font-black text-emerald-400 mt-0.5">~{minutes} min</div>
        </div>
      </div>
    </div>
  );
};
