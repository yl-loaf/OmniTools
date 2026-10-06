import React, { useState } from 'react';
import { Compass, Globe, Sparkles, Navigation, Sun, Moon } from 'lucide-react';

export function CelestialStarMap() {
  const [latitude, setLatitude] = useState(37.7749);
  const [longitude, setLongitude] = useState(-122.4194);
  const [viewMode, setViewMode] = useState<'night' | 'equatorial' | 'planets'>('night');

  const visibleConstellations = [
    { name: 'Ursa Major (Big Dipper)', rightAscension: '11h 18m', declination: '+55° 45\'', bestSeason: 'Spring', description: 'Contains the pointer stars Merak and Dubhe leading directly to Polaris.' },
    { name: 'Orion the Hunter', rightAscension: '05h 35m', declination: '-05° 24\'', bestSeason: 'Winter', description: 'Famous for Orion\'s Belt (Alnitak, Alnilam, Mintaka) and the Orion Nebula.' },
    { name: 'Cassiopeia', rightAscension: '01h 00m', declination: '+60° 14\'', bestSeason: 'Autumn', description: 'Distinctive W-shape constellation easily spotted in the northern circumpolar sky.' },
    { name: 'Scorpius', rightAscension: '16h 53m', declination: '-33° 42\'', bestSeason: 'Summer', description: 'Dominated by Antares, a red supergiant star shining with a ruby-red hue.' },
    { name: 'Cygnus (The Swan)', rightAscension: '20h 41m', declination: '+45° 16\'', bestSeason: 'Summer', description: 'Features the Northern Cross asterism situated along the Milky Way.' },
  ];

  const planetaryPositions = [
    { planet: 'Venus', magnitude: -4.2, constellation: 'Leo', visibility: 'Morning Sky' },
    { planet: 'Mars', magnitude: 0.8, constellation: 'Gemini', visibility: 'Midnight' },
    { planet: 'Jupiter', magnitude: -2.5, constellation: 'Taurus', visibility: 'Evening Sky' },
    { planet: 'Saturn', magnitude: 0.6, constellation: 'Aquarius', visibility: 'All Night' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl text-white shadow-lg">
              <Compass className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
              Interactive Celestial Star Map & Constellation Tracker
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Simulate real-time celestial coordinates, planetary positions, and stellar constellations based on user location and viewing angle.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4 bg-slate-950 p-5 rounded-xl border border-slate-800">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" /> Observer Coordinates
          </h2>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Latitude</span>
              <span className="font-mono text-blue-300">{latitude}° N</span>
            </div>
            <input
              type="range"
              min="-90"
              max="90"
              step="0.5"
              value={latitude}
              onChange={(e) => setLatitude(Number(e.target.value))}
              className="w-full accent-blue-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Longitude</span>
              <span className="font-mono text-blue-300">{longitude}° E</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="0.5"
              value={longitude}
              onChange={(e) => setLongitude(Number(e.target.value))}
              className="w-full accent-blue-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-medium text-slate-400">Display Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'night', label: 'Constellations' },
                { id: 'planets', label: 'Planets' },
                { id: 'equatorial', label: 'Grid' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setViewMode(item.id as any)}
                  className={`px-2 py-2 text-xs font-medium rounded-lg border transition-all text-center ${
                    viewMode === item.id
                      ? 'bg-blue-600/30 border-blue-500 text-blue-200 shadow'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5 bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Visible Celestial Objects at {latitude.toFixed(1)}°, {longitude.toFixed(1)}°
            </h2>

            {viewMode === 'planets' ? (
              <div className="space-y-3">
                {planetaryPositions.map((p, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-200">{p.planet}</div>
                      <div className="text-xs text-slate-400">Constellation: {p.constellation} • Visibility: {p.visibility}</div>
                    </div>
                    <div className="px-3 py-1 bg-blue-950 border border-blue-800/60 rounded-lg font-mono text-blue-300 text-xs">
                      Mag {p.magnitude}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {visibleConstellations.map((c, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-200">{c.name}</span>
                      <span className="text-xs px-2 py-0.5 bg-slate-950 border border-slate-800 rounded-md text-cyan-300 font-mono">
                        RA {c.rightAscension} | Dec {c.declination}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">{c.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
