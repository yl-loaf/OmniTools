import React, { useState } from 'react';
import { Calculator, Flame, Award, Copy, Check } from 'lucide-react';
import { playSuccessSound } from '../../services/soundEffects';

export function MacroNutrientPlannerTool() {
  const [weightKg, setWeightKg] = useState(75);
  const [heightCm, setHeightCm] = useState(175);
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState(1.375);
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain');
  const [copied, setCopied] = useState(false);

  // BMR calculation (Mifflin-St Jeor)
  const bmr = gender === 'male'
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const tdee = Math.round(bmr * activity);
  const targetCalories = goal === 'lose' ? tdee - 500 : goal === 'gain' ? tdee + 400 : tdee;

  // Macros (Protein: 2g/kg, Fat: 25%, Carbs: remainder)
  const proteinGrams = Math.round(weightKg * 2.0);
  const proteinCals = proteinGrams * 4;
  const fatCals = Math.round(targetCalories * 0.25);
  const fatGrams = Math.round(fatCals / 9);
  const carbCals = Math.max(0, targetCalories - (proteinCals + fatCals));
  const carbGrams = Math.round(carbCals / 4);

  const summary = `Calorie Target: ${targetCalories} kcal
Protein: ${proteinGrams}g (${proteinCals} kcal)
Fats: ${fatGrams}g (${fatCals} kcal)
Carbohydrates: ${carbGrams}g (${carbCals} kcal)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    playSuccessSound();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-400" />
            Macro Nutrient & Energy Expenditure Planner
          </h2>
          <p className="text-sm text-slate-400">
            Compute precise daily macronutrient splits and caloric targets based on metabolic rates and fitness goals.
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl border border-slate-700 transition"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          Copy Plan
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Weight (kg)</label>
          <input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-200"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Height (cm)</label>
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-200"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-200"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-200"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Activity Level</label>
          <select
            value={activity}
            onChange={(e) => setActivity(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-200"
          >
            <option value={1.2}>Sedentary (little or no exercise)</option>
            <option value={1.375}>Lightly Active (1-3 days/week)</option>
            <option value={1.55}>Moderately Active (3-5 days/week)</option>
            <option value={1.725}>Very Active (6-7 days/week)</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Fitness Goal</label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-200"
          >
            <option value="lose">Fat Loss (-500 kcal)</option>
            <option value="maintain">Maintain Weight</option>
            <option value="gain">Muscle Gain (+400 kcal)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Target Calories</div>
          <div className="text-xl font-bold font-mono text-amber-400">{targetCalories} kcal</div>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Protein (2g/kg)</div>
          <div className="text-xl font-bold font-mono text-blue-400">{proteinGrams}g</div>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Fats (25%)</div>
          <div className="text-xl font-bold font-mono text-purple-400">{fatGrams}g</div>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Carbohydrates</div>
          <div className="text-xl font-bold font-mono text-emerald-400">{carbGrams}g</div>
        </div>
      </div>
    </div>
  );
}
