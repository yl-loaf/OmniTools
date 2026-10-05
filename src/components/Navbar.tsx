/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, FirebaseCustomConfig, ADMIN_EMAIL, ThemeId } from '../types';
import { THEMES } from '../data/toolsRegistry';
import { APP_VERSION } from '../../version.js';
import {
  Wrench,
  Calculator,
  Timer,
  Type,
  ArrowRightLeft,
  QrCode,
  MessageSquarePlus,
  Trophy,
  Flame,
  Search,
  LogIn,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Sparkles,
  FileText,
  Braces,
  Palette,
  Lock,
  Code,
  Key,
  DollarSign,
  Layers,
  Clock,
  Gauge,
  Keyboard,
  Maximize,
  ChevronDown,
  Database,
  GitCompare,
  Globe,
  Code2,
  FileSpreadsheet,
  ShieldCheck,
  Image,
  Terminal,
  Server,
  Waves,
  Star,
  Heart,
  CloudSun,
  Award,
  Users,
  Box,
  ShieldAlert,
  Settings
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile | null;
  isGuest: boolean;
  onLoginGoogle: () => void;
  onLoginGuest: () => void;
  onLogout: () => void;
  firebaseConfig: FirebaseCustomConfig | null;
  onOpenFirebaseModal: () => void;
  onOpenSearch: () => void;
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  isGuest,
  onLoginGoogle,
  onLoginGuest,
  onLogout,
  firebaseConfig,
  onOpenFirebaseModal,
  onOpenSearch,
  favoriteIds,
  onToggleFavorite,
  currentTheme,
  onThemeChange,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target as Node)) {
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const toolCategories = [
    {
      name: 'File Conversion Suite (100+ Formats)',
      items: [
        { id: 'file-converter', label: 'Universal File Converter Suite', icon: ArrowRightLeft, desc: 'Convert 100+ formats: PNG, JPG, WEBP, PDF, CSV, JSON, Audio & Video' },
        { id: 'convert-png-to-jpg', label: 'PNG to JPG Image Converter', icon: ArrowRightLeft, desc: 'Lossless PNG to JPG with background fill & quality' },
        { id: 'convert-jpg-to-png', label: 'JPG to PNG Image Converter', icon: ArrowRightLeft, desc: 'JPG photos to transparent PNG graphics' },
        { id: 'convert-png-to-webp', label: 'PNG to WEBP Modern Converter', icon: ArrowRightLeft, desc: 'High-compression WEBP converter for web optimization' },
        { id: 'convert-pdf-to-docx', label: 'PDF to Word DOCX Converter', icon: ArrowRightLeft, desc: 'Convert PDF documents into editable Word files' },
        { id: 'convert-docx-to-pdf', label: 'Word DOCX to PDF Exporter', icon: ArrowRightLeft, desc: 'Lock Word formatting into universal PDF format' },
        { id: 'convert-csv-to-json', label: 'CSV to JSON Array Converter', icon: ArrowRightLeft, desc: 'Parse spreadsheet CSV rows into JSON objects' },
        { id: 'convert-json-to-csv', label: 'JSON to CSV Spreadsheet Exporter', icon: ArrowRightLeft, desc: 'Flatten JSON arrays into tabular CSV format' },
        { id: 'convert-json-to-yaml', label: 'JSON to YAML Configuration', icon: ArrowRightLeft, desc: 'Convert JSON to YAML for Docker & Kubernetes' },
        { id: 'convert-mp3-to-wav', label: 'MP3 to WAV Studio Audio', icon: ArrowRightLeft, desc: 'Decode MP3 into uncompressed PCM WAV audio' },
        { id: 'convert-image-to-base64', label: 'Image to Base64 Data URI', icon: ArrowRightLeft, desc: 'Generate inline HTML/CSS Base64 string from images' },
      ],
    },
    {
      name: '3D CAD & Developer Studio',
      items: [
        { id: '3d-viewer', label: '3D File Previewer (STL, OBJ, 3MF)', icon: Box, desc: 'Interactive WebGL 3D mesh inspector with wireframes & stats' },
        { id: '3d-converter', label: '3D File Converter & Quality Optimizer', icon: Box, desc: 'Convert STL, OBJ, 3MF, PLY & GLTF with quality decimation & unit scaling' },
        { id: 'markdown', label: 'Markdown Live Editor', icon: FileText, desc: 'GitHub-flavored preview, word count & export' },
        { id: 'json-studio', label: 'JSON Formatter & Tree', icon: Braces, desc: 'Linting, tree visualizer, path finder & minifier' },
        { id: 'color-studio', label: 'Tailwind & HEX Color Studio', icon: Palette, desc: 'Shades, contrast checker, WCAG & CSS variables' },
        { id: 'regex-tester', label: 'Regex Tester & Matcher', icon: Code, desc: 'Live regex testing, flags & match highlighter' },
        { id: 'css-generator', label: 'CSS Flexbox & Grid Gen', icon: Wrench, desc: 'Interactive flexbox and CSS generator' },
        { id: 'sql-formatter', label: 'SQL Formatter & Linter', icon: Database, desc: 'Beautify SQL queries for PostgreSQL, MySQL & SQLite' },
        { id: 'diff-checker', label: 'Text & Code Diff Checker', icon: GitCompare, desc: 'Side-by-side diff comparison with line highlights' },
        { id: 'meta-gen', label: 'SEO Meta Tag Generator', icon: Globe, desc: 'OpenGraph, Twitter cards, and structured JSON-LD' },
        { id: 'jwt-debugger', label: 'JWT Token Debugger', icon: ShieldCheck, desc: 'Decode header, payload, and verify signatures' },
        { id: 'cron-gen', label: 'Cron Expression Generator', icon: Terminal, desc: 'Visual cron schedule builder & human descriptions' },
        { id: 'svg-optimizer', label: 'SVG Optimizer & Viewer', icon: Image, desc: 'Clean, minify, and preview vector graphics' },
        { id: 'barcode-gen', label: 'Barcode & QR Generator', icon: QrCode, desc: 'UPC, Code 128, and custom QR codes with download' },
        { id: 'chmod-calc', label: 'Linux Chmod Calculator', icon: Lock, desc: 'File permission symbolic & numeric octal calculator' },
        { id: 'curl-builder', label: 'cURL to Fetch/Axios Builder', icon: Terminal, desc: 'Convert HTTP cURL commands to JavaScript fetch' },
      ],
    },
    {
      name: 'Daily Life & Suites (30+)',
      items: [
        { id: 'health-suite', label: 'Health, Fitness & Fasting', icon: Heart, desc: 'BMI, water tracker, calories & intermittent fasting timer' },
        { id: 'finance-suite', label: 'Finance, Budget & Life', icon: DollarSign, desc: 'Salary tax estimator, tip calculator, age & GPA calculators' },
        { id: 'productivity-suite', label: 'Productivity & Focus', icon: Clock, desc: 'Pomodoro timer, meeting planner, word counter & stopwatch' },
        { id: 'home-suite', label: 'Home, Travel & Utility', icon: CloudSun, desc: 'Weather outfit planner, packing checklist & unit converter' },
        { id: 'quick-utils-suite', label: 'Quick Utilities & Conversions', icon: Globe, desc: 'Morse code translator, case converter, random picker & dice' },
      ],
    },
    {
      name: 'Data, Security & Finance',
      items: [
        { id: 'crypto-encoder', label: 'Base64 & Hash Crypto', icon: Lock, desc: 'Base64 image/text & SHA-256 / SHA-512' },
        { id: 'password-gen', label: 'Password & UUID Gen', icon: Key, desc: 'NIST passwords, passphrases & UUID v4' },
        { id: 'csv-viewer', label: 'CSV Data Grid & JSON', icon: FileSpreadsheet, desc: 'Spreadsheet viewer, search & markdown' },
        { id: 'html-entities', label: 'HTML Entity Encoder', icon: Code2, desc: 'Escape special symbols & unicode codes' },
        { id: 'http-lookup', label: 'HTTP Status Lookup', icon: Server, desc: 'REST API 2xx, 3xx, 4xx, 5xx guide' },
        { id: 'finance-calc', label: 'Finance & Loan Studio', icon: DollarSign, desc: 'Mortgage amortization & compound interest' },
        { id: 'calculator', label: 'Scientific Calculator', icon: Calculator, desc: 'Trig, exponents, parentheses & memory' },
        { id: 'speed-test', label: 'Network & Bulk Speed Test', icon: Gauge, desc: 'Download/upload bandwidth & raw bulk transfer' },
        { id: 'typing-test', label: 'Typing Speed Test (WPM)', icon: Keyboard, desc: 'Real-time WPM, accuracy & character metrics' },
        { id: 'precision-timer', label: 'High-Precision % Timer', icon: Timer, desc: 'Dynamic decimal progress bar ticking 10x/sec' },
        { id: 'countdown', label: 'Event Countdown Timer', icon: Clock, desc: 'Real-time countdown in mm:dd:hh:mm:ss format' },
        { id: 'time-converter', label: 'Time & World Clocks', icon: Clock, desc: 'Unix timestamps & world timezones' },
        { id: 'timer', label: 'Pomodoro & Timer', icon: Timer, desc: 'Focus intervals & lap stopwatch' },
        { id: 'text-tools', label: 'Text & String Tools', icon: Type, desc: 'Case conversions, word count & diff' },
        { id: 'lorem-gen', label: 'Lorem Ipsum Generator', icon: FileText, desc: 'Mock copy paragraphs, words & HTML tags' },
        { id: 'sound-synth', label: 'Binaural & Noise Synth', icon: Waves, desc: 'White/pink noise & theta focus waves' },
        { id: 'friends-hub', label: 'Friends & Social Hub', icon: Users, desc: 'Add friends & see names in contributions' },
        { id: 'unit-converter', label: 'Unit Converter', icon: ArrowRightLeft, desc: 'Universal metrics & conversions' },
      ],
    },
  ];

  const allTools = toolCategories.flatMap((c) => c.items);
  const activeTool = allTools.find((t) => t.id === activeTab);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 group text-left focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base tracking-tight text-white group-hover:text-blue-400 transition">
                    OmniTools
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                    v{APP_VERSION}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Professional 55+ Tool Suite</p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'home'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Dashboard
              </button>

              {/* Tools Dropdown Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    allTools.some((t) => t.id === activeTab)
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{activeTool ? activeTool.label : 'All Utilities'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 max-h-[75vh] overflow-y-auto space-y-4 animate-in fade-in">
                    {toolCategories.map((cat, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2">
                          {cat.name}
                        </div>
                        <div className="grid grid-cols-1 gap-1">
                          {cat.items.map((tool) => {
                            const IconComp = tool.icon;
                            const isFav = favoriteIds.includes(tool.id);

                            return (
                              <div
                                key={tool.id}
                                className={`flex items-center justify-between p-2 rounded-xl text-xs transition group ${
                                  activeTab === tool.id
                                    ? 'bg-blue-600 text-white font-bold'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                              >
                                <button
                                  onClick={() => {
                                    setActiveTab(tool.id);
                                    setDropdownOpen(false);
                                  }}
                                  className="flex items-center gap-2.5 flex-1 text-left"
                                >
                                  <IconComp className={`w-4 h-4 shrink-0 ${activeTab === tool.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                                  <div className="truncate">
                                    <div className="font-semibold">{tool.label}</div>
                                    <div className={`text-[10px] truncate ${activeTab === tool.id ? 'text-blue-100' : 'text-slate-500'}`}>
                                      {tool.desc}
                                    </div>
                                  </div>
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleFavorite(tool.id);
                                  }}
                                  title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                                  className={`p-1.5 rounded-lg transition ${
                                    isFav ? 'text-amber-400 hover:bg-amber-950/40' : 'text-slate-600 hover:text-slate-300 hover:bg-slate-700'
                                  }`}
                                >
                                  <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveTab('request-hub')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'request-hub'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <MessageSquarePlus className="w-3.5 h-3.5 text-purple-400" />
                <span>Feature Queue</span>
              </button>

              <button
                onClick={() => setActiveTab('friends-hub')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'friends-hub'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>Friends</span>
              </button>

              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'leaderboard'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Leaderboard</span>
              </button>

              {/* Small Admin Button */}
              <button
                onClick={() => setActiveTab('admin')}
                title="Admin Management Portal"
                className={`px-2.5 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-500/30'
                    : 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Admin</span>
              </button>
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Quick Search (Ctrl+K) */}
            <button
              onClick={onOpenSearch}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-400 hover:text-white transition shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search tools...</span>
              <kbd className="px-1.5 py-0.5 bg-slate-900 text-slate-400 rounded text-[10px] font-mono border border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Theme Picker Dropdown */}
            <div className="relative" ref={themeDropdownRef}>
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition border border-slate-700 shadow-xs"
                title="Customize workspace theme & accent"
              >
                <Palette className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden md:inline">{THEMES[currentTheme]?.name || 'Theme'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {themeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1 animate-in fade-in">
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Select Workspace Theme
                  </div>
                  {(Object.keys(THEMES) as ThemeId[]).map((tKey) => {
                    const theme = THEMES[tKey];
                    const isActive = currentTheme === tKey;
                    return (
                      <button
                        key={tKey}
                        onClick={() => {
                          onThemeChange(tKey);
                          setThemeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition text-left ${
                          isActive
                            ? 'bg-blue-600 text-white font-bold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span>{theme.name}</span>
                        {isActive && <span className="w-2 h-2 rounded-full bg-white shadow-xs"></span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Settings Button */}
            <button
              onClick={() => setActiveTab('settings')}
              title="Workspace Settings"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border shadow-xs cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-blue-600 border-blue-500 text-white shadow-blue-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Settings</span>
            </button>

            {currentUser && (
              <div
                title={`${currentUser.displayName}'s Contribution Points`}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/60 border border-amber-700/50 rounded-xl text-amber-300 text-xs font-semibold shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>{currentUser.contributionPoints} CP</span>
                {currentUser.streakDays > 0 && (
                  <span className="flex items-center text-[10px] text-orange-400 ml-1">
                    <Flame className="w-3 h-3 inline text-orange-500" />
                    {currentUser.streakDays}d
                  </span>
                )}
              </div>
            )}

            {currentUser ? (
              <div className="flex items-center gap-2">
                <a
                  href="/OmniTools/profile.html"
                  title="View Profile Page & CP Transaction History"
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-xs text-slate-200 transition"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white uppercase overflow-hidden">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt={currentUser.displayName} className="w-full h-full object-cover" />
                    ) : (
                      currentUser.displayName.charAt(0)
                    )}
                  </div>
                  <span className="max-w-[70px] sm:max-w-[110px] truncate font-medium">
                    {currentUser.displayName}
                  </span>
                  {isGuest && (
                    <span className="text-[10px] bg-slate-700 text-slate-300 px-1 rounded-xs">Guest</span>
                  )}
                </a>
                <button
                  onClick={onLogout}
                  title="Sign out"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onLoginGoogle}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition shadow-xs shadow-blue-500/20"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
                <button
                  onClick={onLoginGuest}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 transition"
                >
                  Guest
                </button>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800 max-h-[80vh] overflow-y-auto space-y-3">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
              <button
                onClick={() => {
                  setActiveTab('home');
                  setMobileMenuOpen(false);
                }}
                className={`p-2 rounded-xl text-xs font-bold text-center ${activeTab === 'home' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                Home
              </button>
              <button
                onClick={() => {
                  setActiveTab('favorites');
                  setMobileMenuOpen(false);
                }}
                className={`p-2 rounded-xl text-xs font-bold text-center ${activeTab === 'favorites' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                Favorites
              </button>
              <button
                onClick={() => {
                  setActiveTab('request-hub');
                  setMobileMenuOpen(false);
                }}
                className={`p-2 rounded-xl text-xs font-bold text-center ${activeTab === 'request-hub' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                Requests
              </button>
              <button
                onClick={() => {
                  setActiveTab('friends-hub');
                  setMobileMenuOpen(false);
                }}
                className={`p-2 rounded-xl text-xs font-bold text-center ${activeTab === 'friends-hub' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                Friends
              </button>
              <button
                onClick={() => {
                  setActiveTab('leaderboard');
                  setMobileMenuOpen(false);
                }}
                className={`p-2 rounded-xl text-xs font-bold text-center ${activeTab === 'leaderboard' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                Ranks
              </button>
              <button
                onClick={() => {
                  setActiveTab('admin');
                  setMobileMenuOpen(false);
                }}
                className={`p-2 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1 ${activeTab === 'admin' ? 'bg-rose-600 text-white' : 'bg-rose-950/60 text-rose-300 border border-rose-800/60'}`}
              >
                <ShieldAlert className="w-3 h-3" />
                <span>Admin</span>
              </button>
            </div>
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  setActiveTab('settings');
                  setMobileMenuOpen(false);
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
              >
                <Settings className="w-4 h-4 text-blue-400" />
                <span>Open Workspace Settings</span>
              </button>
              {currentUser && (
                <a
                  href="/OmniTools/profile.html"
                  className="w-full py-2.5 bg-blue-600/20 border border-blue-500/40 text-blue-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Dedicated Profile Page & CP Ledger</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
