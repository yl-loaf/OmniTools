import React, { useState } from 'react';
import { ArrowRightLeft, Copy, Check, RotateCcw } from 'lucide-react';

type UnitCategory = 'length' | 'weight' | 'temp' | 'data' | 'speed';

interface UnitDef {
  id: string;
  name: string;
  factor: number; // Factor relative to base unit
}

const CATEGORIES: Record<UnitCategory, { name: string; base: string; units: UnitDef[] }> = {
  length: {
    name: 'Length & Distance',
    base: 'm',
    units: [
      { id: 'm', name: 'Meters (m)', factor: 1 },
      { id: 'km', name: 'Kilometers (km)', factor: 1000 },
      { id: 'cm', name: 'Centimeters (cm)', factor: 0.01 },
      { id: 'mm', name: 'Millimeters (mm)', factor: 0.001 },
      { id: 'mi', name: 'Miles (mi)', factor: 1609.344 },
      { id: 'yd', name: 'Yards (yd)', factor: 0.9144 },
      { id: 'ft', name: 'Feet (ft)', factor: 0.3048 },
      { id: 'in', name: 'Inches (in)', factor: 0.0254 },
    ],
  },
  weight: {
    name: 'Weight & Mass',
    base: 'kg',
    units: [
      { id: 'kg', name: 'Kilograms (kg)', factor: 1 },
      { id: 'g', name: 'Grams (g)', factor: 0.001 },
      { id: 'mg', name: 'Milligrams (mg)', factor: 0.000001 },
      { id: 'lb', name: 'Pounds (lb)', factor: 0.45359237 },
      { id: 'oz', name: 'Ounces (oz)', factor: 0.0283495 },
      { id: 't', name: 'Metric Tons (t)', factor: 1000 },
    ],
  },
  data: {
    name: 'Digital Storage',
    base: 'B',
    units: [
      { id: 'B', name: 'Bytes (B)', factor: 1 },
      { id: 'KB', name: 'Kilobytes (KB)', factor: 1024 },
      { id: 'MB', name: 'Megabytes (MB)', factor: 1024 * 1024 },
      { id: 'GB', name: 'Gigabytes (GB)', factor: 1024 * 1024 * 1024 },
      { id: 'TB', name: 'Terabytes (TB)', factor: 1024 * 1024 * 1024 * 1024 },
    ],
  },
  speed: {
    name: 'Speed & Velocity',
    base: 'mps',
    units: [
      { id: 'mps', name: 'Meters/sec (m/s)', factor: 1 },
      { id: 'kph', name: 'Kilometers/hour (km/h)', factor: 0.277778 },
      { id: 'mph', name: 'Miles/hour (mph)', factor: 0.44704 },
      { id: 'fps', name: 'Feet/second (ft/s)', factor: 0.3048 },
      { id: 'knot', name: 'Knots (kn)', factor: 0.514444 },
    ],
  },
  temp: {
    name: 'Temperature',
    base: 'C',
    units: [
      { id: 'C', name: 'Celsius (°C)', factor: 1 },
      { id: 'F', name: 'Fahrenheit (°F)', factor: 1 },
      { id: 'K', name: 'Kelvin (K)', factor: 1 },
    ],
  },
};

export const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');
  const [copied, setCopied] = useState<boolean>(false);

  const currentCat = CATEGORIES[category];

  // Temperature has non-linear conversions
  const convertValue = (): number => {
    if (isNaN(inputValue)) return 0;

    if (category === 'temp') {
      if (fromUnit === toUnit) return inputValue;
      // Convert from -> Celsius
      let inC = inputValue;
      if (fromUnit === 'F') inC = ((inputValue - 32) * 5) / 9;
      if (fromUnit === 'K') inC = inputValue - 273.15;

      // Convert Celsius -> to
      if (toUnit === 'C') return inC;
      if (toUnit === 'F') return (inC * 9) / 5 + 32;
      if (toUnit === 'K') return inC + 273.15;
      return inC;
    }

    const fromDef = currentCat.units.find((u) => u.id === fromUnit) || currentCat.units[0];
    const toDef = currentCat.units.find((u) => u.id === toUnit) || currentCat.units[1];

    // Value in base unit
    const inBase = inputValue * fromDef.factor;
    return inBase / toDef.factor;
  };

  const result = convertValue();
  const formattedResult =
    Math.abs(result) < 0.0001 || Math.abs(result) > 1000000
      ? result.toExponential(4)
      : Number(result.toFixed(6).replace(/\.?0+$/, ''));

  const handleCopy = () => {
    navigator.clipboard.writeText(`${inputValue} ${fromUnit} = ${formattedResult} ${toUnit}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const units = CATEGORIES[cat].units;
    setFromUnit(units[0].id);
    setToUnit(units[1] ? units[1].id : units[0].id);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-extrabold text-white">Universal Unit Converter</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Convert Length, Weight, Temperature, Digital Data, and Speed across metric and imperial systems.
          </p>
        </div>

        <button
          onClick={() => {
            setInputValue(1);
            setFromUnit(currentCat.units[0].id);
            setToUnit(currentCat.units[1].id);
          }}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {(Object.keys(CATEGORIES) as UnitCategory[]).map((catKey) => (
          <button
            key={catKey}
            onClick={() => handleCategoryChange(catKey)}
            className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition ${
              category === catKey
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {CATEGORIES[catKey].name}
          </button>
        ))}
      </div>

      {/* Conversion Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl mx-auto shadow-2xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          {/* From Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-400">From</label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-lg font-mono font-bold text-white focus:outline-hidden focus:border-cyan-500"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            >
              {currentCat.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button (desktop inline, mobile between) */}
          <div className="flex sm:flex-col items-center justify-center pt-2 sm:pt-6">
            <button
              onClick={handleSwap}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl border border-slate-700 transition shadow-md hover:scale-105"
              title="Swap units"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          {/* To Input (Result) */}
          <div className="space-y-2 sm:col-start-2">
            <label className="block text-xs font-semibold text-slate-400">To (Result)</label>
            <div className="w-full bg-slate-950 border border-cyan-800/40 rounded-xl p-3 text-lg font-mono font-bold text-cyan-300 truncate">
              {formattedResult}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            >
              {currentCat.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Output Banner with Copy */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="font-mono text-sm text-slate-200">
            <strong>{inputValue}</strong> {fromUnit} = <strong className="text-cyan-400">{formattedResult}</strong> {toUnit}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Result'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
