import React, { useState } from 'react';
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
  Sparkles
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

  const navItems = [
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'timer', label: 'Timer & Pomo', icon: Timer },
    { id: 'text-tools', label: 'Text Tools', icon: Type },
    { id: 'unit-converter', label: 'Unit Converter', icon: ArrowRightLeft },
    { id: 'qr-generator', label: 'QR Generator', icon: QrCode },
    { id: 'request-hub', label: 'Request Hub & Queue', icon: MessageSquarePlus, highlight: true },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
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
                  Community Utility Hub
                </p>
              </div>
            </button>

            {/* Link to static tools.html catalog */}
            <a
              href="./tools.html"
              title="View static tools directory"
              className="hidden xl:flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 bg-slate-800/60 px-2 py-1 rounded-md border border-slate-700/60 transition"
            >
              <span>tools.html</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/30'
                      : item.highlight
                      ? 'text-purple-300 hover:bg-purple-950/40 hover:text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Search Button + Gamification Points + Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              title="Quick Search Tools (Ctrl+K)"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition shadow-xs"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden md:inline px-1.5 py-0.5 bg-slate-900 rounded text-[10px] font-mono text-slate-400 border border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* CP Badge */}
            {currentUser && (
              <div
                title={`${currentUser.displayName}'s Contribution Points`}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/60 border border-amber-700/50 rounded-lg text-amber-300 text-xs font-semibold shadow-xs"
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

            {/* User Profile or Login */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800 rounded-lg border border-slate-700 text-xs text-slate-200">
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
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition shadow-xs shadow-blue-500/20"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
                <button
                  onClick={onLoginGuest}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition"
                >
                  Guest
                </button>
              </div>
            )}

            {/* Mobile Hamburger toggle */}
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
          <div className="lg:hidden py-3 border-t border-slate-800 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <a
              href="./tools.html"
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <span>View tools.html catalog</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </header>
  );
};
