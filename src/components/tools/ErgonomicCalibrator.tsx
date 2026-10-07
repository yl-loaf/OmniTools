import React, { useState } from 'react';
import { Heart, Sliders, Sparkles, CheckCircle2, User } from 'lucide-react';

export const ErgonomicCalibrator: React.FC = () => {
  const [heightCm, setHeightCm] = useState<number>(175);
  const [sittingHeightCm, setSittingHeightCm] = useState<number>(90);
  const [monitorCount, setMonitorCount] = useState<number>(2);

  // Ergonomic formulas
  const deskHeight = Math.round(heightCm * 0.38);
  const chairHeight = Math.round(heightCm * 0.25);
  const screenDist = 65; // standard cm
  const armrestHeight = Math.round(deskHeight * 0.7);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-400" />
              <h1 className="text-2xl font-bold text-slate-100">Ergonomic Desk Posture & Workstation Calibrator</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Calculate ideal desk height, monitor viewing angles, and chair ergonomics based on your exact body measurements.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* User Measurements */}
          <div className="space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" /> Body Measurements
            </h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Total Height ({heightCm} cm / {Math.round(heightCm / 2.54)} in)</label>
              <input
                type="range"
                min="140"
                max="210"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Sitting Torso Height ({sittingHeightCm} cm)</label>
              <input
                type="range"
                min="70"
                max="110"
                value={sittingHeightCm}
                onChange={(e) => setSittingHeightCm(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Monitor Setup</label>
              <select
                value={monitorCount}
                onChange={(e) => setMonitorCount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200"
              >
                <option value={1}>Single Monitor</option>
                <option value={2}>Dual Monitors</option>
                <option value={3}>Ultrawide / Triple</option>
              </select>
            </div>
          </div>

          {/* Calibrated Ergonomic Specifications */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Optimal Ergonomic Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400">Recommended Desk Height</div>
                <div className="text-2xl font-bold text-emerald-400">{deskHeight} cm</div>
                <div className="text-xs text-slate-500">Forearms parallel to floor, 90° elbow angle</div>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400">Chair Seat Height</div>
                <div className="text-2xl font-bold text-emerald-400">{chairHeight} cm</div>
                <div className="text-xs text-slate-500">Feet flat on floor, knees at 90° angle</div>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400">Monitor Viewing Distance</div>
                <div className="text-2xl font-bold text-emerald-400">{screenDist} cm</div>
                <div className="text-xs text-slate-500">Arm’s length away, top bezel at eye level</div>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400">Armrest Height</div>
                <div className="text-2xl font-bold text-emerald-400">{armrestHeight} cm</div>
                <div className="text-xs text-slate-500">Shoulders relaxed, wrists neutral</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
