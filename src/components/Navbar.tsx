import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, FirebaseCustomConfig } from '../types';
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
  Keyboard,
  Waves
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
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toolCategories = [
    {
      name: 'Developer & Code Lab',
      items: [
        { id: 'markdown', label: 'Markdown Studio', icon: FileText, desc: 'GFM preview, table editor & HTML export' },
        { id: 'json-studio', label: 'JSON & TypeScript Studio', icon: Braces, desc: 'Format, validate, tree & TS types' },
        { id: 'sql-formatter', label: 'SQL Query Beautifier', icon: Database, desc: 'Format ANSI, MySQL & Postgres queries' },
        { id: 'diff-checker', label: 'Diff Text Comparator', icon: GitCompare, desc: 'Side-by-side line & char diffs' },
        { id: 'regex-tester', label: 'Regex Lab', icon: Code, desc: 'Pattern tester, replace & regex presets' },
        { id: 'jwt-debugger', label: 'JWT Debugger', icon: ShieldCheck, desc: 'Decode headers, claims & expiry timestamps' },
        { id: 'curl-builder', label: 'cURL & API Generator', icon: Terminal, desc: 'cURL to Fetch, Python & Axios code' },
        { id: 'cron-gen', label: 'Cron Scheduler', icon: Clock, desc: 'Build 5-field cron with plain English' },
        { id: 'chmod-calc', label: 'Linux chmod Calc', icon: Terminal, desc: 'Octal 755/644/777 & symbolic permissions' },
        { id: 'keycode-tester', label: 'KeyCode Event Tester', icon: Keyboard, desc: 'Inspect JS key, code, which & modifiers' },
      ],
    },
    {
      name: 'Design & Media Utilities',
      items: [
        { id: 'color-studio', label: 'Color & Contrast Studio', icon: Palette, desc: 'Harmonies, WCAG contrast & gradients' },
        { id: 'css-generator', label: 'CSS Glass & Shadows', icon: Layers, desc: 'Glassmorphism, multi-shadows & clip paths' },
        { id: 'dimension-calc', label: 'Aspect Ratio & DPI', icon: Maximize, desc: 'Resolution solver, print DPI & video size' },
        { id: 'meta-gen', label: 'SEO & Meta Card Studio', icon: Globe, desc: 'OpenGraph, Twitter card & Google preview' },
        { id: 'svg-optimizer', label: 'SVG Vector Cleaner', icon: Image, desc: 'Minify SVG paths & generate Data URIs' },
        { id: 'qr-generator', label: 'QR Code Generator', icon: QrCode, desc: 'Scannable URLs, Wi-Fi & vCards' },
        { id: 'barcode-gen', label: 'Barcode Studio', icon: QrCode, desc: 'Code 128 scannable vector barcodes' },
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
        { id: 'time-converter', label: 'Time & World Clocks', icon: Clock, desc: 'Unix timestamps & world timezones' },
        { id: 'timer', label: 'Pomodoro & Timer', icon: Timer, desc: 'Focus intervals & lap stopwatch' },
        { id: 'text-tools', label: 'Text & String Tools', icon: Type, desc: 'Case conversions, word count & diff' },
        { id: 'lorem-gen', label: 'Lorem Ipsum Generator', icon: FileText, desc: 'Mock copy paragraphs, words & HTML tags' },
        { id: 'sound-synth', label: 'Binaural & Noise Synth', icon: Waves, desc: 'White/pink noise & theta focus waves' },
        { id: 'unit-converter', label: 'Unit Converter', icon: ArrowRightLeft, desc: 'Universal metrics & conversions' },
      ],
    },
  ];

  const allTools = toolCategories.flatMap((c) => c.items);
  const activeTool = allTools.find((t) => t.id === activeTab);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('calculator')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-base tracking-tight group-hover:text-blue-400 transition">
                    OmniTools
                  </span>
                  <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-sm bg-blue-950 text-blue-300 border border-blue-800/60 font-semibold">
                    v{APP_VERSION}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                  25+ Production Web Utilities
                </p>
              </div>
            </button>

            {/* Link to static tools.html catalog */}
            <a
              href="./tools.html"
              title="View static tools directory"
              className="hidden 2xl:flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 bg-slate-800/60 px-2 py-1 rounded-md border border-slate-700/60 transition"
            >
              <span>tools.html</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {/* All Tools Mega Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                  activeTool
                    ? 'bg-blue-600 text-white border-blue-500 shadow-xs shadow-blue-500/30'
                    : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {activeTool ? (
                  <>
                    <activeTool.icon className="w-4 h-4" />
                    <span>{activeTool.label}</span>
                  </>
                ) : (
                  <>
                    <Wrench className="w-4 h-4 text-blue-400" />
                    <span>All 25+ Tools</span>
                  </>
                )}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Dropdown Menu */}
              {toolsDropdownOpen && (
                <div className="absolute left-0 mt-2 w-[850px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 z-50 grid grid-cols-3 gap-5 animate-in fade-in zoom-in-95 duration-150 max-h-[75vh] overflow-y-auto">
                  {toolCategories.map((cat, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 border-b border-slate-800 pb-1">
                        {cat.name}
                      </div>
                      <div className="space-y-1">
                        {cat.items.map((item) => {
                          const Icon = item.icon;
                          const isCurrent = activeTab === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveTab(item.id);
                                setToolsDropdownOpen(false);
                              }}
                              className={`w-full text-left p-2 rounded-xl transition flex items-start gap-2.5 group ${
                                isCurrent
                                  ? 'bg-blue-600 text-white'
                                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                              }`}
                            >
                              <div className={`p-1.5 rounded-lg shrink-0 ${
                                isCurrent ? 'bg-blue-700 text-white' : 'bg-slate-800 group-hover:bg-slate-700 text-blue-400'
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-semibold truncate">
                                  {item.label}
                                </div>
                                <div className={`text-[10px] truncate ${isCurrent ? 'text-blue-100' : 'text-slate-500 group-hover:text-slate-400'}`}>
                                  {item.desc}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Primary Tab Links */}
            <button
              onClick={() => setActiveTab('request-hub')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                activeTab === 'request-hub'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-xs shadow-purple-500/30'
                  : 'text-purple-300 bg-purple-950/40 border-purple-800/60 hover:bg-purple-900/60 hover:text-white'
              }`}
            >
              <MessageSquarePlus className="w-4 h-4 text-purple-400" />
              <span>Request Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-600 text-white border-amber-500 shadow-xs shadow-amber-500/30'
                  : 'text-amber-300 bg-amber-950/40 border-amber-800/60 hover:bg-amber-900/60 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Leaderboard</span>
            </button>
          </nav>

          {/* Quick Search Button + Points + Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenSearch}
              title="Quick Search 25+ Tools (Ctrl+K)"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-700 transition shadow-xs"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden md:inline px-1.5 py-0.5 bg-slate-900 rounded text-[10px] font-mono text-slate-400 border border-slate-700">
                ⌘K
              </kbd>
            </button>

            {currentUser && (
              <div
                title={`${currentUser.displayName}'s Contribution Points`}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/60 border border-amber-700/50 rounded-xl text-amber-300 text-xs font-semibold shadow-xs"
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
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 rounded-xl border border-slate-700 text-xs text-slate-200">
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
                </div>
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
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setActiveTab('request-hub');
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 bg-purple-950/60 border border-purple-800/60 text-purple-200 rounded-xl text-xs font-bold text-left flex items-center gap-2"
              >
                <MessageSquarePlus className="w-4 h-4 text-purple-400" />
                <span>Request Hub</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('leaderboard');
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 bg-amber-950/60 border border-amber-800/60 text-amber-200 rounded-xl text-xs font-bold text-left flex items-center gap-2"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Leaderboard</span>
              </button>
            </div>

            {toolCategories.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  {cat.name}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {cat.items.map((item) => {
                    const Icon = item.icon;
                    const isCurrent = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition ${
                          isCurrent
                            ? 'bg-blue-600 text-white font-bold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-blue-400" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
