import React, { useState } from 'react';
import { DollarSign, Utensils, Car, Percent, TrendingUp, Zap, ShoppingCart } from 'lucide-react';

export const FinanceLifeSuite: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
          <DollarSign className="w-7 h-7 text-emerald-400" />
          <span>Finance & Daily Home Suite (Part 2)</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Recipe ingredient scaler, road trip fuel cost estimator, percentage markup, savings compounder, and electricity appliance calculator.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecipeScaler />
        <FuelCalculator />
        <PercentageCalculator />
        <SavingsCalculator />
      </div>
    </div>
  );
};

// 5. Recipe Scaler
const RecipeScaler = () => {
  const [origServings, setOrigServings] = useState(4);
  const [newServings, setNewServings] = useState(6);
  const [ingredientAmt, setIngredientAmt] = useState(2.5);

  const ratio = origServings > 0 ? newServings / origServings : 1;
  const scaledAmt = ingredientAmt * ratio;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Utensils className="w-4 h-4 text-amber-400" /> Kitchen Recipe Scaler
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
          Cooking
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Original Servings</label>
          <input
            type="number"
            value={origServings}
            onChange={(e) => setOrigServings(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-400">New Servings</label>
          <input
            type="number"
            value={newServings}
            onChange={(e) => setNewServings(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Ingredient Amt</label>
          <input
            type="number"
            step="0.1"
            value={ingredientAmt}
            onChange={(e) => setIngredientAmt(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
      </div>

      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Scaling Multiplier</div>
          <div className="text-sm font-mono font-bold text-white mt-0.5">{ratio.toFixed(2)}x</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Adjusted Amount</div>
          <div className="text-base font-mono font-black text-amber-400 mt-0.5">{scaledAmt.toFixed(2)} units</div>
        </div>
      </div>
    </div>
  );
};

// 6. Fuel & Road Trip Calculator
const FuelCalculator = () => {
  const [distanceKm, setDistanceKm] = useState(350);
  const [efficiency, setEfficiency] = useState(8.5); // L / 100km
  const [pricePerUnit, setPricePerUnit] = useState(1.45); // $ / L
  const [passengers, setPassengers] = useState(2);

  const totalLitres = (distanceKm * efficiency) / 100;
  const totalCost = totalLitres * pricePerUnit;
  const costPerPerson = passengers > 0 ? totalCost / passengers : totalCost;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Car className="w-4 h-4 text-cyan-400" /> Fuel Cost & Road Trip Splitter
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
          Travel
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Distance (km)</label>
          <input
            type="number"
            value={distanceKm}
            onChange={(e) => setDistanceKm(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-400">L / 100km</label>
          <input
            type="number"
            step="0.1"
            value={efficiency}
            onChange={(e) => setEfficiency(Math.max(1, parseFloat(e.target.value) || 1))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Price / Unit ($)</label>
          <input
            type="number"
            step="0.01"
            value={pricePerUnit}
            onChange={(e) => setPricePerUnit(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Passengers</label>
          <input
            type="number"
            value={passengers}
            onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
      </div>

      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Total Fuel</div>
          <div className="text-sm font-mono font-bold text-white mt-1">{totalLitres.toFixed(1)} L</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Total Cost</div>
          <div className="text-sm font-mono font-bold text-cyan-400 mt-1">${totalCost.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Per Person</div>
          <div className="text-base font-mono font-black text-emerald-400 mt-1">${costPerPerson.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

// 7. Percentage & Markup Calculator
const PercentageCalculator = () => {
  const [val1, setVal1] = useState(120);
  const [val2, setVal2] = useState(20); // 20% off or markup

  const discountVal = val1 - (val1 * val2) / 100;
  const markupVal = val1 + (val1 * val2) / 100;
  const pctOf = val1 > 0 ? (val2 / val1) * 100 : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Percent className="w-4 h-4 text-purple-400" /> Percentage, Markup & Sale Calculator
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
          Math
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Base Value (X)</label>
          <input
            type="number"
            value={val1}
            onChange={(e) => setVal1(parseFloat(e.target.value) || 0)}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Percentage (Y%)</label>
          <input
            type="number"
            value={val2}
            onChange={(e) => setVal2(parseFloat(e.target.value) || 0)}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
      </div>

      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Sale Price (-Y%)</div>
          <div className="text-sm font-mono font-bold text-emerald-400 mt-1">${discountVal.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Markup (+Y%)</div>
          <div className="text-sm font-mono font-bold text-cyan-400 mt-1">${markupVal.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Y is % of X</div>
          <div className="text-sm font-mono font-bold text-purple-400 mt-1">{pctOf.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
};

// 8. Savings & Retirement Compound Calculator
const SavingsCalculator = () => {
  const [principal, setPrincipal] = useState(5000);
  const [monthly, setMonthly] = useState(300);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(7); // 7% annual

  const r = rate / 100 / 12;
  const n = years * 12;
  let futureVal = principal * Math.pow(1 + r, n);
  if (r > 0) {
    futureVal += monthly * ((Math.pow(1 + r, n) - 1) / r);
  } else {
    futureVal += monthly * n;
  }
  const totalContributed = principal + monthly * n;
  const interestEarned = futureVal - totalContributed;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" /> Savings & Compound Growth Calculator
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
          Wealth
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Initial ($)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Monthly ($)</label>
          <input
            type="number"
            value={monthly}
            onChange={(e) => setMonthly(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Years</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Annual Return (%)</label>
          <input
            type="number"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
      </div>

      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Total Deposited</div>
          <div className="text-sm font-mono font-bold text-white mt-1">${Math.round(totalContributed).toLocaleString()}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Interest Earned</div>
          <div className="text-sm font-mono font-bold text-emerald-400 mt-1">${Math.round(interestEarned).toLocaleString()}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Future Balance</div>
          <div className="text-base font-mono font-black text-cyan-400 mt-1">${Math.round(futureVal).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};
