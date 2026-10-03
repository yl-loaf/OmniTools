import React from 'react';
import { UserProfile } from '../types';
import { COMMUNITY_BADGES } from '../data/badges';
import { Trophy, Crown, Medal, Award, Flame, User as UserIcon } from 'lucide-react';

interface LeaderboardProps {
  users: UserProfile[];
  currentUserId?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ users, currentUserId }) => {
  // Sort users descending by contribution points
  const sortedUsers = [...users].sort((a, b) => b.contributionPoints - a.contributionPoints);

  const getTopBadge = (points: number) => {
    const earned = [...COMMUNITY_BADGES].reverse().find((b) => points >= b.minPoints);
    return earned || null;
  };

  const top3 = sortedUsers.slice(0, 3);
  const remaining = sortedUsers.slice(3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-extrabold text-white">Community Contribution Leaderboard</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Top community architects ranked by cumulative Contribution Points (CP)
          </p>
        </div>
        <div className="text-xs bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
          Rankings update in real-time
        </div>
      </div>

      {/* Top 3 Podium (Desktop & Tablet) */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-4">
          {/* Rank 2 (Silver) */}
          {top3[1] && (
            <div className="order-2 md:order-1 bg-slate-900/90 border border-slate-700/70 rounded-2xl p-5 text-center flex flex-col items-center relative shadow-lg">
              <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1">
                <Medal className="w-3.5 h-3.5 text-slate-300" /> #2 Silver
              </div>
              <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-slate-400 flex items-center justify-center text-lg font-bold text-white mb-2 overflow-hidden">
                {top3[1].photoURL ? (
                  <img src={top3[1].photoURL} alt={top3[1].displayName} className="w-full h-full object-cover" />
                ) : (
                  top3[1].displayName.charAt(0)
                )}
              </div>
              <h4 className="font-bold text-sm text-white truncate max-w-[160px]">{top3[1].displayName}</h4>
              <div className="text-xs font-mono text-cyan-400 font-bold mt-1">
                {top3[1].contributionPoints} CP
              </div>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-2">
                <span>{top3[1].generatedCount} tools built</span>
                {top3[1].streakDays > 0 && (
                  <span className="flex items-center text-orange-400">
                    <Flame className="w-3 h-3" /> {top3[1].streakDays}d
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Rank 1 (Gold) */}
          {top3[0] && (
            <div className="order-1 md:order-2 bg-gradient-to-b from-amber-950/40 to-slate-900 border-2 border-amber-500/60 rounded-2xl p-6 text-center flex flex-col items-center relative shadow-xl shadow-amber-500/10 md:-translate-y-2">
              <div className="absolute -top-3.5 px-3.5 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center gap-1 shadow-md">
                <Crown className="w-4 h-4 fill-slate-950" /> #1 Champion
              </div>
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-xl font-black text-amber-300 mb-2 overflow-hidden">
                {top3[0].photoURL ? (
                  <img src={top3[0].photoURL} alt={top3[0].displayName} className="w-full h-full object-cover" />
                ) : (
                  top3[0].displayName.charAt(0)
                )}
              </div>
              <h4 className="font-bold text-base text-white truncate max-w-[180px]">{top3[0].displayName}</h4>
              <div className="text-sm font-mono text-amber-400 font-extrabold mt-1">
                {top3[0].contributionPoints} CP
              </div>
              {getTopBadge(top3[0].contributionPoints) && (
                <div className="mt-1 text-[11px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800/40 inline-flex items-center gap-1">
                  <span>{getTopBadge(top3[0].contributionPoints)?.icon}</span>
                  <span>{getTopBadge(top3[0].contributionPoints)?.name}</span>
                </div>
              )}
              <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
                <span>{top3[0].generatedCount} tools built</span>
                {top3[0].streakDays > 0 && (
                  <span className="flex items-center text-orange-400">
                    <Flame className="w-3.5 h-3.5" /> {top3[0].streakDays}d streak
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {top3[2] && (
            <div className="order-3 bg-slate-900/90 border border-amber-900/40 rounded-2xl p-5 text-center flex flex-col items-center relative shadow-lg">
              <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-amber-800 text-amber-200 text-xs font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-300" /> #3 Bronze
              </div>
              <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-amber-700 flex items-center justify-center text-lg font-bold text-white mb-2 overflow-hidden">
                {top3[2].photoURL ? (
                  <img src={top3[2].photoURL} alt={top3[2].displayName} className="w-full h-full object-cover" />
                ) : (
                  top3[2].displayName.charAt(0)
                )}
              </div>
              <h4 className="font-bold text-sm text-white truncate max-w-[160px]">{top3[2].displayName}</h4>
              <div className="text-xs font-mono text-cyan-400 font-bold mt-1">
                {top3[2].contributionPoints} CP
              </div>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-2">
                <span>{top3[2].generatedCount} tools built</span>
                {top3[2].streakDays > 0 && (
                  <span className="flex items-center text-orange-400">
                    <Flame className="w-3 h-3" /> {top3[2].streakDays}d
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Full Contributor Rankings</h3>
          <span className="text-xs text-slate-400">{sortedUsers.length} Registered Contributors</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Contributor</th>
                <th className="py-3 px-4 text-center">Milestone Badge</th>
                <th className="py-3 px-4 text-center">Accepted Tools (+2 CP)</th>
                <th className="py-3 px-4 text-center">Streak</th>
                <th className="py-3 px-4 text-right">Cumulative CP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {sortedUsers.map((user, index) => {
                const rank = index + 1;
                const isCurrentUser = user.uid === currentUserId;
                const badge = getTopBadge(user.contributionPoints);

                return (
                  <tr
                    key={user.uid}
                    className={`hover:bg-slate-800/40 transition ${
                      isCurrentUser ? 'bg-blue-950/30 border-l-4 border-blue-500 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold">
                      {rank === 1 && <span className="text-amber-400">#1 👑</span>}
                      {rank === 2 && <span className="text-slate-300">#2 🥈</span>}
                      {rank === 3 && <span className="text-amber-600">#3 🥉</span>}
                      {rank > 3 && <span className="text-slate-500">#{rank}</span>}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white overflow-hidden shrink-0">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                          ) : (
                            user.displayName.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="text-white font-medium flex items-center gap-1.5">
                            <span>{user.displayName}</span>
                            {isCurrentUser && (
                              <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded-xs">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {badge ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-slate-800 text-slate-200 border border-slate-700">
                          <span>{badge.icon}</span>
                          <span>{badge.name}</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Unranked</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      <span className="text-emerald-400 font-semibold">{user.generatedCount}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      {user.streakDays > 0 ? (
                        <span className="inline-flex items-center gap-1 text-orange-400 font-medium">
                          <Flame className="w-3 h-3" /> {user.streakDays}d
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-amber-400 text-sm">
                      {user.contributionPoints} CP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
