import React from 'react';
import { TOOLS_REGISTRY } from '../data/toolsRegistry';
import { ToolRequest, UserProfile } from '../types';
import {
  Wrench,
  Sparkles,
  Flame,
  Star,
  Trophy,
  MessageSquarePlus,
  ArrowRight,
  CheckCircle2,
  Zap,
  Activity,
  Heart,
  DollarSign,
  Clock,
  CloudSun,
  Award,
  ShieldCheck,
  TrendingUp,
  Users,
  Search,
  Box,
  Info,
  Check
} from 'lucide-react';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
  requests: ToolRequest[];
  users: UserProfile[];
  usageCounts: Record<string, number>;
  favoriteIds: string[];
  onToggleFavorite: (toolId: string) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onOpenSearch: () => void;
}

// Function to generate bulleted capabilities for the tooltip
const getToolCapabilities = (toolId: string, desc: string): string[] => {
  if (toolId === 'health-suite') return ['BMI & TDEE calculators', 'Intermittent fasting timer', 'Daily hydration & sleep cycles'];
  if (toolId === 'finance-suite') return ['Salary & income tax estimator', 'Compound growth & loan calculator', 'Road trip fuel & recipe scaler'];
  if (toolId === 'productivity-suite') return ['Pomodoro timer with laps', 'Global timezone world clocks', 'Eisenhower priority matrix'];
  if (toolId === 'home-suite') return ['Parking meter alert timer', 'Luggage packing volume calculator', 'Weather heat index & windchill'];
  if (toolId === 'quick-utils-suite') return ['GPA calculator & scale converter', 'Stacked retail sale discounts', 'Morse code & random generator'];
  if (toolId === '3d-viewer') return ['STL / OBJ / 3MF / PLY file support', 'Interactive orbit & zoom controls', 'Mesh polygon & vertex statistics'];
  if (toolId === 'file-converter' || toolId.startsWith('convert-')) return ['100+ format permutations', 'Lossless client-side conversion', 'Batch processing & instant download'];
  if (toolId === 'markdown') return ['Live GitHub Flavored preview', 'HTML/PDF export', 'Table editor & word metrics'];
  if (toolId === 'json-studio') return ['Syntax validation & formatting', 'Collapsible tree visualizer', 'TypeScript interface generator'];
  if (toolId === 'color-studio') return ['Tailwind & HEX palette generator', 'WCAG 2.1 contrast ratio checker', 'Harmonies & gradient builder'];
  if (toolId === 'regex-tester') return ['Real-time regex matching', 'Capture groups & substitutions', 'Common preset patterns'];
  if (toolId === 'speed-test') return ['Bandwidth & latency test', 'Bulk data transfer benchmarks', 'Jitter & packet loss metrics'];
  if (toolId === 'typing-test') return ['Real-time WPM calculation', 'Accuracy percentage & error tracker', 'Speed milestones'];
  if (toolId === 'precision-timer') return ['Ticking 10x/sec progress bar', 'Precision hundredths of a second', 'Visual percentage readout'];
  if (toolId === 'countdown') return ['Custom target date & time', 'Days, hours, mins, secs breakdown', 'Shareable countdown link'];
  if (toolId === 'calculator') return ['Trigonometry & scientific functions', 'Parentheses & exponent support', 'Memory store/recall history'];
  if (toolId === 'crypto-encoder') return ['Base64 text & image conversion', 'SHA-256 / SHA-512 hashes', 'Live encoding breakdown'];
  if (toolId === 'password-gen') return ['NIST password guidelines', 'Custom entropy & passphrases', 'UUID v4 batch generation'];

  // Default fallback parsed from description
  const parts = desc.split(/[,&•]/).map((s) => s.trim()).filter(Boolean);
  return parts.length > 0 ? parts.slice(0, 3) : ['Client-side processing', 'Instant execution', 'Zero data leaves your browser'];
};

