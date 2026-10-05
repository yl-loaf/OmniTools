/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { THEMES } from '../data/toolsRegistry';
import { ThemeId } from '../types';
import { APP_VERSION, BUILD_TIMESTAMP } from '../../version.js';
import { GoogleGenAI } from '@google/genai';
import {
  playClickSound,
  playSuccessSound,
  playToggleSound,
  SoundTheme,
  getSoundTheme,
  getSoundVolume,
  isSoundEnabled
} from '../services/soundEffects';
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
  Server,
  Eye,
  EyeOff,
  Sliders,
  Monitor,
  Keyboard,
  Terminal,
  Bell,
  Lock,
  Zap,
  Play,
  RotateCcw,
  AlertTriangle,
  FileText,
  Check,
  Cpu,
  Layers,
  Search
} from 'lucide-react';

interface SettingsPageProps {
  onBack?: () => void;
}

type SettingsSection =
  | 'all'
  | 'appearance'
  | 'developer'
  | 'navigation'
  | 'sound'
  | 'ai'
  | 'privacy'
  | 'notifications'
  | 'data'
  | 'system';

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  // Category section filter
  const [activeSection, setActiveSection] = useState<SettingsSection>('all');

  // 1. Appearance
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    return (localStorage.getItem('omnitools_theme') as ThemeId) || 'indigo';
  });
  const [compactMode, setCompactMode] = useState<boolean>(() => {
    return localStorage.getItem('omnitools_compact') === 'true';
  });
  const [fontScale, setFontScale] = useState<string>(() => {
    return localStorage.getItem('omnitools_font_scale') || '100';
  });
  const [codeFont, setCodeFont] = useState<string>(() => {
    return localStorage.getItem('omnitools_code_font') || 'jetbrains';
  });
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('omnitools_high_contrast') === 'true';
  });
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    return localStorage.getItem('omnitools_reduced_motion') === 'true';
  });

  // 2. Developer & Tool Defaults
  const [tabSize, setTabSize] = useState<number>(() => {
    return parseInt(localStorage.getItem('omnitools_tab_size') || '2', 10);
  });
  const [autoCopy, setAutoCopy] = useState<boolean>(() => {
    return localStorage.getItem('omnitools_autocopy') === 'true';
  });
  const [wordWrap, setWordWrap] = useState<boolean>(() => {
    return localStorage.getItem('omnitools_word_wrap') !== 'false';
  });
  const [autoSaveDrafts, setAutoSaveDrafts] = useState<boolean>(() => {
    return localStorage.getItem('omnitools_auto_save') !== 'false';
  });

  // 3. Navigation & Shortcuts
  const [defaultTab, setDefaultTab] = useState<string>(() => {
    return localStorage.getItem('omnitools_default_tab') || 'home';
  });
  const [searchHotkey, setSearchHotkey] = useState<string>(() => {
    return localStorage.getItem('omnitools_search_hotkey') || 'ctrl-k';
  });
  const [restoreLastTool, setRestoreLastTool] = useState<boolean>(() => {
    return localStorage.getItem('omnitools_restore_last_tool') === 'true';
  });

  // 4. Sound & Audio Feedback
  const [soundEnabled, setSoundEnabled] = useState<boolean>(isSoundEnabled);
  const [soundVolume, setSoundVolume] = useState<number>(getSoundVolume);
  const [soundTheme, setSoundTheme] = useState<SoundTheme>(getSoundTheme);
  const [isPlayingTestSound, setIsPlayingTestSound] = useState(false);

  // 5. Gemini AI Configuration
  const [geminiKey, setGeminiKey] = useState<string>(() => {
    return localStorage.getItem('omnitools_gemini_key') || '';
  });
  const [showKeyText, setShowKeyText] = useState(false);
  const [geminiModel, setGeminiModel] = useState<string>(() => {
    return localStorage.getItem('omnitools_gemini_model') || 'gemini-2.5-flash';
  });
  const [geminiTemp, setGeminiTemp] = useState<string>(() => {
    return localStorage.getItem('omnitools_gemini_temperature') || '0.7';
  });
  const [aiTestStatus, setAiTestStatus] = useState<{ testing: boolean; result?: string; success?: boolean } | null>(null);

  // 6. Privacy & Community
  const [showNameOnLeaderboard, setShowNameOnLeaderboard] = useState<boolean>(() => {
    return localStorage.getItem('omnitools_show_name') === 'true';
  });
  const [showAvatar, setShowAvatar] = useState<boolean>(() => {
    return localStorage.getItem('omnitools_show_avatar') !== 'false';
  });
  const [trackUsage, setTrackUsage] = useState<boolean>(() => {
    return localStorage.getItem('omnitools_track_usage') !== 'false';
  });

  // 7. Notifications & Celebrations
  const [toastPos, setToastPos] = useState<string>(() => {
    return localStorage.getItem('omnitools_toast_pos') || 'bottom-right';
  });
  const [toastDuration, setToastDuration] = useState<number>(() => {
    return parseInt(localStorage.getItem('omnitools_toast_duration') || '3500', 10);
  });
  const [celebrationEffects, setCelebrationEffects] = useState<boolean>(() => {
    return localStorage.getItem('omnitools_celebrations') !== 'false';
  });

  // System Storage Stats
  const [storageEstimate, setStorageEstimate] = useState<string>('Estimating...');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Apply Appearance Settings to DOM
  useEffect(() => {
    localStorage.setItem('omnitools_theme', currentTheme);
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.documentElement.className = currentTheme === 'cyberpunk' ? 'dark cyberpunk' : 'dark';
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('omnitools_font_scale', fontScale);
    document.documentElement.setAttribute('data-font-scale', fontScale);
  }, [fontScale]);

  useEffect(() => {
    localStorage.setItem('omnitools_code_font', codeFont);
    document.documentElement.setAttribute('data-code-font', codeFont);
  }, [codeFont]);

  useEffect(() => {
    localStorage.setItem('omnitools_high_contrast', String(highContrast));
    document.documentElement.setAttribute('data-high-contrast', String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('omnitools_reduced_motion', String(reducedMotion));
    document.documentElement.setAttribute('data-reduced-motion', String(reducedMotion));
  }, [reducedMotion]);

  useEffect(() => {
    localStorage.setItem('omnitools_compact', String(compactMode));
  }, [compactMode]);

  // Audio Sync
  useEffect(() => {
    localStorage.setItem('omnitools_sound', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('omnitools_sound_volume', String(soundVolume));
  }, [soundVolume]);

  useEffect(() => {
    localStorage.setItem('omnitools_sound_theme', soundTheme);
  }, [soundTheme]);

  // Query Storage Quota
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((est) => {
        const usageMb = ((est.usage || 0) / (1024 * 1024)).toFixed(2);
        const quotaMb = ((est.quota || 0) / (1024 * 1024)).toFixed(0);
        setStorageEstimate(`${usageMb} MB used (of ~${quotaMb} MB available)`);
      }).catch(() => {
        setStorageEstimate('Available (LocalStorage)');
      });
    } else {
      setStorageEstimate('LocalStorage quota active');
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggle = (
    value: boolean,
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    storageKey: string,
    onLabel: string,
    offLabel: string
  ) => {
    const next = !value;
    setter(next);
    localStorage.setItem(storageKey, String(next));
    playToggleSound(next);
    showToast(next ? onLabel : offLabel);
  };

  const handleTestSound = () => {
    setIsPlayingTestSound(true);
    playClickSound(soundTheme, soundVolume);
    setTimeout(() => {
      playSuccessSound(soundTheme, soundVolume);
      setIsPlayingTestSound(false);
    }, 200);
    showToast(`Played ${soundTheme.toUpperCase()} sound preview`);
  };

  const handleTestAiConnection = async () => {
    const key = geminiKey.trim();
    if (!key) {
      setAiTestStatus({
        testing: false,
        result: 'Please enter a Gemini API key first.',
        success: false
      });
      return;
    }

    setAiTestStatus({ testing: true });
    const startTime = performance.now();

    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const res = await ai.models.generateContent({
        model: geminiModel,
        contents: 'Ping test: respond with OK in one word.',
      });
      const latency = Math.round(performance.now() - startTime);
      if (res && res.text) {
        setAiTestStatus({
          testing: false,
          result: `Connected successfully! Latency: ${latency}ms (${geminiModel})`,
          success: true
        });
        playSuccessSound();
      } else {
        setAiTestStatus({
          testing: false,
          result: 'Received empty response from Gemini API.',
          success: false
        });
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Unknown connection error';
      setAiTestStatus({
        testing: false,
        result: `Connection failed: ${errMsg.slice(0, 120)}`,
        success: false
      });
    }
  };

  const handleExportData = () => {
    playClickSound();
    const backup = {
      app: 'OmniTools',
      version: APP_VERSION,
      exportTimestamp: new Date().toISOString(),
      preferences: {
        theme: currentTheme,
        compactMode,
        fontScale,
        codeFont,
        highContrast,
        reducedMotion,
        tabSize,
        autoCopy,
        wordWrap,
        autoSaveDrafts,
        defaultTab,
        searchHotkey,
        restoreLastTool,
        soundEnabled,
        soundVolume,
        soundTheme,
        geminiModel,
        geminiTemp,
        showNameOnLeaderboard,
        showAvatar,
        trackUsage,
        toastPos,
        toastDuration,
        celebrationEffects
      },
      data: {
        favorites: localStorage.getItem('omnitools_favorites') || localStorage.getItem('omnitools_favorite_tools'),
        usageCounts: localStorage.getItem('omnitools_tool_usage_counts'),
        recentSearches: localStorage.getItem('omnitools_recent_searches'),
        ratings: localStorage.getItem('omnitools_tool_ratings')
      }
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnitools_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Workspace backup exported successfully!');
    playSuccessSound();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const backup = JSON.parse(text);

        if (!backup.preferences && !backup.data) {
          showToast('Invalid backup file format');
          return;
        }

        // Restore Preferences
        if (backup.preferences) {
          const p = backup.preferences;
          if (p.theme) {
            setCurrentTheme(p.theme);
            localStorage.setItem('omnitools_theme', p.theme);
          }
          if (p.soundEnabled !== undefined) {
            setSoundEnabled(p.soundEnabled);
            localStorage.setItem('omnitools_sound', String(p.soundEnabled));
          }
          if (p.soundVolume !== undefined) {
            setSoundVolume(p.soundVolume);
            localStorage.setItem('omnitools_sound_volume', String(p.soundVolume));
          }
          if (p.soundTheme) {
            setSoundTheme(p.soundTheme);
            localStorage.setItem('omnitools_sound_theme', p.soundTheme);
          }
          if (p.compactMode !== undefined) {
            setCompactMode(p.compactMode);
            localStorage.setItem('omnitools_compact', String(p.compactMode));
          }
          if (p.codeFont) {
            setCodeFont(p.codeFont);
            localStorage.setItem('omnitools_code_font', p.codeFont);
          }
          if (p.fontScale) {
            setFontScale(p.fontScale);
            localStorage.setItem('omnitools_font_scale', p.fontScale);
          }
          if (p.highContrast !== undefined) {
            setHighContrast(p.highContrast);
            localStorage.setItem('omnitools_high_contrast', String(p.highContrast));
          }
          if (p.reducedMotion !== undefined) {
            setReducedMotion(p.reducedMotion);
            localStorage.setItem('omnitools_reduced_motion', String(p.reducedMotion));
          }
          if (p.tabSize) {
            setTabSize(p.tabSize);
            localStorage.setItem('omnitools_tab_size', String(p.tabSize));
          }
          if (p.autoCopy !== undefined) {
            setAutoCopy(p.autoCopy);
            localStorage.setItem('omnitools_autocopy', String(p.autoCopy));
          }
          if (p.defaultTab) {
            setDefaultTab(p.defaultTab);
            localStorage.setItem('omnitools_default_tab', p.defaultTab);
          }
        }

        // Restore Data items
        if (backup.data) {
          if (backup.data.favorites) {
            localStorage.setItem('omnitools_favorite_tools', backup.data.favorites);
          }
          if (backup.data.usageCounts) {
            localStorage.setItem('omnitools_tool_usage_counts', backup.data.usageCounts);
          }
        }

        playSuccessSound();
        showToast('Workspace backup successfully restored!');
      } catch {
        showToast('Failed to parse JSON backup file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClearCache = () => {
    if (window.confirm('Clear local search history and tool usage counters? Favorites and CP balance will be preserved.')) {
      localStorage.removeItem('omnitools_recent_searches');
      localStorage.removeItem('omnitools_tool_usage_counts');
      playClickSound();
      showToast('Local telemetry cache cleared successfully.');
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Reset visual and editor preferences to defaults?')) {
      setCurrentTheme('indigo');
      setCompactMode(false);
      setFontScale('100');
      setCodeFont('jetbrains');
      setHighContrast(false);
      setReducedMotion(false);
      setTabSize(2);
      setAutoCopy(false);
      setWordWrap(true);
      setAutoSaveDrafts(true);
      setDefaultTab('home');
      setSearchHotkey('ctrl-k');
      setRestoreLastTool(false);
      setSoundEnabled(true);
      setSoundVolume(0.5);
      setSoundTheme('modern');
      setToastPos('bottom-right');
      setToastDuration(3500);
      setCelebrationEffects(true);
      playSuccessSound();
      showToast('All settings reset to defaults.');
    }
  };

  const themeConfig = THEMES[currentTheme] || THEMES.indigo;

  const sectionMatches = (sec: SettingsSection) => {
    return activeSection === 'all' || activeSection === sec;
  };

  return (
    <div className={`min-h-screen ${themeConfig.bgClass} flex flex-col transition-colors duration-300 text-slate-200`}>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="px-4 py-3 bg-emerald-950/90 backdrop-blur-md text-emerald-200 border border-emerald-700/80 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack ? (
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title="Return to Workspace"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            ) : (
              <a
                href="./index.html"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-bold"
                title="Return to Workspace"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Dashboard</span>
              </a>
            )}

            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/20">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-extrabold text-white leading-tight">Workspace Settings</h1>
                <p className="text-[10px] text-slate-400 hidden sm:block">Configure tools, developer preferences, AI & audio</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetSettings}
              className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              title="Reset all settings to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset Defaults</span>
            </button>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800 font-bold">
              v{APP_VERSION}
            </span>
          </div>
        </div>
      </header>

      {/* Main Settings Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Category Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Settings', icon: Layers },
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'developer', label: 'Developer', icon: Terminal },
            { id: 'navigation', label: 'Navigation', icon: Keyboard },
            { id: 'sound', label: 'Sound FX', icon: Volume2 },
            { id: 'ai', label: 'Gemini AI', icon: Sparkles },
            { id: 'privacy', label: 'Privacy', icon: ShieldCheck },
            { id: 'notifications', label: 'Toasts', icon: Bell },
            { id: 'data', label: 'Storage & Backup', icon: Database },
            { id: 'system', label: 'System', icon: Info },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSection(tab.id as SettingsSection);
                  playClickSound();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isSel
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. APPEARANCE & DISPLAY */}
        {sectionMatches('appearance') && (
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-purple-950 text-purple-400 border border-purple-800">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">Appearance & Workspace Themes</h2>
                <p className="text-xs text-slate-400">Themes, layout density, font sizing, and visual contrast</p>
              </div>
            </div>

            {/* Theme Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Workspace Theme</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(Object.keys(THEMES) as ThemeId[]).map((tKey) => {
                  const th = THEMES[tKey];
                  const isSelected = currentTheme === tKey;
                  return (
                    <div
                      key={tKey}
                      onClick={() => {
                        setCurrentTheme(tKey);
                        playClickSound();
                        showToast(`Theme switched to ${th.name}`);
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-white">{th.name}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono">{th.id}</div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Layout Density & Sizing Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Font Scaling */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>UI Font Size Scale</span>
                  <span className="text-blue-400 font-mono text-[11px]">{fontScale}%</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {['90', '100', '110', '120'].map((scale) => (
                    <button
                      key={scale}
                      onClick={() => {
                        setFontScale(scale);
                        playClickSound();
                        showToast(`Font scale set to ${scale}%`);
                      }}
                      className={`py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        fontScale === scale
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {scale}%
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500">Adjusts text scale across all tools and panels</p>
              </div>

              {/* Code Monospace Font */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Monospace Code Font</span>
                  <span className="text-purple-400 font-mono text-[10px] capitalize">{codeFont}</span>
                </div>
                <select
                  value={codeFont}
                  onChange={(e) => {
                    setCodeFont(e.target.value);
                    playClickSound();
                    showToast(`Code font: ${e.target.value}`);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-blue-500 cursor-pointer"
                >
                  <option value="jetbrains">JetBrains Mono</option>
                  <option value="fira">Fira Code</option>
                  <option value="source">Source Code Pro</option>
                  <option value="system">System Monospace</option>
                </select>
                <p className="text-[10px] text-slate-500">Used in code editors, JSON viewers, regex testers & diffs</p>
              </div>
            </div>

            {/* Visual Toggles */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              {/* Compact Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Compact UI Mode</div>
                  <div className="text-[11px] text-slate-400">Reduce tool padding for high-density information displays</div>
                </div>
                <button
                  onClick={() => handleToggle(compactMode, setCompactMode, 'omnitools_compact', 'Compact mode enabled', 'Compact mode disabled')}
                  className={`w-12 h-6 rounded-full transition relative p-1 cursor-pointer ${compactMode ? 'bg-blue-600' : 'bg-slate-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition transform ${compactMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* High Contrast Focus */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">High-Contrast Focus Outlines</div>
                  <div className="text-[11px] text-slate-400">Enhance focus rings around active controls for accessibility</div>
                </div>
                <button
                  onClick={() => handleToggle(highContrast, setHighContrast, 'omnitools_high_contrast', 'High contrast focus enabled', 'High contrast focus disabled')}
                  className={`w-12 h-6 rounded-full transition relative p-1 cursor-pointer ${highContrast ? 'bg-blue-600' : 'bg-slate-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition transform ${highContrast ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Reduced Motion & Animations</div>
                  <div className="text-[11px] text-slate-400">Minimize animations for lower CPU usage or motion sensitivity</div>
                </div>
                <button
                  onClick={() => handleToggle(reducedMotion, setReducedMotion, 'omnitools_reduced_motion', 'Reduced motion enabled', 'Standard animations restored')}
                  className={`w-12 h-6 rounded-full transition relative p-1 cursor-pointer ${reducedMotion ? 'bg-blue-600' : 'bg-slate-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition transform ${reducedMotion ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 2. DEVELOPER & TOOL DEFAULTS */}
        {sectionMatches('developer') && (
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">Developer & Tool Defaults</h2>
                <p className="text-xs text-slate-400">Configure code editor indentation, auto-copying, and draft persistence</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tab Size */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <label className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Code Indentation (Tab Size)</span>
                  <span className="text-cyan-400 font-mono text-[11px]">{tabSize} Spaces</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[2, 4].map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setTabSize(size);
                        localStorage.setItem('omnitools_tab_size', String(size));
                        playClickSound();
                        showToast(`Indentation set to ${size} spaces`);
                      }}
                      className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        tabSize === size
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {size} Spaces
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500">Applies to JSON, SQL, Markdown, and Code formatters</p>
              </div>

              {/* Line Wrapping */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Soft Word Wrap</div>
                  <div className="text-[11px] text-slate-400">Wrap long lines instead of horizontal scrolling</div>
                </div>
                <button
                  onClick={() => handleToggle(wordWrap, setWordWrap, 'omnitools_word_wrap', 'Word wrap enabled', 'Word wrap disabled')}
                  className={`w-12 h-6 rounded-full transition relative p-1 cursor-pointer ${wordWrap ? 'bg-blue-600' : 'bg-slate-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition transform ${wordWrap ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-800">
              {/* Auto Copy */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Auto-Copy Output to Clipboard</div>
                  <div className="text-[11px] text-slate-400">Automatically copy formatted code, hashes, or generated tokens upon generation</div>
                </div>
                <button
                  onClick={() => handleToggle(autoCopy, setAutoCopy, 'omnitools_autocopy', 'Auto-copy output enabled', 'Auto-copy output disabled')}
                  className={`w-12 h-6 rounded-full transition relative p-1 cursor-pointer ${autoCopy ? 'bg-blue-600' : 'bg-slate-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition transform ${autoCopy ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Auto Save Tool Drafts */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Auto-Save Tool Input Scratchpads</div>
                  <div className="text-[11px] text-slate-400">Persist uncommitted markdown, regex, and calculator inputs across page reloads</div>
                </div>
                <button
                  onClick={() => handleToggle(autoSaveDrafts, setAutoSaveDrafts, 'omnitools_auto_save', 'Input auto-save enabled', 'Input auto-save disabled')}
                  className={`w-12 h-6 rounded-full transition relative p-1 cursor-pointer ${autoSaveDrafts ? 'bg-blue-600' : 'bg-slate-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition transform ${autoSaveDrafts ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 3. NAVIGATION & WORKSPACE SHORTCUTS */}
        {sectionMatches('navigation') && (
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-blue-950 text-blue-400 border border-blue-800">
                <Keyboard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">Navigation & Workspace Shortcuts</h2>
                <p className="text-xs text-slate-400">Set startup defaults, hotkeys, and quick launcher behavior</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Default Startup Landing Page */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <label className="text-xs font-bold text-white">Default Landing View</label>
                <select
                  value={defaultTab}
                  onChange={(e) => {
                    setDefaultTab(e.target.value);
                    localStorage.setItem('omnitools_default_tab', e.target.value);
                    playClickSound();
                    showToast(`Default landing tab: ${e.target.value.toUpperCase()}`);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-blue-500 cursor-pointer"
                >
                  <option value="home">Homepage (Tools Hub & Categories)</option>
                  <option value="favorites">My Starred Favorites Hub</option>
                  <option value="request-hub">Community Requests Queue</option>
                  <option value="leaderboard">Global Contributor Leaderboard</option>
                </select>
                <p className="text-[10px] text-slate-500">Initial tab loaded when opening the application without URL parameters</p>
              </div>

              {/* Quick Search Shortcut */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <label className="text-xs font-bold text-white">OmniSearch Quick Hotkey</label>
                <select
                  value={searchHotkey}
                  onChange={(e) => {
                    setSearchHotkey(e.target.value);
                    localStorage.setItem('omnitools_search_hotkey', e.target.value);
                    playClickSound();
                    showToast(`Search shortcut: ${e.target.value}`);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-blue-500 cursor-pointer"
                >
                  <option value="ctrl-k">Ctrl + K / ⌘ + K (Standard)</option>
                  <option value="slash">/ Forward Slash (Vim style)</option>
                  <option value="alt-s">Alt + S (Windows / Linux)</option>
                  <option value="disabled">Disabled (Mouse click only)</option>
                </select>
                <p className="text-[10px] text-slate-500">Trigger key combo to instantly summon the 100+ tool search modal</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Restore Last Active Tool on Startup</div>
                <div className="text-[11px] text-slate-400">Remember and resume your previously opened tool on reload</div>
              </div>
              <button
                onClick={() => handleToggle(restoreLastTool, setRestoreLastTool, 'omnitools_restore_last_tool', 'Resume last tool enabled', 'Resume last tool disabled')}
                className={`w-12 h-6 rounded-full transition relative p-1 cursor-pointer ${restoreLastTool ? 'bg-blue-600' : 'bg-slate-800'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition transform ${restoreLastTool ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </section>
        )}

        {/* 4. SOUND FX & AUDIO FEEDBACK */}
        {sectionMatches('sound') && (
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <h2 className="text-base font-extrabold text-white">Sound FX & Audio Feedback</h2>
                <p className="text-xs text-slate-400">Synthesized audio cues for buttons, toggles, success chimes & tool interactions</p>
              </div>
              <button
                onClick={handleTestSound}
                disabled={isPlayingTestSound}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Sound</span>
              </button>
            </div>

            {/* Master Sound Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">UI Interaction Sounds</div>
                <div className="text-[11px] text-slate-400">Play subtle haptic audio feedback on tool launches, copies, and clicks</div>
              </div>
              <button
                onClick={() => handleToggle(soundEnabled, setSoundEnabled, 'omnitools_sound', 'Sound FX enabled', 'Sound FX muted')}
                className={`w-12 h-6 rounded-full transition relative p-1 cursor-pointer ${soundEnabled ? 'bg-emerald-600' : 'bg-slate-800'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {soundEnabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                {/* Volume Slider */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>Sound Volume</span>
                    <span className="text-emerald-400 font-mono">{Math.round(soundVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="1"
                    step="0.05"
                    value={soundVolume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setSoundVolume(v);
                      playClickSound(soundTheme, v);
                    }}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Whisper (10%)</span>
                    <span>Standard (50%)</span>
                    <span>Max (100%)</span>
                  </div>
                </div>

                {/* Sound Theme Selector */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Audio Profile Theme</span>
                    <span className="text-emerald-400 font-mono text-[10px] capitalize">{soundTheme}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'modern', label: 'Modern Crisp' },
                      { id: 'retro', label: 'Retro 8-Bit' },
                      { id: 'chime', label: 'Harmonic Chime' },
                      { id: 'mechanical', label: 'Mechanical Switch' },
                    ].map((th) => (
                      <button
                        key={th.id}
                        onClick={() => {
                          setSoundTheme(th.id as SoundTheme);
                          playSuccessSound(th.id as SoundTheme, soundVolume);
                          showToast(`Audio theme: ${th.label}`);
                        }}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold transition text-left truncate cursor-pointer ${
                          soundTheme === th.id
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {th.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* 5. GEMINI AI CONFIGURATION */}
        {sectionMatches('ai') && (
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-purple-950 text-purple-400 border border-purple-800">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-extrabold text-white">Gemini AI Integration (GitHub Pages & Cloud)</h2>
                <p className="text-xs text-slate-400">Configure your Gemini API key for smart tool ideas, prompt generators & AI assistants</p>
              </div>
            </div>

            {/* API Key Box */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Gemini API Key</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showKeyText ? 'text' : 'password'}
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 pr-10 text-xs text-white font-mono focus:outline-hidden focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeyText(!showKeyText)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showKeyText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={() => {
                    localStorage.setItem('omnitools_gemini_key', geminiKey.trim());
                    playSuccessSound();
                    showToast('Gemini API key saved to local storage!');
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-purple-500/20 cursor-pointer"
                >
                  Save Key
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Stored client-side in your browser's private <code className="text-purple-300">localStorage</code>. Never committed or sent to external servers.
              </p>
            </div>

            {/* AI Model & Temperature Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Model Choice */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <label className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Gemini Model</span>
                  <span className="text-purple-400 font-mono text-[10px]">{geminiModel}</span>
                </label>
                <select
                  value={geminiModel}
                  onChange={(e) => {
                    setGeminiModel(e.target.value);
                    localStorage.setItem('omnitools_gemini_model', e.target.value);
                    playClickSound();
                    showToast(`Gemini Model: ${e.target.value}`);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-purple-500 cursor-pointer"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fast, Recommended)</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Reasoning)</option>
                  <option value="gemini-2.5-flash-lite">Gemini 2.5 Flash Lite (Ultra-Low Latency)</option>
                </select>
                <p className="text-[10px] text-slate-500">Selected model handles idea generation & enhancement suggestions</p>
              </div>

              {/* Temperature */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <label className="text-xs font-bold text-white flex items-center justify-between">
                  <span>AI Creativity (Temperature)</span>
                  <span className="text-purple-400 font-mono text-[11px]">{geminiTemp}</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {[
                    { val: '0.2', label: 'Precise' },
                    { val: '0.7', label: 'Balanced' },
                    { val: '1.0', label: 'Creative' },
                  ].map((temp) => (
                    <button
                      key={temp.val}
                      onClick={() => {
                        setGeminiTemp(temp.val);
                        localStorage.setItem('omnitools_gemini_temperature', temp.val);
                        playClickSound();
                        showToast(`Creativity set to ${temp.label} (${temp.val})`);
                      }}
                      className={`py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        geminiTemp === temp.val
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {temp.label}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500">Controls variety and exploratory range of generated ideas</p>
              </div>
            </div>

            {/* Test Connection Button & Status */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <button
                onClick={handleTestAiConnection}
                disabled={aiTestStatus?.testing}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-800/50 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 text-purple-400 ${aiTestStatus?.testing ? 'animate-spin' : ''}`} />
                <span>{aiTestStatus?.testing ? 'Testing Connection...' : 'Test AI Connection & Latency'}</span>
              </button>

              {aiTestStatus && (
                <div
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                    aiTestStatus.success
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                      : 'bg-rose-950/80 text-rose-300 border-rose-800'
                  }`}
                >
                  {aiTestStatus.success ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  <span>{aiTestStatus.result}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 6. PRIVACY & COMMUNITY LEADERBOARD */}
        {sectionMatches('privacy') && (
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-blue-950 text-blue-400 border border-blue-800">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">Privacy & Leaderboard Visibility</h2>
                <p className="text-xs text-slate-400">Control how your identity and tool usage telemetry are shared</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Show Name */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Show my name on the global leaderboard</div>
                  <div className="text-[11px] text-slate-400">If disabled, your name is hidden and only your avatar/initial is displayed</div>
                </div>
                <button
                  onClick={() => handleToggle(showNameOnLeaderboard, setShowNameOnLeaderboard, 'omnitools_show_name', 'Name visible on leaderboard', 'Name hidden on leaderboard')}
                  className={`w-12 h-6 rounded-full transition relative p-1 cursor-pointer ${showNameOnLeaderboard ? 'bg-blue-600' : 'bg-slate-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition transform ${showNameOnLeaderboard ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Show Avatar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white">Public Profile Picture Visibility</div>
                  <div className="text-[11px] text-slate-400">Display Google account photo publicly or use anonymous geometric avatar</div>
                </div>
                <button
                  onClick={() => handleToggle(showAvatar, setShowAvatar, 'omnitools_show_avatar', 'Profile photo visible', 'Anonymous avatar active')}
                  className={`w-12 h-6 rounded-full transition relative p-1 cursor-pointer ${showAvatar ? 'bg-blue-600' : 'bg-slate-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition transform ${showAvatar ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Local Usage Tracking */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white">Local Tool Usage Tracking</div>
                  <div className="text-[11px] text-slate-400">Record launch frequency locally to provide personalized tool recommendations</div>
                </div>
                <button
                  onClick={() => handleToggle(trackUsage, setTrackUsage, 'omnitools_track_usage', 'Usage tracking enabled', 'Usage tracking disabled (Do Not Track)')}
                  className={`w-12 h-6 rounded-full transition relative p-1 cursor-pointer ${trackUsage ? 'bg-blue-600' : 'bg-slate-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition transform ${trackUsage ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 7. NOTIFICATIONS & CELEBRATIONS */}
        {sectionMatches('notifications') && (
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-amber-950 text-amber-400 border border-amber-800">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">Notifications & Toast Alerts</h2>
                <p className="text-xs text-slate-400">Configure alert positioning, timing, and gamification celebration effects</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Toast Position */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <label className="text-xs font-bold text-white">Notification Alert Position</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'bottom-right', label: 'Bottom Right' },
                    { id: 'top-right', label: 'Top Right' },
                    { id: 'bottom-center', label: 'Bottom Center' },
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => {
                        setToastPos(pos.id);
                        localStorage.setItem('omnitools_toast_pos', pos.id);
                        playClickSound();
                        showToast(`Toast position: ${pos.label}`);
                      }}
                      className={`py-2 px-1 text-[11px] font-bold rounded-xl transition cursor-pointer text-center truncate ${
                        toastPos === pos.id
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toast Duration */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <label className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Auto-Dismiss Duration</span>
                  <span className="text-amber-400 font-mono text-[11px]">{toastDuration / 1000}s</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { ms: 2000, label: 'Fast (2s)' },
                    { ms: 3500, label: 'Normal (3.5s)' },
                    { ms: 5000, label: 'Relaxed (5s)' },
                  ].map((dur) => (
                    <button
                      key={dur.ms}
                      onClick={() => {
                        setToastDuration(dur.ms);
                        localStorage.setItem('omnitools_toast_duration', String(dur.ms));
                        playClickSound();
                        showToast(`Notification duration: ${dur.label}`);
                      }}
                      className={`py-2 text-[11px] font-bold rounded-xl transition cursor-pointer text-center ${
                        toastDuration === dur.ms
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Gamification Sparkles & Level-Up Celebrations</div>
                <div className="text-[11px] text-slate-400">Display visual celebration effects when claiming daily check-in or earning CP</div>
              </div>
              <button
                onClick={() => handleToggle(celebrationEffects, setCelebrationEffects, 'omnitools_celebrations', 'Celebration effects enabled', 'Celebration effects disabled')}
                className={`w-12 h-6 rounded-full transition relative p-1 cursor-pointer ${celebrationEffects ? 'bg-blue-600' : 'bg-slate-800'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition transform ${celebrationEffects ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </section>
        )}

        {/* 8. DATA, BACKUP & STORAGE */}
        {sectionMatches('data') && (
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">Data & Storage Management</h2>
                <p className="text-xs text-slate-400">Export, import, and backup your workspace favorites, preferences & local data</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Export Backup */}
              <button
                onClick={handleExportData}
                className="p-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-2xl flex items-center gap-3 text-left transition group cursor-pointer"
              >
                <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 group-hover:scale-105 transition">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition">Export Full Backup</div>
                  <div className="text-[10px] text-slate-400">Download settings & favorites JSON</div>
                </div>
              </button>

              {/* Import Backup */}
              <label className="p-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-2xl flex items-center gap-3 text-left transition group cursor-pointer">
                <div className="p-2.5 rounded-xl bg-blue-950 text-blue-400 border border-blue-800 group-hover:scale-105 transition">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-white group-hover:text-blue-300 transition">Import Workspace Backup</div>
                  <div className="text-[10px] text-slate-400">Restore from JSON backup file</div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>

              {/* Clear Telemetry */}
              <button
                onClick={handleClearCache}
                className="p-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-2xl flex items-center gap-3 text-left transition group cursor-pointer"
              >
                <div className="p-2.5 rounded-xl bg-rose-950 text-rose-400 border border-rose-800 group-hover:scale-105 transition">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-rose-300 transition">Clear Search Telemetry</div>
                  <div className="text-[10px] text-slate-400">Reset recent searches & counters</div>
                </div>
              </button>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 text-[11px]">Local Client Storage Footprint:</span>
              <span className="text-emerald-400 font-bold">{storageEstimate}</span>
            </div>
          </section>
        )}

        {/* 9. SYSTEM INFORMATION & ABOUT */}
        {sectionMatches('system') && (
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800">
                <Info className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-extrabold text-white">System Information & Diagnostics</h2>
                <p className="text-xs text-slate-400">OmniTools multi-utility platform architecture metadata</p>
              </div>
              <button
                onClick={() => {
                  playClickSound();
                  window.location.reload();
                }}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                title="Reload workspace"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload App</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono bg-slate-950 p-4 rounded-2xl border border-slate-800">
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
              <div>
                <div className="text-slate-500 text-[10px]">TOTAL UTILITIES</div>
                <div className="text-blue-400 font-bold mt-0.5">100+ Tools</div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
