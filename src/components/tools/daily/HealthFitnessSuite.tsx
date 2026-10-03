import React, { useState } from 'react';
import { Heart, Droplet, Moon, DollarSign, Activity, Award, User, RefreshCw } from 'lucide-react';

export const HealthFitnessSuite: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
          <Heart className="w-7 h-7 text-rose-500" />
          <span>Health & Daily Life Suite (Part 1)</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Essential daily life calculators for bill splitting, BMI, hydration, sleep cycles, and pet age.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Tip Splitter */}
        <TipSplitter />
        {/* 2. BMI & Calorie Calculator */}
        <BmiCalculator />
        {/* 3. Water Intake Tracker */}
        <WaterTracker />
        {/* 4. Sleep Cycle Calculator */}
        <SleepCalculator />
      </div>
    </div>
  );
};

// 1. Tip Splitter
const TipSplitter = () => {
  const [bill, setBill] = useState(75.50);
  const [tipPct, setTipPct] = useState(18);
  const [people, setPeople] = useState(3);
  const [roundUp, setRoundUp] = useState(false);

  const tipAmount = (bill * tipPct) / 100;
  const total = bill + tipAmount;
  let perPerson = total / people;
  if (roundUp) perPerson = Math.ceil(perPerson);
  const totalRounded = perPerson * people;
  const adjustedTip = totalRounded - bill;
  const adjustedTipPct = bill > 0 ? (adjustedTip / bill) * 100 : tipPct;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400" /> Tip Splitter & Bill Calculator
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
          Dining & Services
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Bill Total ($)</label>
          <input
            type="number"
            step="0.01"
            value={bill}
            onChange={(e) => setBill(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Tip % ({tipPct}%)</label>
          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={tipPct}
            onChange={(e) => setTipPct(parseInt(e.target.value))}
            className="w-full mt-2 accent-emerald-500"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-400">People</label>
          <input
            type="number"
            min="1"
            value={people}
            onChange={(e) => setPeople(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="roundup"
          checked={roundUp}
          onChange={(e) => setRoundUp(e.target.checked)}
          className="rounded border-slate-700 bg-slate-950 accent-emerald-500"
        />
        <label htmlFor="roundup" className="text-xs text-slate-300 cursor-pointer">
          Round up per person split
        </label>
      </div>

      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Tip Total</div>
          <div className="text-sm font-mono font-bold text-emerald-400 mt-1">${tipAmount.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Grand Total</div>
          <div className="text-sm font-mono font-bold text-white mt-1">${total.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Per Person</div>
          <div className="text-base font-mono font-extrabold text-blue-400 mt-1">${perPerson.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

// 2. BMI & Calorie Calculator
const BmiCalculator = () => {
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(175);
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState(1.375); // light

  const heightM = heightCm / 100;
  const bmi = heightM > 0 ? weightKg / (heightM * heightM) : 0;

  // BMR (Mifflin-St Jeor)
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  bmr += gender === 'male' ? 5 : -161;
  const tdee = Math.round(bmr * activity);

  let bmiCategory = 'Normal Weight';
  let bmiColor = 'text-emerald-400';
  if (bmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = 'text-amber-400';
  } else if (bmi >= 25 && bmi < 30) {
    bmiCategory = 'Overweight';
    bmiColor = 'text-orange-400';
  } else if (bmi >= 30) {
    bmiCategory = 'Obese';
    bmiColor = 'text-rose-400';
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-rose-400" /> BMI & Daily Calories (TDEE)
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
          Health & Fitness
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Weight (kg)</label>
          <input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(Math.max(20, parseFloat(e.target.value) || 0))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Height (cm)</label>
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(Math.max(50, parseFloat(e.target.value) || 0))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Math.max(10, parseInt(e.target.value) || 10))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as any)}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-[11px] font-semibold text-slate-400">Activity Level</label>
        <select
          value={activity}
          onChange={(e) => setActivity(parseFloat(e.target.value))}
          className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
        >
          <option value="1.2">Sedentary (little or no exercise)</option>
          <option value="1.375">Lightly active (light exercise 1-3 days/wk)</option>
          <option value="1.55">Moderately active (moderate exercise 3-5 days/wk)</option>
          <option value="1.725">Very active (hard exercise 6-7 days/wk)</option>
        </select>
      </div>

      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-2 gap-3 text-center">
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Body Mass Index (BMI)</div>
          <div className={`text-base font-mono font-black mt-1 ${bmiColor}`}>
            {bmi.toFixed(1)} <span className="text-xs font-normal">({bmiCategory})</span>
          </div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Daily Calorie Target (TDEE)</div>
          <div className="text-base font-mono font-black text-cyan-400 mt-1">{tdee} kcal/day</div>
        </div>
      </div>
    </div>
  );
};

// 3. Water Intake Tracker
const WaterTracker = () => {
  const [weightLbs, setWeightLbs] = useState(150);
  const [workoutMins, setWorkoutMins] = useState(30);

  // ~oz of water: weight / 2 + workout / 30 * 12
  const targetOz = Math.round(weightLbs / 2 + (workoutMins / 30) * 12);
  const targetMl = Math.round(targetOz * 29.5735);
  const glasses = (targetOz / 8).toFixed(1);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Droplet className="w-4 h-4 text-cyan-400" /> Daily Hydration Calculator
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
          Wellness
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Body Weight (lbs)</label>
          <input
            type="number"
            value={weightLbs}
            onChange={(e) => setWeightLbs(Math.max(50, parseInt(e.target.value) || 0))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Daily Exercise (mins)</label>
          <input
            type="number"
            value={workoutMins}
            onChange={(e) => setWorkoutMins(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
      </div>

      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Fluid Ounces</div>
          <div className="text-sm font-mono font-bold text-cyan-400 mt-1">{targetOz} oz</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Milliliters</div>
          <div className="text-sm font-mono font-bold text-white mt-1">{targetMl} ml</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Standard Glasses</div>
          <div className="text-sm font-mono font-bold text-blue-400 mt-1">{glasses} (8oz)</div>
        </div>
      </div>
    </div>
  );
};

// 4. Sleep Cycle Calculator
const SleepCalculator = () => {
  const [wakeTime, setWakeTime] = useState('07:00');

  const calcCycles = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);

    // Each cycle is 90 mins. Fall asleep takes ~14 mins.
    const results = [];
    for (const cycles of [6, 5, 4, 3]) {
      const minsBefore = cycles * 90 + 14;
      const bedDate = new Date(date.getTime() - minsBefore * 60000);
      results.push({
        cycles,
        time: bedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hours: (cycles * 1.5).toFixed(1),
      });
    }
    return results;
  };

  const options = calcCycles(wakeTime);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Moon className="w-4 h-4 text-purple-400" /> Sleep Cycle & Bedtime Calculator
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
          Rest
        </span>
      </div>

      <div>
        <label className="text-[11px] font-semibold text-slate-400">Target Wake-Up Time</label>
        <input
          type="time"
          value={wakeTime}
          onChange={(e) => setWakeTime(e.target.value)}
          className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
        />
      </div>

      <div className="space-y-2">
        <div className="text-[10px] text-slate-500 uppercase font-bold">Recommended Bedtimes (90-min cycles):</div>
        <div className="grid grid-cols-2 gap-2">
          {options.map((opt, i) => (
            <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-purple-300">{opt.time}</div>
                <div className="text-[10px] text-slate-500">{opt.hours} hours sleep</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {opt.cycles} cycles
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
