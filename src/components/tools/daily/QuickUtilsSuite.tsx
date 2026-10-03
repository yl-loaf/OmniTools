import React, { useState } from 'react';
import { Award, Percent, Timer, Smile, Coffee, Sparkles } from 'lucide-react';

export const QuickUtilsSuite: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
          <Award className="w-7 h-7 text-indigo-400" />
          <span>Quick Daily Utilities Suite (Part 5)</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          GPA calculator, stacked sale discount calculator, egg & tea boiling timer, daily mood logger, and inspiration quote generator.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GpaCalculator />
        <DiscountCalculator />
        <EggTimer />
        <DailyQuoteGenerator />
      </div>
    </div>
  );
};

// 17. GPA Calculator
const GpaCalculator = () => {
  const [grades, setGrades] = useState([
    { course: 'Math', credits: 4, grade: 4.0 },
    { course: 'Physics', credits: 3, grade: 3.7 },
    { course: 'English', credits: 3, grade: 3.5 },
  ]);

  const totalCredits = grades.reduce((acc, g) => acc + g.credits, 0);
  const totalPoints = grades.reduce((acc, g) => acc + g.credits * g.grade, 0);
  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-400" /> GPA & Grade Average Calculator
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
          Education
        </span>
      </div>

      <div className="space-y-2">
        {grades.map((g, i) => (
          <div key={i} className="flex items-center justify-between gap-2 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs">
            <span className="font-semibold text-white flex-1">{g.course}</span>
            <span className="font-mono text-slate-400">{g.credits} credits</span>
            <span className="font-mono font-bold text-indigo-300">{g.grade} GPA</span>
          </div>
        ))}
      </div>

      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Total Credits</div>
          <div className="text-sm font-mono font-bold text-white">{totalCredits}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Cumulative GPA</div>
          <div className="text-base font-mono font-black text-indigo-400">{gpa.toFixed(2)} / 4.0</div>
        </div>
      </div>
    </div>
  );
};

// 18. Stacked Discount Calculator
const DiscountCalculator = () => {
  const [price, setPrice] = useState(100);
  const [disc1, setDisc1] = useState(20);
  const [disc2, setDisc2] = useState(10); // additional 10% off sale

  const priceAfter1 = price - (price * disc1) / 100;
  const finalPrice = priceAfter1 - (priceAfter1 * disc2) / 100;
  const saved = price - finalPrice;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Percent className="w-4 h-4 text-rose-400" /> Stacked Flash Sale Discount Calculator
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
          Shopping
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Original ($)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Discount 1 (%)</label>
          <input
            type="number"
            value={disc1}
            onChange={(e) => setDisc1(parseFloat(e.target.value) || 0)}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Extra Disc 2 (%)</label>
          <input
            type="number"
            value={disc2}
            onChange={(e) => setDisc2(parseFloat(e.target.value) || 0)}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
      </div>

      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-2 gap-3 text-center">
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Total Saved</div>
          <div className="text-sm font-mono font-bold text-emerald-400 mt-1">${saved.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Final Price</div>
          <div className="text-base font-mono font-black text-rose-400 mt-1">${finalPrice.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

// 19. Egg & Tea Timer
const EggTimer = () => {
  const [selected, setSelected] = useState('Soft-Boiled Egg (4 mins)');

  const timers: Record<string, number> = {
    'Soft-Boiled Egg (4 mins)': 4,
    'Medium-Boiled Egg (6 mins)': 6,
    'Hard-Boiled Egg (9 mins)': 9,
    'Green Tea Steeping (3 mins)': 3,
    'Black Tea Steeping (5 mins)': 5,
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Coffee className="w-4 h-4 text-amber-400" /> Egg & Tea Steeping Timer Preset
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
          Kitchen
        </span>
      </div>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
      >
        {Object.keys(timers).map((k) => (
          <option key={k} value={k}>{k}</option>
        ))}
      </select>

      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-1">
        <div className="text-[10px] text-slate-500 uppercase font-bold">Preset Duration</div>
        <div className="text-xl font-mono font-black text-amber-400">{timers[selected]} Minutes</div>
      </div>
    </div>
  );
};

// 20. Daily Quote Generator
const DailyQuoteGenerator = () => {
  const quotes = [
    { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
    { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
    { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
    { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  ];

  const [idx, setIdx] = useState(0);
  const q = quotes[idx];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" /> Daily Inspiration Quote
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
          Mindset
        </span>
      </div>

      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-center">
        <p className="text-xs text-slate-200 italic leading-relaxed">"{q.text}"</p>
        <div className="text-[11px] font-semibold text-cyan-400">— {q.author}</div>
      </div>

      <button
        onClick={() => setIdx((idx + 1) % quotes.length)}
        className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition"
      >
        Generate Another Quote
      </button>
    </div>
  );
};
