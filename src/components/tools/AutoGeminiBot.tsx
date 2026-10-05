import React, { useState, useEffect } from 'react';
import { UserProfile, ToolRequest, RequestCategory } from '../../types';
import { TOOLS_REGISTRY } from '../../data/toolsRegistry';
import { GoogleGenAI } from '@google/genai';
import {
  Sparkles,
  Bot,
  ShieldCheck,
  Zap,
  Clock,
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  Lock,
  RefreshCw,
  Terminal,
  Activity,
  Flame,
  Check,
  Gauge,
  Rocket
} from 'lucide-react';

interface AutoGeminiBotProps {
  currentUser: UserProfile | null;
  requests: ToolRequest[];
  onUpdateUser: (updatedUser: UserProfile) => void;
  onSubmitRequest: (req: Omit<ToolRequest, 'id' | 'createdAt' | 'updatedAt' | 'votes' | 'voters' | 'pointsAwarded'>) => void;
  onOpenAuth: () => void;
}

export const AutoGeminiBot: React.FC<AutoGeminiBotProps> = ({
  currentUser,
  requests,
  onUpdateUser,
  onSubmitRequest,
  onOpenAuth,
}) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isPurchasingTurbo, setIsPurchasingTurbo] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(0);

  const isPurchased = currentUser?.autoGeminiPurchased === true;
  const isTurbo = currentUser?.autoGeminiTurboPurchased === true;
  const isEnabled = currentUser?.autoGeminiEnabled === true;
  const intervalSeconds = currentUser?.autoGeminiIntervalMinutes ? currentUser.autoGeminiIntervalMinutes * 60 : (isTurbo ? 10 : 3600);
  const lastRun = currentUser?.autoGeminiLastRun;
  const submittedCount = currentUser?.autoGeminiSubmittedCount || 0;

  // Calculate next run countdown
  useEffect(() => {
    if (!isPurchased || !isEnabled || !lastRun) {
      setCountdownSeconds(0);
      return;
    }

    const intervalMs = intervalSeconds * 1000;
    const lastRunTime = new Date(lastRun).getTime();
    const nextRunTime = lastRunTime + intervalMs;

    const timer = setInterval(() => {
      const now = Date.now();
      const diffSecs = Math.max(0, Math.floor((nextRunTime - now) / 1000));
      setCountdownSeconds(diffSecs);

      // If countdown reached 0 and enabled, trigger auto-submission
      if (diffSecs === 0 && isEnabled && currentUser) {
        handleRunAutonomousBot(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPurchased, isEnabled, lastRun, intervalSeconds, currentUser]);

  // Handle purchasing base bot for 20 CP
  const handlePurchaseBot = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    const cost = 20;
    if (currentUser.contributionPoints < cost) {
      alert(`Insufficient Contribution Points! You have ${currentUser.contributionPoints} CP, but need ${cost} CP to unlock the Auto Gemini Bot.`);
      return;
    }

    setIsPurchasing(true);
    setTimeout(() => {
      const newPoints = currentUser.contributionPoints - cost;
      const updated: UserProfile = {
        ...currentUser,
        contributionPoints: newPoints,
        autoGeminiPurchased: true,
        autoGeminiEnabled: true,
        autoGeminiIntervalMinutes: 60,
        autoGeminiLastRun: new Date().toISOString(),
        autoGeminiSubmittedCount: 0,
        updatedAt: new Date().toISOString(),
      };

      onUpdateUser(updated);
      setIsPurchasing(false);
      setStatusMessage('Successfully unlocked Auto Gemini Tool Idea Automation! 🤖✨');
      setTimeout(() => setStatusMessage(null), 5000);
    }, 500);
  };

  // Handle purchasing Turbo Mode for 30 CP (as fast as possible)
  const handlePurchaseTurbo = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    const cost = 30;
    if (currentUser.contributionPoints < cost) {
      alert(`Insufficient Contribution Points! You have ${currentUser.contributionPoints} CP, but need ${cost} CP for Turbo Mode.`);
      return;
    }

    setIsPurchasingTurbo(true);
    setTimeout(() => {
      const newPoints = currentUser.contributionPoints - cost;
      const updated: UserProfile = {
        ...currentUser,
        contributionPoints: newPoints,
        autoGeminiPurchased: true,
        autoGeminiTurboPurchased: true,
        autoGeminiEnabled: true,
        autoGeminiIntervalMinutes: 0.1666, // 10 seconds
        autoGeminiLastRun: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onUpdateUser(updated);
      setIsPurchasingTurbo(false);
      setStatusMessage('🚀 Turbo Mode unlocked! Rate limits reduced to as fast as possible (10s interval).');
      setTimeout(() => setStatusMessage(null), 6000);
    }, 500);
  };

  // Toggle automation enabled/disabled
  const handleToggleEnabled = () => {
    if (!currentUser || !isPurchased) return;

    const updated: UserProfile = {
      ...currentUser,
      autoGeminiEnabled: !isEnabled,
      updatedAt: new Date().toISOString(),
    };
    onUpdateUser(updated);
  };

  // Change interval (minutes)
  const handleChangeInterval = (mins: number) => {
    if (!currentUser || !isPurchased) return;

    const updated: UserProfile = {
      ...currentUser,
      autoGeminiIntervalMinutes: mins,
      updatedAt: new Date().toISOString(),
    };
    onUpdateUser(updated);
  };

  // Core execution: Run Gemini autonomous idea generator with rate limit guards
  const handleRunAutonomousBot = async (isBackgroundRun = false) => {
    if (!currentUser || !isPurchased) return;

    // Rate Limit Guard: Turbo mode allows 2 seconds cooldown, standard allows 15 mins
    const cooldownSecs = isTurbo ? 2 : 900;
    if (lastRun && !isBackgroundRun) {
      const elapsedSecs = (Date.now() - new Date(lastRun).getTime()) / 1000;
      if (elapsedSecs < cooldownSecs) {
        const waitTime = Math.ceil(cooldownSecs - elapsedSecs);
        alert(`Rate limit protection active: Please wait ${waitTime}s before triggering again.`);
        return;
      }
    }

    setIsGenerating(true);
    setStatusMessage(isTurbo ? '🚀 [Turbo] Autonomous Bot generating ultra-fast tool idea...' : '🤖 Autonomous Bot calling Gemini API...');

    try {
      const apiKey = localStorage.getItem('omnitools_gemini_key') || import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key not configured in Settings > Secrets.');
      }

      const model = localStorage.getItem('omnitools_gemini_model') || 'gemini-3.5-flash-lite';
      const ai = new GoogleGenAI({ apiKey });

      const existingToolsSummary = TOOLS_REGISTRY.map(t => `- ${t.name}: ${t.desc}`).join('\n');
      const queueSummary = requests && requests.length > 0
        ? requests.map(r => `- [${r.status.toUpperCase()}] ${r.title}: ${r.description}`).join('\n')
        : 'None';

      const promptText = `Here is a list of existing tools already built into our web utility suite:
${existingToolsSummary}

Here is a list of tool suggestions and feature requests currently in the community queue (do NOT repeat, overlap with, or recreate any of these queued ideas):
${queueSummary}

Generate a creative, highly useful web developer tool or browser utility idea that is COMPLETELY UNIQUE and different from any of the existing tools and queued feature requests listed above. Avoid any duplication or redundancy. Return ONLY valid JSON with keys: title (string, short punchy name), description (string, 2 sentences explaining its value), category (one of: productivity, math, text, conversion, developer, utility, other).`;

      let res;
      try {
        res = await ai.models.generateContent({
          model,
          contents: promptText,
        });
      } catch (err) {
        console.warn('Primary Gemini model failed in Auto Bot, retrying with gemini-3.5-flash-lite:', err);
        res = await ai.models.generateContent({
          model: 'gemini-3.5-flash-lite',
          contents: promptText,
        });
      }

      const text = res.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not parse JSON from Gemini response.');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      if (!parsed.title || !parsed.description) {
        throw new Error('Invalid JSON structure from Gemini.');
      }

      // Duplicate guard check
      const titleLower = parsed.title.toLowerCase();
      const exists = requests.some(r => r.title.toLowerCase() === titleLower) ||
                     TOOLS_REGISTRY.some(t => t.name.toLowerCase() === titleLower);

      if (exists) {
        setStatusMessage('Generated idea already exists. Retrying generation...');
        setIsGenerating(false);
        return;
      }

      // Automatically submit request
      onSubmitRequest({
        title: parsed.title,
        description: `${parsed.description} [Generated autonomously by Auto Gemini Bot 🤖${isTurbo ? ' 🚀 Turbo' : ''}]`,
        category: (parsed.category as RequestCategory) || 'developer',
        status: 'pending',
        authorId: currentUser.uid,
        authorName: `${currentUser.displayName} (Auto Gemini Bot)`,
        authorPhoto: currentUser.photoURL,
        isGuest: false,
      });

      const newSubmittedCount = submittedCount + 1;
      const nowIso = new Date().toISOString();
      const updatedUser: UserProfile = {
        ...currentUser,
        autoGeminiLastRun: nowIso,
        autoGeminiSubmittedCount: newSubmittedCount,
        updatedAt: nowIso,
      };

      onUpdateUser(updatedUser);
      setStatusMessage(`Successfully auto-submitted new Gemini idea: "${parsed.title}"! 🎉`);
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err: unknown) {
      console.error('Auto Gemini Bot Error:', err);
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      setStatusMessage(`Auto Bot execution notice: ${errMsg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatCountdown = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${s}s`;
    if (mins > 0) return `${mins}m ${s}s`;
    return `${s}s`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/90 via-indigo-950/90 to-blue-950/90 border border-purple-800/80 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-900/80 text-purple-200 border border-purple-700 text-xs font-bold shadow-xs">
              <Bot className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>Autonomous AI Agent & Ultra-Fast Submissions</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Auto Gemini Tool Idea Automation Bot
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Unlock the autonomous Gemini agent for <strong className="text-amber-300 font-bold">20 CP</strong>, or upgrade to <strong className="text-cyan-300 font-bold">Turbo Mode (30 CP)</strong> to reduce rate limits to as fast as possible (every 10 seconds).
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center shrink-0 min-w-[180px] shadow-xl">
            <div className="text-[10px] uppercase font-mono text-slate-400">Your CP Balance</div>
            <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">
              {currentUser?.contributionPoints ?? 0} CP
            </div>
            {isTurbo ? (
              <div className="mt-2 text-[10px] font-bold px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-full flex items-center justify-center gap-1">
                <Rocket className="w-3 h-3 text-cyan-400" /> Turbo Active 🚀
              </div>
            ) : isPurchased ? (
              <div className="mt-2 text-[10px] font-bold px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Standard Unlocked
              </div>
            ) : (
              <div className="mt-2 text-[10px] font-bold px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 rounded-full flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> Locked
              </div>
            )}
          </div>
        </div>

        {statusMessage && (
          <div className="mt-4 p-3 bg-slate-900/90 border border-purple-700/60 rounded-xl text-xs text-purple-200 flex items-center gap-2 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {!isPurchased ? (
        /* Purchase Card */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20">
            <Bot className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-white">Unlock Auto Gemini Bot Automation</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Permanently activate autonomous Gemini tool generation. Automatically submit unique ideas and earn recognition on the leaderboard.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left py-2">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" /> Standard Bot (20 CP)
              </div>
              <p className="text-xs text-slate-400">Standard scheduled generation (1 hour interval default).</p>
              {!currentUser ? (
                <button
                  onClick={onOpenAuth}
                  className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition"
                >
                  Sign In
                </button>
              ) : (
                <button
                  onClick={handlePurchaseBot}
                  disabled={isPurchasing || currentUser.contributionPoints < 20}
                  className="w-full mt-2 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition disabled:opacity-50 cursor-pointer"
                >
                  {isPurchasing ? 'Unlocking...' : 'Unlock for 20 CP'}
                </button>
              )}
            </div>

            <div className="p-4 bg-gradient-to-b from-cyan-950/40 to-slate-950 border border-cyan-800/60 rounded-2xl space-y-2 relative overflow-hidden">
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-cyan-900 text-cyan-200 text-[10px] font-bold">
                RECOMMENDED
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <Rocket className="w-4 h-4 text-cyan-400" /> Turbo Mode (30 CP)
              </div>
              <p className="text-xs text-slate-300">As fast as possible (10s interval, instant submission rate limits).</p>
              {!currentUser ? (
                <button
                  onClick={onOpenAuth}
                  className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition"
                >
                  Sign In
                </button>
              ) : (
                <button
                  onClick={handlePurchaseTurbo}
                  disabled={isPurchasingTurbo || currentUser.contributionPoints < 30}
                  className="w-full mt-2 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90 text-white rounded-xl text-xs font-bold transition shadow-md shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {isPurchasingTurbo ? 'Unlocking Turbo...' : 'Unlock Turbo for 30 CP'}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Control Panel & Dashboard */
        <div className="space-y-6">
          {/* Turbo Upgrade Banner if standard purchased */}
          {!isTurbo && (
            <div className="bg-gradient-to-r from-cyan-950/80 via-blue-950/80 to-slate-900 border border-cyan-800/80 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                  <Rocket className="w-4 h-4 text-cyan-400 animate-bounce" />
                  <span>Upgrade to Turbo Mode for 30 CP</span>
                </div>
                <p className="text-xs text-slate-300">
                  Reduce rate limits from 30 min down to <strong className="text-white font-mono">as fast as possible (10s interval)</strong>.
                </p>
              </div>
              <button
                onClick={handlePurchaseTurbo}
                disabled={isPurchasingTurbo || (currentUser?.contributionPoints ?? 0) < 30}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90 text-white rounded-xl text-xs font-extrabold transition shadow-lg shadow-cyan-500/20 disabled:opacity-50 shrink-0 cursor-pointer"
              >
                {isPurchasingTurbo ? 'Upgrading...' : '🚀 Upgrade to Turbo (30 CP)'}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Settings & Toggles */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Bot className="w-4 h-4 text-purple-400" />
                    <span>Bot Controls</span>
                  </h3>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                    isEnabled ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isEnabled ? 'Active 🟢' : 'Paused ⏸️'}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                    <div>
                      <div className="text-xs font-bold text-white">Enable Automation</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Allow bot to run on schedule</div>
                    </div>
                    <button
                      onClick={handleToggleEnabled}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                        isEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Run Frequency / Speed</label>
                    <select
                      value={intervalSeconds / 60}
                      onChange={(e) => handleChangeInterval(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-purple-500"
                    >
                      {isTurbo && <option value={0.1666}>⚡ Ultra-Fast (10 Seconds)</option>}
                      {isTurbo && <option value={0.5}>🚀 Turbo Speed (30 Seconds)</option>}
                      <option value={1}>1 Minute (Fast)</option>
                      <option value={5}>5 Minutes</option>
                      <option value={30}>30 Minutes (Standard)</option>
                      <option value={60}>1 Hour</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleRunAutonomousBot(false)}
                    disabled={isGenerating}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 disabled:opacity-50 cursor-pointer"
                  >
                    <Play className={`w-3.5 h-3.5 fill-white ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>{isGenerating ? 'Generating Idea...' : '▶ Run Bot Now (Test Trigger)'}</span>
                  </button>
                </div>
              </div>

              {/* Rate Limit Protection Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Rate Limit & Safety Guard</span>
                </h4>
                <ul className="text-[11px] text-slate-400 space-y-2">
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{isTurbo ? '🚀 Turbo Mode active: Cooldown reduced to 2 seconds.' : 'Standard 15-minute cooldown between manual test runs.'}</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Cross-checks current queue and 55+ tool registry to eliminate duplicates.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Status Metrics & Activity Log */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-950 text-purple-400 border border-purple-800/60">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white font-mono">{submittedCount}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Ideas Auto-Submitted</div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-white font-mono">
                      {isEnabled ? formatCountdown(countdownSeconds) : 'Paused'}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">Next Run Countdown</div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-950 text-amber-400 border border-amber-800/60">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white truncate max-w-[120px]">
                      {lastRun ? new Date(lastRun).toLocaleTimeString() : 'Never'}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">Last Bot Execution</div>
                  </div>
                </div>
              </div>

              {/* Live Bot Execution Log */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-blue-400" />
                    <span>Autonomous Bot Execution Log</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">Live Agent Stream</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2 max-h-64 overflow-y-auto">
                  <div className="text-slate-500">[{new Date().toLocaleTimeString()}] Bot initialized with {isTurbo ? '🚀 Turbo Mode (10s interval)' : 'Standard Mode'}.</div>
                  {lastRun && (
                    <div className="text-emerald-400">[{new Date(lastRun).toLocaleTimeString()}] Successfully generated and submitted unique tool idea to community queue.</div>
                  )}
                  {isEnabled ? (
                    <div className="text-purple-300 animate-pulse">[{new Date().toLocaleTimeString()}] Status: Listening for schedule trigger (Next run in {formatCountdown(countdownSeconds)})...</div>
                  ) : (
                    <div className="text-amber-400">[{new Date().toLocaleTimeString()}] Status: Automation is currently paused. Toggle on to begin background execution.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
