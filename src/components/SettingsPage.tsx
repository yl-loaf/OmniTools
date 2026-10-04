/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { THEMES } from '../data/toolsRegistry';
import { ThemeId } from '../types';
import { APP_VERSION, BUILD_TIMESTAMP } from '../../version.js';
import {
  Settings,
  Palette,
  Database,
  Download,
  Upload,
  Trash2,
  Volume2,
  VolumeX,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Info,
  Server
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    return (localStorage.getItem('omnitools_theme') as ThemeId) || 'indigo';
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('omnitools_sound') !== 'false';
  });
  const [compactMode, setCompactMode] = useState<boolean>(() => {
    return localStorage.getItem('omnitools_compact') === 'true';
  });
  const [showNameOnLeaderboard, setShowNameOnLeaderboard] = useState<boolean>(() => {
    return localStorage.getItem('omnitools_show_name') === 'true';
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('omnitools_theme', currentTheme);
    document.documentElement.className = currentTheme === 'cyberpunk' ? 'dark cyberpunk' : 'dark';
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('omnitools_sound', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('omnitools_compact', String(compactMode));
  }, [compactMode]);

  useEffect(() => {
    localStorage.setItem('omnitools_show_name', String(showNameOnLeaderboard));
  }, [showNameOnLeaderboard]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportData = () => {
    const backup = {
      version: APP_VERSION,
      timestamp: new Date().toISOString(),
      favorites: localStorage.getItem('omnitools_favorites'),
      recentSearches: localStorage.getItem('omnitools_recent_searches'),
      usageCounts: localStorage.getItem('omnitools_usage_counts'),
      theme: currentTheme,
      sound: soundEnabled,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnitools_settings_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Workspace backup successfully exported!');
  };

  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear local usage telemetry and recent searches? Favorites and CP scores will be preserved.')) {
      localStorage.removeItem('omnitools_recent_searches');
      localStorage.removeItem('omnitools_usage_counts');
      showToast('Local cache telemetry successfully cleared.');
    }
  };

  const themeConfig = THEMES[currentTheme] || THEMES.indigo;

  return (
    <div className={`min-h-screen ${themeConfig.bgClass} flex flex-col transition-colors duration-300`}>
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <div className="px-4 py-3 bg-emerald-950 text-emerald-200 border border-emerald-700 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="./index.html"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </a>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-md">
                <Settings className="w-4 h-4" />
              </div>
              <h1 className="text-sm sm:text-base font-extrabold text-white">Workspace Settings</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
              v{APP_VERSION}
            </span>
          </div>
        </div>
      </header>

      {/* Main Settings Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* 1. APPEARANCE & THEME */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-2.5 rounded-xl bg-purple-950 text-purple-400 border border-purple-800">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Appearance & Workspace Themes</h2>
              <p className="text-xs text-slate-400">Customize visual theme accents and layout density</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(Object.keys(THEMES) as ThemeId[]).map((tKey) => {
              const th = THEMES[tKey];
              const isSelected = currentTheme === tKey;
              return (
                <div
                  key={tKey}
                  onClick={() => {
                    setCurrentTheme(tKey);
                    showToast(`Theme switched to ${th.name}`);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-white">{th.name}</div>
                    <div className="text-[10px] text-slate-400">Accent: {th.id.toUpperCase()}</div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Compact UI Mode</div>
              <div className="text-[11px] text-slate-400">Reduce tool padding for high-density information displays</div>
            </div>
            <button
              onClick={() => {
                setCompactMode(!compactMode);
                showToast(compactMode ? 'Compact mode disabled' : 'Compact mode enabled');
              }}
              className={`w-12 h-6 rounded-full transition relative p-1 ${compactMode ? 'bg-blue-600' : 'bg-slate-800'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition transform ${compactMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </section>

        {/* PRIVACY & LEADERBOARD VISIBILITY */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-2.5 rounded-xl bg-blue-950 text-blue-400 border border-blue-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Privacy & Leaderboard Visibility</h2>
              <p className="text-xs text-slate-400">Control how your name is displayed on community rankings</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Show my name on the global leaderboard</div>
              <div className="text-[11px] text-slate-400">If disabled, your name is hidden and only your profile picture (PFP) is shown</div>
            </div>
            <button
              onClick={() => {
                setShowNameOnLeaderboard(!showNameOnLeaderboard);
                showToast(showNameOnLeaderboard ? 'Leaderboard name hidden' : 'Leaderboard name visible');
              }}
              className={`w-12 h-6 rounded-full transition relative p-1 ${showNameOnLeaderboard ? 'bg-blue-600' : 'bg-slate-800'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition transform ${showNameOnLeaderboard ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </section>

        {/* 2. SOUND & FEEDBACK */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-2.5 rounded-xl bg-blue-950 text-blue-400 border border-blue-800">
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Sound FX & Interaction Feedback</h2>
              <p className="text-xs text-slate-400">Manage haptic sounds and success notifications</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">UI Interaction Sounds</div>
              <div className="text-[11px] text-slate-400">Play subtle audio feedback on button clicks and tool launches</div>
            </div>
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                showToast(soundEnabled ? 'Sound FX muted' : 'Sound FX enabled');
              }}
              className={`w-12 h-6 rounded-full transition relative p-1 ${soundEnabled ? 'bg-blue-600' : 'bg-slate-800'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </section>

        {/* 3. DATA & STORAGE */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-2.5 rounded-xl bg-amber-950 text-amber-400 border border-amber-800">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Data & Storage Management</h2>
              <p className="text-xs text-slate-400">Backup your favorites, preferences, and local telemetry</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleExportData}
              className="p-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-2xl flex items-center gap-3 text-left transition group"
            >
              <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition">Export Workspace Backup</div>
                <div className="text-[11px] text-slate-400">Download settings JSON file</div>
              </div>
            </button>

            <button
              onClick={handleClearCache}
              className="p-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-2xl flex items-center gap-3 text-left transition group"
            >
              <div className="p-2 rounded-xl bg-rose-950 text-rose-400 border border-rose-800">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-rose-300 transition">Clear Local Telemetry</div>
                <div className="text-[11px] text-slate-400">Reset recent search history</div>
              </div>
            </button>
          </div>
        </section>

        {/* 4. SYSTEM ABOUT */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">System Information</h2>
              <p className="text-xs text-slate-400">OmniTools professional suite build metadata</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <div className="text-slate-500 text-[10px]">VERSION</div>
              <div className="text-white font-bold mt-0.5">v{APP_VERSION}</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">BUILD TIMESTAMP</div>
              <div className="text-white font-bold mt-0.5">{BUILD_TIMESTAMP.slice(0, 10)}</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">ENVIRONMENT</div>
              <div className="text-emerald-400 font-bold mt-0.5">Production Client</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
