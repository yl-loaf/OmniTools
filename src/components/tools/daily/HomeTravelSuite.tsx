import React, { useState } from 'react';
import { Timer, CloudSun, Box, Shield, Zap, Maximize } from 'lucide-react';

export const HomeTravelSuite: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
          <CloudSun className="w-7 h-7 text-amber-400" />
          <span>Home & Travel Suite (Part 4)</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Parking meter timer, carbon footprint estimator, packing volume calculator, weather comfort index, and canvas matrix.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ParkingTimer />
        <PackingCalculator />
        <WeatherComfortCalc />
        <CanvasSizeMatrix />
      </div>
    </div>
  );
};

// 13. Parking Meter Timer
const ParkingTimer = () => {
  const [minutes, setMinutes] = useState(45);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Timer className="w-4 h-4 text-amber-400" /> Parking Meter & Expiry Countdown
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
          Parking
        </span>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
        />
        <span className="text-xs text-slate-400 shrink-0">minutes remaining</span>
      </div>

      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-1">
        <div className="text-[10px] text-slate-500 uppercase font-bold">Meter Expiry Time</div>
        <div className="text-lg font-mono font-black text-amber-400">
          {new Date(Date.now() + minutes * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

// 14. Packing Volume Calculator
const PackingCalculator = () => {
  const [length, setLength] = useState(50); // cm
  const [width, setWidth] = useState(40);
  const [height, setHeight] = useState(30);

  const volumeCm3 = length * width * height;
  const volumeM3 = volumeCm3 / 1000000;
  const volumeLitres = volumeCm3 / 1000;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Box className="w-4 h-4 text-cyan-400" /> Box & Packing Volume Calculator
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
          Moving
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Length (cm)</label>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(Math.max(1, parseFloat(e.target.value) || 1))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Width (cm)</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Math.max(1, parseFloat(e.target.value) || 1))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Math.max(1, parseFloat(e.target.value) || 1))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
      </div>

      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-2 gap-3 text-center">
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Capacity (Litres)</div>
          <div className="text-sm font-mono font-bold text-cyan-400 mt-1">{volumeLitres.toFixed(1)} L</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Cubic Meters</div>
          <div className="text-sm font-mono font-bold text-white mt-1">{volumeM3.toFixed(3)} m³</div>
        </div>
      </div>
    </div>
  );
};

// 15. Weather Comfort Index
const WeatherComfortCalc = () => {
  const [tempC, setTempC] = useState(28);
  const [humidity, setHumidity] = useState(65);

  // Simplified heat index calculation
  const feelsLike = tempC + 0.33 * (humidity / 100) * 10 - 4;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <CloudSun className="w-4 h-4 text-orange-400" /> Weather Heat Index & Comfort
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-800">
          Weather
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Temperature (°C)</label>
          <input
            type="number"
            value={tempC}
            onChange={(e) => setTempC(parseFloat(e.target.value) || 0)}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Humidity (%)</label>
          <input
            type="number"
            value={humidity}
            onChange={(e) => setHumidity(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
      </div>

      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-1">
        <div className="text-[10px] text-slate-500 uppercase font-bold">Apparent Temperature (Feels Like)</div>
        <div className="text-lg font-mono font-black text-orange-400">{feelsLike.toFixed(1)} °C</div>
      </div>
    </div>
  );
};

// 16. Canvas Aspect Ratio Matrix
const CanvasSizeMatrix = () => {
  const formats = [
    { name: 'Instagram Post', res: '1080 x 1080 px (1:1)' },
    { name: 'Instagram Story / Reel', res: '1080 x 1920 px (9:16)' },
    { name: 'YouTube Thumbnail', res: '1280 x 720 px (16:9)' },
    { name: 'Twitter / X Banner', res: '1500 x 500 px (3:1)' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Maximize className="w-4 h-4 text-purple-400" /> Social Media & Canvas Size Matrix
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
          Design
        </span>
      </div>

      <div className="space-y-2">
        {formats.map((f, idx) => (
          <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <span className="text-xs font-semibold text-white">{f.name}</span>
            <span className="text-xs font-mono text-purple-300">{f.res}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
