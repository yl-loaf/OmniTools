import React from 'react';
import { COMMUNITY_BADGES, POINT_RULES } from '../data/badges';
import { UserProfile } from '../types';
import { Award, Sparkles, CheckCircle2, Flame, ShieldAlert, Zap } from 'lucide-react';

interface TieredBadgesProps {
  currentUser: UserProfile | null;
  onClaimDailyCheckIn?: () => void;
  canClaimDaily?: boolean;
  onBuyStreakFreeze?: () => void;
}

export const TieredBadges: React.FC<TieredBadgesProps> = ({
  currentUser,
  onClaimDailyCheckIn,
  canClaimDaily = false,
  onBuyStreakFreeze,
}) => {
  const currentCP = currentUser?.contributionPoints || 0;

  // Next badge calculation
  const nextBadge = COMMUNITY_BADGES.find((b) => b.minPoints > currentCP);
  const progressPercent = nextBadge
    ? Math.min(100, Math.max(0, (currentCP / nextBadge.minPoints) * 100))
    : 100;

  return (
    <div className="space-y-6">
      {/* Daily Retention Gamification Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/50 to-purple-900/60 border border-blue-700/40 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Daily Streak: {currentUser?.streakDays || 0} Days
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold flex items-center gap-1">
                <span>🧊</span> Streak Freezes: {currentUser?.streakFreezes || 0}
              </span>
              <span className="text-xs text-blue-300 font-medium">Daily Participation Reward</span>
            </div>
            <h3 className="text-lg font-bold text-white">Keep your tool builder streak alive!</h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Log in daily to claim +1 CP, contribute tool ideas, and unlock elite community ranks. Purchase streak freezes to protect your streak during missed days!
            </p>
          </div>

          {currentUser ? (
            <button
              onClick={onClaimDailyCheckIn}
              disabled={!canClaimDaily}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg shrink-0 ${
                canClaimDaily
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25 animate-bounce'
                  : 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Zap className="w-4 h-4" />
              {canClaimDaily ? 'Claim Daily Check-in (+1 CP)' : 'Checked in Today! ✓'}
            </button>
          ) : (
            <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700">
              Sign in with Google to track points & streaks
            </div>
          )}
        </div>

        {/* Streak Freeze Shop Banner */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-cyan-300">
            <span className="text-2xl">🧊</span>
            <div>
              <div className="font-bold text-white">Streak Freeze Protection Item</div>
              <p className="text-[11px] text-slate-400">Protects your streak automatically if you miss a check-in day. Costs 5 CP.</p>
            </div>
          </div>
          {currentUser && (
            <button
              onClick={onBuyStreakFreeze}
              className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold transition shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <span>Buy Streak Freeze (5 CP)</span>
            </button>
          )}
        </div>

        {/* Progress towards next badge */}
        {nextBadge && (
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-300 font-medium">
                Next Milestone: <strong className="text-white">{nextBadge.name}</strong> ({nextBadge.minPoints} CP)
              </span>
              <span className="font-mono text-cyan-400 font-semibold">
                {currentCP} / {nextBadge.minPoints} CP ({Math.round(progressPercent)}%)
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tiered Badges Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Tiered Milestone Badges
            </h3>
            <p className="text-xs text-slate-400">
              Visualizing community progress and rewarding high-quality tool proposals
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">5 Tier Levels</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {COMMUNITY_BADGES.map((badge) => {
            const isUnlocked = currentCP >= badge.minPoints;
            const tierColors = {
              bronze: 'border-amber-700/60 bg-amber-950/20 text-amber-300',
              silver: 'border-slate-500/60 bg-slate-800/40 text-slate-200',
              gold: 'border-yellow-500/60 bg-yellow-950/20 text-yellow-300',
              diamond: 'border-cyan-500/60 bg-cyan-950/20 text-cyan-300',
              master: 'border-purple-500/60 bg-purple-950/20 text-purple-300',
            }[badge.tier];

            return (
              <div
                key={badge.id}
                className={`relative p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isUnlocked
                    ? `${tierColors} shadow-lg shadow-black/40 scale-[1.02]`
                    : 'border-slate-800 bg-slate-900/60 text-slate-500 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{badge.icon}</span>
                    {isUnlocked ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded-sm">
                        <CheckCircle2 className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded-sm">
                        {badge.minPoints} CP needed
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-white">{badge.name}</h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{badge.description}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-700/30 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider">
                  <span className="capitalize">{badge.tier} Tier</span>
                  <span className="font-mono">{badge.minPoints} CP</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gamification Rule Explainer Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Earn +{POINT_RULES.IDEA_GENERATED} CP per Accepted Tool
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Submit robotics calculators, simulation widgets, or utility requests. When the maintainer marks your feature completed and ships it, you gain +2 CP!
            </p>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 shrink-0">
            <span className="text-lg">🧊</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Streak Freezes Protect Your Rank
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Busy schedule? Purchase streak freezes with CP to automatically shield your streak when you miss a day of check-ins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
