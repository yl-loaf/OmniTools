import React, { useState, useEffect } from 'react';
import { UserProfile, ToolRequest, ToolIssue, CPTransaction } from '../types';
import { getLocalRequests, getLocalIssues, initFirebase, getSavedFirebaseConfig } from '../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { User, Trophy, Flame, Award, ArrowLeft, ExternalLink, History, Sparkles, CheckCircle2, Bug, Wrench, Camera } from 'lucide-react';
import { CameraAvatarModal } from './CameraAvatarModal';

export const ProfilePage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [requests, setRequests] = useState<ToolRequest[]>([]);
  const [issues, setIssues] = useState<ToolIssue[]>([]);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('omnitools_current_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch {}

    setRequests(getLocalRequests());
    setIssues(getLocalIssues());
  }, []);

  const handleSaveAvatar = async (photoURL: string) => {
    if (!currentUser) return;
    const updatedUser: UserProfile = {
      ...currentUser,
      photoURL,
      updatedAt: new Date().toISOString(),
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('omnitools_current_user', JSON.stringify(updatedUser));

    const { db, isConfigured } = initFirebase(getSavedFirebaseConfig());
    if (isConfigured && db) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          photoURL,
          updatedAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Firestore update avatar error:', e);
      }
    }

    setToastMsg('Profile avatar updated successfully and stored in your profile!');
    setTimeout(() => setToastMsg(null), 4000);
  };

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto my-24 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-950 border border-blue-800 mx-auto flex items-center justify-center">
          <User className="w-8 h-8 text-blue-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">No Active Profile Found</h1>
          <p className="text-xs text-slate-400">
            Please sign in on the main OmniTools application first to view your personal stats and CP transaction history.
          </p>
        </div>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to OmniTools</span>
        </a>
      </div>
    );
  }

  // Filter user's contributions (Shipped tools / requests and resolved bugs)
  const userRequests = requests.filter((r) => r.authorId === currentUser.uid);
  const userIssues = issues.filter((i) => i.reporterId === currentUser.uid);

  // Generate sample transactions if none recorded yet
  const transactions: CPTransaction[] = currentUser.transactions || [
    { id: 'tx-1', amount: 10, reason: 'Initial Platform Architect Grant', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'tx-2', amount: 1, reason: 'Daily Check-in Reward (Streak: 1)', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'tx-3', amount: 3, reason: 'Bug Report Resolution (+3 CP)', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 'tx-4', amount: 2, reason: 'Feature Deployed: Precision Timer', timestamp: new Date().toISOString() },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in.fade-in">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <div className="px-4 py-3 bg-emerald-950/90 text-emerald-200 border border-emerald-700/80 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Top Navbar Back */}
      <div className="flex items-center justify-between">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to OmniTools Suite</span>
        </a>
        <div className="text-xs font-mono text-slate-400">UID: {currentUser.uid}</div>
      </div>

      {/* User Header Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5">
          <div className="relative group cursor-pointer" onClick={() => setCameraModalOpen(true)}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-blue-500/20 overflow-hidden border-2 border-blue-500/40">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt={currentUser.displayName} className="w-full h-full object-cover" />
              ) : (
                currentUser.displayName.slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
              <Camera className="w-6 h-6 text-blue-400" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-white">{currentUser.displayName}</h1>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                Level {Math.floor(currentUser.contributionPoints / 10) + 1}
              </span>
            </div>
            <p className="text-xs text-slate-400">{currentUser.email || 'Community Member & Contributor'}</p>
            <button
              onClick={() => setCameraModalOpen(true)}
              className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 mt-1 transition"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Change Avatar via Camera / Upload</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Contribution Points</div>
            <div className="text-2xl font-mono font-black text-emerald-400 mt-0.5">{currentUser.contributionPoints} CP</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Streak</div>
            <div className="text-2xl font-mono font-black text-amber-400 mt-0.5">{currentUser.streakDays || 1} Days 🔥</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Shipped Tools</div>
            <div className="text-2xl font-mono font-black text-cyan-400 mt-0.5">{currentUser.shippedTools?.length || userRequests.filter(r => r.status === 'completed').length}</div>
          </div>
        </div>
      </div>

      {/* Grid: User's Contributions (Link & Name only) vs CP Transaction History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Contributions: Link and Name */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Your Tool & Bug Contributions</h2>
              <p className="text-xs text-slate-400">Links and names of features & bug reports you contributed</p>
            </div>
          </div>

          <div className="space-y-3">
            {userRequests.length === 0 && userIssues.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs bg-slate-950 rounded-2xl border border-slate-800">
                You haven't submitted any feature proposals or bug reports yet.
              </div>
            ) : (
              <>
                {userRequests.map((req) => (
                  <div key={req.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-300">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{req.title}</div>
                        <div className="text-[10px] font-mono text-slate-400 capitalize">Category: {req.category} • Status: <span className={req.status === 'completed' ? 'text-emerald-400 font-bold' : 'text-amber-400'}>{req.status}</span></div>
                      </div>
                    </div>

                    <a
                      href={`/?tool=${req.category}`}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 shrink-0"
                    >
                      <span>View Tool</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}

                {userIssues.map((issue) => (
                  <div key={issue.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-950 border border-rose-800 flex items-center justify-center text-rose-300">
                        <Bug className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Bug Report: {issue.toolName}</div>
                        <div className="text-[10px] font-mono text-slate-400">Status: <span className={issue.status === 'resolved' ? 'text-emerald-400 font-bold' : 'text-rose-400'}>{issue.status}</span></div>
                      </div>
                    </div>

                    <a
                      href={`/?tool=${issue.toolId}`}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 shrink-0"
                    >
                      <span>View Tool</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* CP Transaction History */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center">
              <History className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">CP Transaction History</h2>
              <p className="text-xs text-slate-400">Contribution points earned and spent ledger</p>
            </div>
          </div>

          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-white">{tx.reason}</div>
                  <div className="text-[10px] font-mono text-slate-500">{new Date(tx.timestamp).toLocaleString()}</div>
                </div>
                <div className={`text-sm font-mono font-black ${tx.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {tx.amount >= 0 ? `+${tx.amount}` : tx.amount} CP
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Camera Avatar Modal */}
      <CameraAvatarModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onSaveAvatar={handleSaveAvatar}
      />
    </div>
  );
};