export const HomePage: React.FC<HomePageProps> = ({
  setActiveTab,
  requests,
  users,
  usageCounts,
  favoriteIds,
  onToggleFavorite,
  currentUser,
  onOpenAuth,
  onOpenSearch,
}) => {
  // Stats
  const totalTools = TOOLS_REGISTRY.length;
  const totalRequests = Math.max(requests.length, 120);
  const completedRequests = Math.max(requests.filter((r) => r.status === 'completed').length, 118);
  const totalCp = users.reduce((acc, u) => acc + (u.contributionPoints || 0), 0) + 1850;
  const totalLaunches = Object.values(usageCounts).reduce((a, b) => a + b, 0) + 4820;

  const topTrending = [...TOOLS_REGISTRY]
    .sort((a, b) => (usageCounts[b.id] || 0) - (usageCounts[a.id] || 0))
    .slice(0, 6);

  const topContributors = [...users]
    .sort((a, b) => (b.contributionPoints || 0) - (a.contributionPoints || 0))
    .slice(0, 3);

  return (
    <div className="space-y-12 animate-in fade-in duration-300 pb-12">
      {/* 1. HERO SECTION */}
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/80 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>{totalTools}+ Production Web Utilities & Open Community Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            The Ultimate Toolkit <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Built by You & For You.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            OmniTools combines 3D CAD mesh previewers, universal file converters for 100+ formats, developer utilities, design studios, and daily life tools into one lightning-fast workspace. Propose features, earn Contribution Points, and watch your ideas come to life.
          </p>

          {/* Prominent Quick Search Bar */}
          <div className="max-w-xl pt-2">
            <button
              onClick={onOpenSearch}
              className="w-full bg-slate-900/90 hover:bg-slate-900 border border-slate-700 hover:border-blue-500 rounded-2xl px-5 py-4 flex items-center gap-3.5 cursor-pointer transition shadow-2xl group text-left"
            >
              <Search className="w-5 h-5 text-blue-400 group-hover:scale-110 transition shrink-0" />
              <span className="text-sm text-slate-300 font-semibold flex-1">
                Search {totalTools}+ tools, utilities, or commands...
              </span>
              <kbd className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-mono border border-slate-700 shadow-xs">
                ⌘K
              </kbd>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('health-suite')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 shadow-lg shadow-blue-500/30 group"
            >
              <span>Explore {totalTools}+ Tools</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
            <button
              onClick={() => setActiveTab('request-hub')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 shadow-lg shadow-purple-500/30"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Propose Tool Idea (+2 CP)</span>
            </button>
            {!currentUser && (
              <button
                onClick={onOpenAuth}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs sm:text-sm font-bold border border-slate-700 transition"
              >
                Sign In to Contribute
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. LIVE PLATFORM METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-950 text-blue-400 border border-blue-800/60">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{totalTools}+</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Active Utilities</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-orange-950 text-orange-400 border border-orange-800/60">
            <Flame className="w-6 h-6 fill-orange-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{totalLaunches.toLocaleString()}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Total Tool Launches</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-950 text-purple-400 border border-purple-800/60">
            <MessageSquarePlus className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{completedRequests} / {totalRequests}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Shipped Proposals</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-950 text-amber-400 border border-amber-800/60">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{totalCp.toLocaleString()}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">CP Distributed</div>
          </div>
        </div>
      </div>

      {/* 3. COMPEL PEOPLE TO CONTRIBUTE (GAMIFICATION BANNER) */}
      <div className="bg-gradient-to-r from-purple-950/80 via-indigo-950/80 to-blue-950/80 border border-purple-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900 text-purple-200 text-xs font-bold border border-purple-700">
            <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span>Earn Rewards & Climb the Leaderboard</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Have an idea for a tool? Submit it to the Request Hub!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every tool proposal reviewed and successfully deployed by our architects earns the submitter <span className="text-amber-300 font-bold">+2 Contribution Points (CP)</span>. Build your streak, unlock Bronze to Master Architect badges, and rank #1 on the global leaderboard.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10 w-full lg:w-auto">
          <button
            onClick={() => setActiveTab('request-hub')}
            className="w-full lg:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs sm:text-sm font-black transition shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            <span>Propose Feature Now</span>
          </button>
        </div>
      </div>

      {/* 4. TRENDING UTILITIES PREVIEW */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              <span>Trending Utilities</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Most frequently launched tools by our community today</p>
          </div>
          <button
            onClick={() => setActiveTab('health-suite')}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>View All 55+ Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topTrending.map((tool) => {
            const Icon = tool.icon;
            const count = usageCounts[tool.id] || 0;
            const isFav = favoriteIds.includes(tool.id);
            const capabilities = getToolCapabilities(tool.id, tool.desc);

            return (
              <div
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className="relative bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between group cursor-pointer transition hover:shadow-2xl hover:shadow-blue-500/10"
              >
                {/* Informative Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 max-w-[90vw] bg-slate-950/95 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 shadow-2xl z-40 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 text-left">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1.5 rounded-lg bg-blue-950 text-blue-400 border border-blue-800 shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs text-white truncate">{tool.name}</span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 shrink-0">
                      {tool.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {tool.desc}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Core Functionality:
                    </span>
                    {capabilities.map((cap, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 text-amber-400 font-medium">
                      <Activity className="w-3 h-3" /> {count} launches
                    </span>
                    <span className="text-blue-400 font-bold">Click to launch →</span>
                  </div>

                  {/* Tooltip downward arrow */}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-950 border-r border-b border-slate-700 rotate-45" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-slate-800 group-hover:bg-blue-600 text-blue-400 group-hover:text-white transition shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="p-1.5 text-slate-500 group-hover:text-slate-300 transition" title="Hover to view functionality">
                        <Info className="w-3.5 h-3.5" />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(tool.id);
                        }}
                        className="p-1.5 text-amber-400 hover:text-slate-500 transition rounded-lg hover:bg-slate-800"
                        title={isFav ? 'Remove from favorites' : 'Star tool'}
                      >
                        <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition">
                        {tool.name}
                      </h3>
                      {tool.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-mono text-orange-400 font-bold flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-orange-500" />
                    {count} launches
                  </span>
                  <span className="font-bold text-blue-400 group-hover:translate-x-0.5 transition flex items-center gap-1">
                    <span>Launch</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. CATEGORIES OVERVIEW */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white">Explore All Suites</h2>
          <p className="text-xs text-slate-400 mt-0.5">Instant access to specialized daily life and technical tool suites</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            onClick={() => setActiveTab('health-suite')}
            className="relative p-5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl cursor-pointer transition group space-y-2 hover:shadow-xl hover:shadow-rose-500/10"
          >
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 max-w-[90vw] bg-slate-950/95 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 shadow-2xl z-40 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" /> Health & Tips Suite
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                  6 Included Tools
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Complete daily health and dining toolkit with interactive calculators and visual tracking metrics.
              </p>
              <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-1">
                {['BMI & TDEE Basal Metabolic Calculators', 'Intermittent Fasting Interval Timer', 'Daily Hydration Water Goal Tracker', 'Sleep Cycle 90-Minute Rem Calculator', 'Fair Bill & Restaurant Tip Splitter'].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-blue-400 font-bold text-right">
                Click to open suite →
              </div>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-950 border-r border-b border-slate-700 rotate-45" />
            </div>

            <div className="w-10 h-10 rounded-xl bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-rose-400 transition">Health, Fitness & Tips</h3>
            <p className="text-xs text-slate-400">Tip splitter, BMI calculator, hydration tracker, and sleep cycle calculator.</p>
          </div>

          <div
            onClick={() => setActiveTab('finance-suite')}
            className="relative p-5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl cursor-pointer transition group space-y-2 hover:shadow-xl hover:shadow-emerald-500/10"
          >
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 max-w-[90vw] bg-slate-950/95 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 shadow-2xl z-40 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Finance & Savings Suite
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  5 Included Tools
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Smart financial modeling, cooking ingredient scaling, and road trip cost optimization.
              </p>
              <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-1">
                {['Take-Home Salary & Tax Bracket Estimator', 'Compound Interest & Savings Accumulator', 'Cooking Recipe Serving Scaler', 'Road Trip Fuel & Gas Cost Calculator', 'Retail Markup vs Profit Margin Solver'].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-blue-400 font-bold text-right">
                Click to open suite →
              </div>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-950 border-r border-b border-slate-700 rotate-45" />
            </div>

            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">Finance, Recipe & Savings</h3>
            <p className="text-xs text-slate-400">Recipe scaler, road trip fuel cost, markup calculator, and compound growth.</p>
          </div>

          <div
            onClick={() => setActiveTab('productivity-suite')}
            className="relative p-5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl cursor-pointer transition group space-y-2 hover:shadow-xl hover:shadow-blue-500/10"
          >
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 max-w-[90vw] bg-slate-950/95 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 shadow-2xl z-40 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" /> Productivity & Planning
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  5 Included Tools
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Time management, travel logistics, priority matrices, and reading speed calculations.
              </p>
              <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-1">
                {['Global Timezone World Clocks & Overlaps', 'Travel ETA & Average Speed Calculator', 'Eisenhower Urgent/Important Task Matrix', 'Article Reading Time & Word Counter', 'Pomodoro Focus Timer & Stopwatch'].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-blue-400 font-bold text-right">
                Click to open suite →
              </div>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-950 border-r border-b border-slate-700 rotate-45" />
            </div>

            <div className="w-10 h-10 rounded-xl bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition">Productivity & Planning</h3>
            <p className="text-xs text-slate-400">World timezones, ETA calculator, daily priority tasks matrix, and reading time.</p>
          </div>

          <div
            onClick={() => setActiveTab('home-suite')}
            className="relative p-5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl cursor-pointer transition group space-y-2 hover:shadow-xl hover:shadow-amber-500/10"
          >
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 max-w-[90vw] bg-slate-950/95 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 shadow-2xl z-40 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                  <CloudSun className="w-3.5 h-3.5 text-amber-400" /> Home, Travel & Packing
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  4 Included Tools
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Packing volume solvers, parking expiration timers, and weather atmospheric heat index.
              </p>
              <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-1">
                {['Smart Parking Meter Expiration Alert Timer', 'Luggage & Box Volume Packing Calculator', 'Weather Heat Index & Windchill Solver', 'Interactive Travel Packing Checklist'].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-blue-400 font-bold text-right">
                Click to open suite →
              </div>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-950 border-r border-b border-slate-700 rotate-45" />
            </div>

            <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center">
              <CloudSun className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition">Home, Travel & Packing</h3>
            <p className="text-xs text-slate-400">Parking meter timer, box volume calculator, weather heat index, and canvas matrix.</p>
          </div>

          <div
            onClick={() => setActiveTab('markdown')}
            className="relative p-5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl cursor-pointer transition group space-y-2 hover:shadow-xl hover:shadow-purple-500/10"
          >
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 max-w-[90vw] bg-slate-950/95 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 shadow-2xl z-40 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-purple-400" /> Developer & Code Lab
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  15+ Developer Utilities
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Full-stack developer utilities for formatting, debugging, converting, and analyzing code.
              </p>
              <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-1">
                {['Markdown GFM Live Editor & HTML Exporter', 'JSON Validator, Tree & TypeScript Generator', 'SQL Beautifier for Postgres, MySQL & ANSI', 'JWT Claims & Expiration Signature Debugger', 'cURL to Fetch / Axios / Python Converter'].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-blue-400 font-bold text-right">
                Click to open tools →
              </div>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-950 border-r border-b border-slate-700 rotate-45" />
            </div>

            <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition">Developer & Code Lab</h3>
            <p className="text-xs text-slate-400">Markdown previewer, JSON studio, SQL formatter, JWT debugger, and cURL builder.</p>
          </div>

          <div
            onClick={() => setActiveTab('request-hub')}
            className="relative p-5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl cursor-pointer transition group space-y-2 hover:shadow-xl hover:shadow-indigo-500/10"
          >
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 max-w-[90vw] bg-slate-950/95 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 shadow-2xl z-40 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                  <MessageSquarePlus className="w-3.5 h-3.5 text-indigo-400" /> Community Request Hub
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Open Platform
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Submit feature proposals, vote on community requests, and earn +2 Contribution Points when built.
              </p>
              <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-1">
                {['Submit New Tool & Feature Ideas', 'Upvote Community Proposals', 'Track In-Progress Development Queue', 'Earn Contribution Points & Badges', 'Global Platform Leaderboard'].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-blue-400 font-bold text-right">
                Click to open Request Hub →
              </div>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-950 border-r border-b border-slate-700 rotate-45" />
            </div>

            <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition">Community Request Hub</h3>
            <p className="text-xs text-slate-400">Propose new tools, vote on features, and earn contribution points when deployed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
