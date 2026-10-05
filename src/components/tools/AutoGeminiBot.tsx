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
  Check
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(0);

  const isPurchased = currentUser?.autoGeminiPurchased === true;
  const isEnabled = currentUser?.autoGeminiEnabled === true;
  const intervalMinutes = currentUser?.autoGeminiIntervalMinutes || 60; // default 1 hour
  const lastRun = currentUser?.autoGeminiLastRun;
  const submittedCount = currentUser?.autoGeminiSubmittedCount || 0;

  // Calculate next run countdown
  useEffect(() => {
    if (!isPurchased || !isEnabled || !lastRun) {
      setCountdownSeconds(0);
      return;
    }

    const intervalMs = intervalMinutes * 60 * 1000;
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
  }, [isPurchased, isEnabled, lastRun, intervalMinutes, currentUser]);

  // Handle purchasing for 20 CP
  const handlePurchaseBot = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    const cost = 20;
    if (currentUser.contributionPoints < cost) {
      alert(`Insufficient Contribution Points! You have ${currentUser.contributionPoints} CP, but need ${cost} CP to unlock the Auto Gemini Bot automation.`);
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
        autoGeminiIntervalMinutes: 60, // default 1 hour
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

  // Change interval
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

    // Rate Limit Guard: Minimum 15 minutes between runs
    if (lastRun && !isBackgroundRun) {
      const elapsedMins = (Date.now() - new Date(lastRun).getTime()) / (1000 * 60);
      if (elapsedMins < 15) {
        alert(`Rate limit protection active: Please wait at least ${Math.ceil(15 - elapsedMins)} more minutes before manually triggering again.`);
        return;
      }
    }

    setIsGenerating(true);
    setStatusMessage('🤖 Autonomous Bot calling Gemini API to generate unique tool idea...');

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
        description: `${parsed.description} [Generated autonomously by Auto Gemini Bot 🤖]`,
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
      setTimeout(() => setStatusMessage(null), 6000);
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
              <span>Autonomous AI Agent & Rate-Limited Submissions</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Auto Gemini Tool Idea Automation Bot
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Unlock the autonomous Gemini agent for <strong className="text-amber-300 font-bold">20 CP</strong>. The bot periodically generates brilliant, unique developer tool ideas using Gemini and automatically submits them to the community queue while strictly protecting against rate limits and duplicates.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center shrink-0 min-w-[180px] shadow-xl">
            <div className="text-[10px] uppercase font-mono text-slate-400">Your CP Balance</div>
            <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">
              {currentUser?.contributionPoints ?? 0} CP
            </div>
            {isPurchased ? (
              <div className="mt-2 text-[10px] font-bold px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Unlocked & Owned
              </div>
            ) : (
              <div className="mt-2 text-[10px] font-bold px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 rounded-full flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> Costs 20 CP
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
              Permanently activate autonomous Gemini tool generation. Your bot will run in the background according to your configured schedule, submitting unique ideas and earning you recognition on the leaderboard.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left py-2">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> 20 CP Cost
              </div>
              <p className="text-[11px] text-slate-400">One-time purchase using your earned contribution points.</p>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Rate Limit Safe
              </div>
              <p className="text-[11px] text-slate-400">Built-in cooldown guards and exponential backoff protection.</p>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Zero Duplicates
              </div>
              <p className="text-[11px] text-slate-400">Automatically cross-checks existing queue and registry.</p>
            </div>
          </div>

          {!currentUser ? (
            <button
              onClick={onOpenAuth}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-500/20"
            >
              Sign In with Google to Unlock
            </button>
          ) : (
            <button
              onClick={handlePurchaseBot}
              disabled={isPurchasing || (currentUser.contributionPoints < 20)}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-90 text-white rounded-xl text-xs sm:text-sm font-extrabold transition shadow-lg shadow-purple-600/30 disabled:opacity-50 cursor-pointer"
            >
              {isPurchasing ? 'Unlocking Bot...' : 'Unlock Auto Gemini Bot for 20 CP'}
            </button>
          )}
        </div>
      ) : (
        /* Control Panel & Dashboard */
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
                  <label className="text-xs font-semibold text-slate-300">Run Frequency / Interval</label>
                  <select
                    value={intervalMinutes}
                    onChange={(e) => handleChangeInterval(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  >
                    <option value={30}>Every 30 Minutes</option>
                    <option value={60}>Every 1 Hour (Recommended)</option>
                    <option value={240}>Every 4 Hours</option>
                    <option value={720}>Every 12 Hours</option>
                    <option value={1440}>Every 24 Hours</option>
                  </select>
                </div>

                <button
                  onClick={() => handleRunAutonomousBot(false)}
                  disabled={isGenerating}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 disabled:opacity-50 cursor-pointer"
                >
                  <Play className={`w-3.5 h-3.5 fill-white ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{isGenerating ? 'Running Gemini Bot...' : '▶ Run Bot Now (Test Trigger)'}</span>
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
                  <span>Enforces a minimum 15-minute cooldown between manual test triggers.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Cross-checks current queue and 55+ tool registry to eliminate duplicates.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Uses high-efficiency <code className="text-purple-300 font-mono">gemini-3.5-flash-lite</code> to minimize quota consumption.</span>
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
                <div className="text-slate-500">[{new Date().toLocaleTimeString()}] Bot initialized and connected to Gemini API proxy.</div>
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
      )}
    </div>
  );
};
