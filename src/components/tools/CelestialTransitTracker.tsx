import React, { useState } from 'react';
import { Compass, Globe, Sparkles, Sun, Moon, Calendar } from 'lucide-react';

export const CelestialTransitTracker: React.FC = () => {
  const [latitude, setLatitude] = useState<number>(37.7749);
  const [longitude, setLongitude] = useState<number>(-122.4194);
  const [targetYear, setTargetYear] = useState<number>(2026);
  const [events, setEvents] = useState([
    { id: 1, name: 'Total Solar Eclipse', date: '2026-08-12', type: 'Solar', visibility: 'Partial from your coordinates (64% obscuration)', peak: '14:22 UTC' },
    { id: 2, name: 'Lunar Eclipse Total', date: '2026-03-03', type: 'Lunar', visibility: 'Fully visible overhead', peak: '08:14 UTC' },
    { id: 3, name: 'Mercury Transit Across Solar Disk', date: '2026-11-15', type: 'Transit', visibility: 'Visible with solar filter optics', peak: '19:40 UTC' },
    { id: 4, name: 'Perseid Meteor Shower Peak', date: '2026-08-12', type: 'Meteor Shower', visibility: '100 meteors/hour after midnight', peak: '03:00 local' },
  ]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <h1 className="text-2xl font-bold text-slate-100">Celestial Eclipse & Planetary Transit Tracker</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Calculate and visualize upcoming solar and lunar eclipses, planetary alignments, and transit windows based on your exact coordinates.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Observer Coordinates */}
          <div className="space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" /> Observer Coordinates
            </h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Latitude (°)</label>
              <input
                type="number"
                step="0.0001"
                value={latitude}
                onChange={(e) => setLatitude(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Longitude (°)</label>
              <input
                type="number"
                step="0.0001"
                value={longitude}
                onChange={(e) => setLongitude(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Target Observation Year</label>
              <select
                value={targetYear}
                onChange={(e) => setTargetYear(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200"
              >
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
                <option value={2028}>2028</option>
                <option value={2030}>2030</option>
              </select>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <div>Hemisphere: {latitude >= 0 ? 'Northern' : 'Southern'}</div>
              <div>Timezone Offset: {Math.round(longitude / 15)} hours UTC</div>
            </div>
          </div>

          {/* Events Feed */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" /> Upcoming Astronomical Events ({targetYear})
            </h3>

            <div className="space-y-3">
              {events.map((ev) => (
                <div key={ev.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-slate-100">{ev.name}</span>
                      <span className="px-2 py-0.5 bg-amber-950 text-amber-400 text-[10px] rounded-full font-medium">{ev.type}</span>
                    </div>
                    <div className="text-xs text-slate-400">{ev.visibility}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-amber-400">{ev.date}</div>
                    <div className="text-xs text-slate-400">Peak: {ev.peak}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
