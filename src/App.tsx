/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FirebaseModal } from './components/FirebaseModal';
import { QuickSearchModal } from './components/QuickSearchModal';
import { ScientificCalculator } from './components/tools/ScientificCalculator';
import { PomodoroTimer } from './components/tools/PomodoroTimer';
import { TextTools } from './components/tools/TextTools';
import { UnitConverter } from './components/tools/UnitConverter';
import { QrGenerator } from './components/tools/QrGenerator';
import { ToolRequestHub } from './components/ToolRequestHub';
import { Leaderboard } from './components/Leaderboard';
import { TieredBadges } from './components/TieredBadges';
import { ToolRequest, UserProfile, RequestStatus, FirebaseCustomConfig } from './types';
import { APP_VERSION } from '../version.js';
import {
  initFirebase,
  getSavedFirebaseConfig,
  getLocalRequests,
  saveLocalRequests,
  getLocalUsers,
  saveLocalUsers,
  loginWithGoogle,
  loginAsGuest,
  logoutUser
} from './services/firebase';
import { syncPromptToGoogleSheet } from './services/googleSheets';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  increment,
  query,
  orderBy
} from 'firebase/firestore';
import { CheckCircle2, AlertTriangle, Sparkles, Database } from 'lucide-react';

export default function App() {
  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const toolParam = params.get('tool');
      if (toolParam === 'calculator') return 'calculator';
      if (toolParam === 'timer') return 'timer';
      if (toolParam === 'text-tools') return 'text-tools';
      if (toolParam === 'unit-converter') return 'unit-converter';
      if (toolParam === 'qr-generator') return 'qr-generator';
      if (toolParam === 'request' || toolParam === 'request-hub') return 'request-hub';
      if (toolParam === 'leaderboard') return 'leaderboard';
    }
    return 'calculator';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab);
  const [firebaseModalOpen, setFirebaseModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseCustomConfig | null>(getSavedFirebaseConfig());

  // User State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  // App Data
  const [requests, setRequests] = useState<ToolRequest[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);

  // Toast Notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'penalty' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'penalty' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Global keyboard shortcut for quick search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Initialize data sources on mount (fix potential infinite re-render loop by using empty dependency array [])
  useEffect(() => {
    const savedConfig = getSavedFirebaseConfig();
    setFirebaseConfig(savedConfig);

    const { db, auth, isConfigured } = initFirebase(savedConfig);

    if (isConfigured && db && auth) {
      // 1. Auth Listener
      const unsubAuth = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setIsGuest(user.isAnonymous);
          const userProfile: UserProfile = {
            uid: user.uid,
            displayName: user.displayName || (user.isAnonymous ? 'Guest User' : 'Community Member'),
            photoURL: user.photoURL || undefined,
            email: user.email || undefined,
            contributionPoints: 0,
            generatedCount: 0,
            rejectedCount: 0,
            submittedCount: 0,
            streakDays: 1,
            lastActiveDate: new Date().toISOString().split('T')[0],
            unlockedBadgeIds: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          try {
            await setDoc(doc(db, 'users', user.uid), userProfile, { merge: true });
          } catch (e) {
            console.warn('Error syncing user profile:', e);
          }
          setCurrentUser(userProfile);
        } else {
          setCurrentUser(null);
          setIsGuest(false);
        }
      });

      // 2. Real-time Firestore Tool Requests Listener
      const unsubRequests = onSnapshot(
        query(collection(db, 'tool_requests'), orderBy('createdAt', 'desc')),
        (snapshot) => {
          const loaded: ToolRequest[] = [];
          snapshot.forEach((d) => loaded.push(d.data() as ToolRequest));
          setRequests(loaded);
        },
        (error) => {
          console.warn('Firestore tool_requests listener fallback:', error);
          setRequests(getLocalRequests());
        }
      );

      // 3. Real-time Users / Leaderboard Listener
      const unsubUsers = onSnapshot(
        collection(db, 'users'),
        (snapshot) => {
          const loadedUsers: UserProfile[] = [];
          snapshot.forEach((d) => loadedUsers.push(d.data() as UserProfile));
          setUsers(loadedUsers);

          if (auth.currentUser) {
            const found = loadedUsers.find((u) => u.uid === auth.currentUser?.uid);
            if (found) setCurrentUser(found);
          }
        },
        (error) => {
          console.warn('Firestore users listener fallback:', error);
          setUsers(getLocalUsers());
        }
      );

      return () => {
        unsubAuth();
        unsubRequests();
        unsubUsers();
      };
    } else {
      // Local Storage Mode
      const localReqs = getLocalRequests();
      const localUsers = getLocalUsers();
      setRequests(localReqs);
      setUsers(localUsers);

      const savedUserJson = localStorage.getItem('omnitools_current_user');
      if (savedUserJson) {
        try {
          const parsed = JSON.parse(savedUserJson);
          setCurrentUser(parsed);
          setIsGuest(parsed.uid.startsWith('guest-'));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  // Auth Handlers
  const handleLoginGoogle = async () => {
    const { auth, isConfigured } = initFirebase();
    if (isConfigured && auth) {
      try {
        await loginWithGoogle(auth);
        showToast('Signed in with Google! Contribution points will now be saved.', 'success');
      } catch (err: any) {
        showToast(`Sign in error: ${err?.message || 'Could not complete login'}`, 'penalty');
      }
    } else {
      const mockUser: UserProfile = {
        uid: 'user-' + Math.random().toString(36).substring(2, 8),
        displayName: 'Community Builder',
        contributionPoints: 4,
        generatedCount: 2,
        rejectedCount: 0,
        submittedCount: 2,
        streakDays: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        unlockedBadgeIds: ['first-spark'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCurrentUser(mockUser);
      setIsGuest(false);
      localStorage.setItem('omnitools_current_user', JSON.stringify(mockUser));

      const updatedUsers = [mockUser, ...users.filter((u) => u.uid !== mockUser.uid)];
      setUsers(updatedUsers);
      saveLocalUsers(updatedUsers);
      showToast('Signed in in local mode! Contribution points tracking active.', 'success');
    }
  };

  const handleLoginGuest = async () => {
    const { auth, isConfigured } = initFirebase();
    if (isConfigured && auth) {
      try {
        await loginAsGuest(auth);
        showToast('Continuing as Guest. Sign in with Google to save points on the leaderboard!', 'info');
      } catch (err: any) {
        showToast(`Guest error: ${err?.message || 'Could not sign in'}`, 'penalty');
      }
    } else {
      const guestUser: UserProfile = {
        uid: `guest-${Math.random().toString(36).substring(2, 6)}`,
        displayName: 'Guest User',
        contributionPoints: 0,
        generatedCount: 0,
        rejectedCount: 0,
        submittedCount: 0,
        streakDays: 0,
        lastActiveDate: new Date().toISOString().split('T')[0],
        unlockedBadgeIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCurrentUser(guestUser);
      setIsGuest(true);
      localStorage.setItem('omnitools_current_user', JSON.stringify(guestUser));
      showToast('Continuing as Guest.', 'info');
    }
  };

  const handleLogout = async () => {
    const { auth, isConfigured } = initFirebase();
    if (isConfigured && auth) {
      await logoutUser(auth);
    }
    setCurrentUser(null);
    setIsGuest(false);
    localStorage.removeItem('omnitools_current_user');
    showToast('Signed out.', 'info');
  };

  // Gamification: Daily check-in bonus
  const canClaimDaily = () => {
    if (!currentUser || isGuest) return false;
    const today = new Date().toISOString().split('T')[0];
    return currentUser.lastActiveDate !== today;
  };

  const handleClaimDailyCheckIn = async () => {
    if (!currentUser || isGuest) return;
    const today = new Date().toISOString().split('T')[0];
    const newStreak = currentUser.streakDays + 1;
    const newPoints = currentUser.contributionPoints + 1;

    const updated: UserProfile = {
      ...currentUser,
      contributionPoints: newPoints,
      streakDays: newStreak,
      lastActiveDate: today,
    };

    setCurrentUser(updated);

    const { db, isConfigured } = initFirebase();
    if (isConfigured && db) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          contributionPoints: increment(1),
          streakDays: newStreak,
          lastActiveDate: today,
        });
      } catch (err) {
        console.warn('Daily check-in Firestore sync error:', err);
      }
    } else {
      const updatedUsers = users.map((u) => (u.uid === currentUser.uid ? updated : u));
      setUsers(updatedUsers);
      saveLocalUsers(updatedUsers);
      localStorage.setItem('omnitools_current_user', JSON.stringify(updated));
    }

    showToast(`Claimed daily reward! +1 Contribution Point (Streak: ${newStreak} Days) 🔥`, 'success');
  };

  // Submit Request
  const handleSubmitRequest = async (
    newReqData: Omit<ToolRequest, 'id' | 'createdAt' | 'updatedAt' | 'votes' | 'voters' | 'pointsAwarded'>
  ) => {
    const newReq: ToolRequest = {
      ...newReqData,
      id: `req-${Date.now()}`,
      votes: 1,
      voters: currentUser ? [currentUser.uid] : [],
      pointsAwarded: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { db, isConfigured } = initFirebase();
    if (isConfigured && db) {
      try {
        await setDoc(doc(db, 'tool_requests', newReq.id), newReq);
      } catch (e) {
        console.warn('Firestore create request error, saving locally:', e);
      }
    }

    const updated = [newReq, ...requests];
    setRequests(updated);
    saveLocalRequests(updated);

    syncPromptToGoogleSheet(newReq, 'create').then((res) => {
      if (res.success) {
        console.log('Google Sheets sync:', res.message);
      }
    });

    showToast('Your tool idea has been submitted to the public queue!', 'success');
  };

  // Update Status (+2 CP for completed/generated, -5 CP for inappropriate rejection)
  const handleUpdateStatus = async (
    requestId: string,
    status: RequestStatus,
    version?: string,
    rejectionReason?: string
  ) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    let pointsDelta = 0;
    if (status === 'completed') {
      pointsDelta = 2; // +2 CP per prompt
    } else if (status === 'rejected') {
      pointsDelta = -5; // -5 CP per prompt
    }

    const updatedReq: ToolRequest = {
      ...req,
      status,
      completedVersion: version || req.completedVersion,
      pointsAwarded: pointsDelta,
      rejectionReason: rejectionReason || req.rejectionReason,
      updatedAt: new Date().toISOString(),
    };

    const updatedRequests = requests.map((r) => (r.id === requestId ? updatedReq : r));
    setRequests(updatedRequests);
    saveLocalRequests(updatedRequests);

    if (!req.isGuest && pointsDelta !== 0) {
      const targetUser = users.find((u) => u.uid === req.authorId);
      if (targetUser) {
        const newCp = Math.max(0, targetUser.contributionPoints + pointsDelta);
        const updatedTargetUser: UserProfile = {
          ...targetUser,
          contributionPoints: newCp,
          generatedCount: status === 'completed' ? targetUser.generatedCount + 1 : targetUser.generatedCount,
          rejectedCount: status === 'rejected' ? targetUser.rejectedCount + 1 : targetUser.rejectedCount,
          updatedAt: new Date().toISOString(),
        };

        const updatedUsersList = users.map((u) => (u.uid === targetUser.uid ? updatedTargetUser : u));
        setUsers(updatedUsersList);
        saveLocalUsers(updatedUsersList);

        if (currentUser?.uid === targetUser.uid) {
          setCurrentUser(updatedTargetUser);
          localStorage.setItem('omnitools_current_user', JSON.stringify(updatedTargetUser));
        }
      }
    }

    const { db, isConfigured } = initFirebase();
    if (isConfigured && db) {
      try {
        await updateDoc(doc(db, 'tool_requests', requestId), {
          status,
          completedVersion: updatedReq.completedVersion || '',
          pointsAwarded: pointsDelta,
          rejectionReason: updatedReq.rejectionReason || '',
          updatedAt: new Date().toISOString(),
        });

        if (!req.isGuest && pointsDelta !== 0) {
          await updateDoc(doc(db, 'users', req.authorId), {
            contributionPoints: increment(pointsDelta),
            generatedCount: status === 'completed' ? increment(1) : increment(0),
            rejectedCount: status === 'rejected' ? increment(1) : increment(0),
          });
        }
      } catch (err) {
        console.warn('Firestore update status error:', err);
      }
    }

    syncPromptToGoogleSheet(updatedReq, 'update');

    if (status === 'completed') {
      showToast(`Feature marked completed & shipped in ${version || 'app'}! +2 CP awarded to ${req.authorName}. 🎉`, 'success');
    } else if (status === 'rejected') {
      showToast(`Request rejected for inappropriate/spam purposes. -5 CP penalty applied to ${req.authorName}. ⚠️`, 'penalty');
    } else {
      showToast(`Status updated to "${status.replace('_', ' ')}".`, 'info');
    }
  };

  // Upvote Request
  const handleVote = async (requestId: string) => {
    const voterId = currentUser?.uid || 'guest';
    const updated = requests.map((r) => {
      if (r.id === requestId) {
        const hasVoted = r.voters?.includes(voterId);
        const newVoters = hasVoted ? r.voters.filter((v) => v !== voterId) : [...(r.voters || []), voterId];
        const newVotes = hasVoted ? Math.max(0, r.votes - 1) : r.votes + 1;
        return { ...r, votes: newVotes, voters: newVoters };
      }
      return r;
    });

    setRequests(updated);
    saveLocalRequests(updated);

    const { db, isConfigured } = initFirebase();
    if (isConfigured && db) {
      try {
        const reqDoc = updated.find((r) => r.id === requestId);
        if (reqDoc) {
          await updateDoc(doc(db, 'tool_requests', requestId), {
            votes: reqDoc.votes,
            voters: reqDoc.voters,
          });
        }
      } catch (e) {
        console.warn('Vote sync error:', e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-700/80 shadow-emerald-900/40'
                : toast.type === 'penalty'
                ? 'bg-rose-950/90 text-rose-200 border-rose-700/80 shadow-rose-900/40'
                : 'bg-blue-950/90 text-blue-200 border-blue-700/80 shadow-blue-900/40'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'penalty' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        isGuest={isGuest}
        onLoginGoogle={handleLoginGoogle}
        onLoginGuest={handleLoginGuest}
        onLogout={handleLogout}
        firebaseConfig={firebaseConfig}
        onOpenFirebaseModal={() => setFirebaseModalOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Active Tab View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'calculator' && <ScientificCalculator />}
        {activeTab === 'timer' && <PomodoroTimer />}
        {activeTab === 'text-tools' && <TextTools />}
        {activeTab === 'unit-converter' && <UnitConverter />}
        {activeTab === 'qr-generator' && <QrGenerator />}
        {activeTab === 'request-hub' && (
          <ToolRequestHub
            requests={requests}
            currentUser={currentUser}
            isGuest={isGuest}
            onSubmitRequest={handleSubmitRequest}
            onUpdateStatus={handleUpdateStatus}
            onVote={handleVote}
            onOpenAuth={() => handleLoginGoogle()}
          />
        )}
        {activeTab === 'leaderboard' && (
          <div className="space-y-8">
            <TieredBadges
              currentUser={currentUser}
              onClaimDailyCheckIn={handleClaimDailyCheckIn}
              canClaimDaily={canClaimDaily()}
            />
            <Leaderboard users={users} currentUserId={currentUser?.uid} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span>OmniTools Hub</span> •{' '}
            <span className="font-mono text-cyan-400">v{APP_VERSION}</span> •{' '}
            <span>Community Web Utilities</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="./tools.html" className="hover:text-slate-300">
              tools.html Directory
            </a>
            <button
              onClick={() => setFirebaseModalOpen(true)}
              className="text-slate-400 hover:text-white flex items-center gap-1"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Firebase Settings</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Firebase Custom Configuration Modal */}
      <FirebaseModal
        isOpen={firebaseModalOpen}
        onClose={() => setFirebaseModalOpen(false)}
        onConfigUpdated={() => {
          setFirebaseConfig(getSavedFirebaseConfig());
          showToast('Firebase configuration updated and synced!', 'success');
        }}
      />

      {/* Quick Search Command Palette Modal (Activated by button or Esc / Ctrl+K) */}
      <QuickSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectTab={(tabId) => {
          setActiveTab(tabId);
          setSearchModalOpen(false);
        }}
        requests={requests}
      />
    </div>
  );
}
