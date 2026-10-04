/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FirebaseModal } from './components/FirebaseModal';
import { QuickSearchModal } from './components/QuickSearchModal';
import { FavoritesHub } from './components/FavoritesHub';
import { ActiveToolHeader } from './components/ActiveToolHeader';
import { HomePage } from './components/HomePage';
import { ReportBugModal } from './components/ReportBugModal';
import { TOOLS_REGISTRY, DEFAULT_FAVORITE_IDS } from './data/toolsRegistry';

// Existing Tools
import { ScientificCalculator } from './components/tools/ScientificCalculator';
import { PomodoroTimer } from './components/tools/PomodoroTimer';
import { TextTools } from './components/tools/TextTools';
import { UnitConverter } from './components/tools/UnitConverter';
import { QrGenerator } from './components/tools/QrGenerator';
import { CountdownTool } from './components/tools/CountdownTool';
import { PrecisionTimerTool } from './components/tools/PrecisionTimerTool';
import { SpeedTestTool } from './components/tools/SpeedTestTool';
import { TypingSpeedTool } from './components/tools/TypingSpeedTool';

// Extended Tool Suite
import { MarkdownEditor } from './components/tools/MarkdownEditor';
import { JsonFormatter } from './components/tools/JsonFormatter';
import { ColorStudio } from './components/tools/ColorStudio';
import { CryptoEncoder } from './components/tools/CryptoEncoder';
import { RegexTester } from './components/tools/RegexTester';
import { PasswordGenerator } from './components/tools/PasswordGenerator';
import { FinanceCalculator } from './components/tools/FinanceCalculator';
import { CssGenerator } from './components/tools/CssGenerator';
import { TimeConverter } from './components/tools/TimeConverter';
import { DimensionCalculator } from './components/tools/DimensionCalculator';
import { SqlFormatter } from './components/tools/SqlFormatter';
import { DiffChecker } from './components/tools/DiffChecker';
import { MetaTagGenerator } from './components/tools/MetaTagGenerator';
import { HtmlEntityEncoder } from './components/tools/HtmlEntityEncoder';
import { CsvViewer } from './components/tools/CsvViewer';
import { JwtDebugger } from './components/tools/JwtDebugger';
import { CronGenerator } from './components/tools/CronGenerator';
import { SvgOptimizer } from './components/tools/SvgOptimizer';
import { LoremIpsumGenerator } from './components/tools/LoremIpsumGenerator';
import { BarcodeGenerator } from './components/tools/BarcodeGenerator';
import { ChmodCalculator } from './components/tools/ChmodCalculator';
import { HttpStatusLookup } from './components/tools/HttpStatusLookup';
import { KeycodeEventTester } from './components/tools/KeycodeEventTester';
import { CurlBuilder } from './components/tools/CurlBuilder';
import { SoundBinauralGenerator } from './components/tools/SoundBinauralGenerator';

// Daily Life & 30+ Features Suites
import { HealthFitnessSuite } from './components/tools/daily/HealthFitnessSuite';
import { FinanceLifeSuite } from './components/tools/daily/FinanceLifeSuite';
import { ProductivityTimeSuite } from './components/tools/daily/ProductivityTimeSuite';
import { HomeTravelSuite } from './components/tools/daily/HomeTravelSuite';
import { QuickUtilsSuite } from './components/tools/daily/QuickUtilsSuite';

// Community & Admin
import { ToolRequestHub } from './components/ToolRequestHub';
import { AdminPortal } from './components/AdminPortal';
import { Leaderboard } from './components/Leaderboard';
import { TieredBadges } from './components/TieredBadges';
import { ToolRequest, UserProfile, RequestStatus, FirebaseCustomConfig, ADMIN_EMAIL, ToolUsageStat, ToolIssue } from './types';
import { APP_VERSION } from '../version.js';
import {
  initFirebase,
  getSavedFirebaseConfig,
  getLocalRequests,
  saveLocalRequests,
  getLocalUsers,
  saveLocalUsers,
  getLocalIssues,
  saveLocalIssues,
  loginWithGoogle,
  loginAsGuest,
  logoutUser
} from './services/firebase';
import { syncPromptToGoogleSheet, fetchRequestsFromGoogleSheet } from './services/googleSheets';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
  query,
  orderBy
} from 'firebase/firestore';
import { CheckCircle2, AlertTriangle, Sparkles, Database, Star } from 'lucide-react';

const DEFAULT_BASELINE_USAGE: Record<string, number> = {
  'speed-test': 142,
  'typing-test': 139,
  'precision-timer': 136,
  'countdown': 124,
  'health-suite': 112,
  'finance-suite': 98,
  'productivity-suite': 94,
  'home-suite': 86,
  'quick-utils-suite': 91,
  'json-studio': 84,
  'calculator': 79,
  'markdown': 65,
  'password-gen': 58,
  'color-studio': 49,
  'regex-tester': 44,
  'diff-checker': 38,
  'crypto-encoder': 35,
  'finance-calc': 32,
  'sql-formatter': 29,
  'timer': 28,
  'qr-generator': 25,
  'time-converter': 22,
  'unit-converter': 20,
  'sound-synth': 18,
};

export default function App() {
  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const toolParam = params.get('tool');
      if (toolParam) return toolParam;
      if (window.location.pathname === '/admin') return 'admin';
    }
    return 'home';
  };

  const getInitialFavorites = (): string[] => {
    try {
      const saved = localStorage.getItem('omnitools_favorite_tools');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return DEFAULT_FAVORITE_IDS;
  };

  const getInitialUsageCounts = (): Record<string, number> => {
    try {
      const saved = localStorage.getItem('omnitools_tool_usage_counts');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_BASELINE_USAGE, ...parsed };
      }
    } catch {}
    return DEFAULT_BASELINE_USAGE;
  };

  const getInitialUser = (): UserProfile | null => {
    try {
      const saved = localStorage.getItem('omnitools_current_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(getInitialFavorites);
  const [usageCounts, setUsageCounts] = useState<Record<string, number>>(getInitialUsageCounts);
  const [issues, setIssues] = useState<ToolIssue[]>(getLocalIssues());
  const [firebaseModalOpen, setFirebaseModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [activeReportTool, setActiveReportTool] = useState<{ id: string; name: string } | null>(null);

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseCustomConfig | null>(getSavedFirebaseConfig());

  // User State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getInitialUser);
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

  // Track Tool Usage (Firestore increment & Local state)
  const trackToolUsage = async (toolId: string) => {
    const isTool = TOOLS_REGISTRY.some((t) => t.id === toolId);
    if (!isTool) return;

    setUsageCounts((prev) => {
      const updated = {
        ...prev,
        [toolId]: (prev[toolId] || 0) + 1,
      };
      localStorage.setItem('omnitools_tool_usage_counts', JSON.stringify(updated));
      return updated;
    });

    const { db, isConfigured } = initFirebase();
    if (isConfigured && db) {
      try {
        await setDoc(
          doc(db, 'tool_stats', toolId),
          {
            id: toolId,
            usageCount: increment(1),
            lastUsedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (e) {
        console.warn('Error recording tool usage in Firestore:', e);
      }
    }
  };

  // Trigger usage tracking whenever active tab changes to a tool
  useEffect(() => {
    trackToolUsage(activeTab);
  }, [activeTab]);

  // Report Bug Modal Handlers
  const handleOpenReportModal = (toolId: string, toolName: string) => {
    setActiveReportTool({ id: toolId, name: toolName });
    setReportModalOpen(true);
  };

  const handleSubmitBugReport = async (issueData: Omit<ToolIssue, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'pointsAwarded'>) => {
    const newIssue: ToolIssue = {
      ...issueData,
      id: `issue-${Date.now()}`,
      status: 'open',
      pointsAwarded: 3, // +3 CP reward
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newIssue, ...issues];
    setIssues(updated);
    saveLocalIssues(updated);

    const { db, isConfigured } = initFirebase();
    if (isConfigured && db) {
      try {
        await setDoc(doc(db, 'tool_issues', newIssue.id), newIssue);
      } catch (e) {
        console.warn('Firestore create issue error:', e);
      }
    }

    showToast('Bug report submitted! If fixed by admin, you will receive +3 CP reward. 🐞', 'success');
  };

  const handleResolveIssue = async (issueId: string, fixNotes: string) => {
    const target = issues.find((i) => i.id === issueId);
    if (!target) return;

    const nowIso = new Date().toISOString();
    const updatedIssue: ToolIssue = {
      ...target,
      status: 'resolved',
      fixNotes,
      updatedAt: nowIso,
    };

    const updatedIssues = issues.map((i) => (i.id === issueId ? updatedIssue : i));
    setIssues(updatedIssues);
    saveLocalIssues(updatedIssues);

    // Award +3 CP to reporter
    const reporterUser = users.find((u) => u.uid === target.reporterId) || (currentUser?.uid === target.reporterId ? currentUser : null);
    const currentReporterCp = reporterUser ? reporterUser.contributionPoints : 0;
    const newCp = currentReporterCp + 3;

    if (reporterUser || currentUser?.uid === target.reporterId) {
      const baseUser = reporterUser || currentUser!;
      const updatedReporter: UserProfile = {
        ...baseUser,
        contributionPoints: newCp,
        updatedAt: nowIso,
      };
      const updatedUsers = users.some(u => u.uid === baseUser.uid)
        ? users.map((u) => (u.uid === baseUser.uid ? updatedReporter : u))
        : [updatedReporter, ...users];

      setUsers(updatedUsers);
      saveLocalUsers(updatedUsers);

      if (currentUser?.uid === target.reporterId) {
        setCurrentUser(updatedReporter);
        localStorage.setItem('omnitools_current_user', JSON.stringify(updatedReporter));
      }
    }

    const { db, isConfigured } = initFirebase();
    if (isConfigured && db) {
      try {
        await updateDoc(doc(db, 'tool_issues', issueId), {
          status: 'resolved',
          fixNotes,
          updatedAt: nowIso,
        });

        await updateDoc(doc(db, 'users', target.reporterId), {
          contributionPoints: increment(3),
          updatedAt: nowIso,
        });
      } catch (e) {
        console.warn('Firestore resolve issue error:', e);
      }
    }

    showToast(`Bug fixed! +3 CP awarded to ${target.reporterName}. 🎉`, 'success');
  };

  // Toggle favorite
  const handleToggleFavorite = async (toolId: string) => {
    const isFav = favoriteIds.includes(toolId);
    const newFavorites = isFav
      ? favoriteIds.filter((id) => id !== toolId)
      : [...favoriteIds, toolId];

    setFavoriteIds(newFavorites);
    localStorage.setItem('omnitools_favorite_tools', JSON.stringify(newFavorites));

    const toolMeta = TOOLS_REGISTRY.find((t) => t.id === toolId);
    const toolName = toolMeta?.name || 'Tool';

    if (isFav) {
      showToast(`Removed "${toolName}" from favorites.`, 'info');
    } else {
      showToast(`Starred "${toolName}" to My Favorites! ⭐`, 'success');
    }

    if (currentUser) {
      const updatedUser: UserProfile = {
        ...currentUser,
        favoriteToolIds: newFavorites,
        updatedAt: new Date().toISOString(),
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('omnitools_current_user', JSON.stringify(updatedUser));

      const { db, isConfigured } = initFirebase();
      if (isConfigured && db) {
        try {
          await updateDoc(doc(db, 'users', currentUser.uid), {
            favoriteToolIds: newFavorites,
            updatedAt: new Date().toISOString(),
          });
        } catch (e) {
          console.warn('Sync favorites error:', e);
        }
      }
    }
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

  // Initialize data sources on mount
  useEffect(() => {
    const savedConfig = getSavedFirebaseConfig();
    setFirebaseConfig(savedConfig);

    const { db, auth, isConfigured } = initFirebase(savedConfig);

    if (isConfigured && db && auth) {
      // 1. Auth Listener
      const unsubAuth = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setIsGuest(user.isAnonymous);
          const isOwnerAdmin = user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
          if (isOwnerAdmin) {
            setIsAdminMode(true);
          }

          const existingLocal = getInitialUser();
          const existingPoints = existingLocal && existingLocal.uid === user.uid ? existingLocal.contributionPoints : 0;
          const existingStreak = existingLocal && existingLocal.uid === user.uid ? existingLocal.streakDays : 1;
          const existingShipped = existingLocal && existingLocal.uid === user.uid ? (existingLocal.shippedTools || []) : [];

          const userProfile: UserProfile = {
            uid: user.uid,
            displayName: user.displayName || (user.isAnonymous ? 'Guest User' : 'Community Member'),
            photoURL: user.photoURL || undefined,
            email: user.email || undefined,
            contributionPoints: existingPoints,
            generatedCount: existingLocal?.generatedCount || 0,
            rejectedCount: existingLocal?.rejectedCount || 0,
            submittedCount: existingLocal?.submittedCount || 0,
            streakDays: existingStreak,
            lastActiveDate: new Date().toISOString().split('T')[0],
            unlockedBadgeIds: existingLocal?.unlockedBadgeIds || [],
            shippedTools: existingShipped,
            favoriteToolIds: favoriteIds,
            createdAt: existingLocal?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          try {
            await setDoc(doc(db, 'users', user.uid), userProfile, { merge: true });
          } catch (e) {
            console.warn('Error syncing user profile:', e);
          }
          setCurrentUser(userProfile);
          localStorage.setItem('omnitools_current_user', JSON.stringify(userProfile));
        } else {
          setCurrentUser(null);
          setIsGuest(false);
          setIsAdminMode(false);
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
          const localReqs = getLocalRequests();
          setRequests(localReqs);
          fetchRequestsFromGoogleSheet().then((sheetReqs) => {
            if (sheetReqs && sheetReqs.length > 0) {
              const merged = [...sheetReqs];
              for (const lr of localReqs) {
                if (!merged.some((mr) => mr.id === lr.id)) {
                  merged.push(lr);
                }
              }
              setRequests(merged);
              saveLocalRequests(merged);
            }
          });
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
            if (found) {
              setCurrentUser((prev) => {
                const updated = { ...found, contributionPoints: Math.max(found.contributionPoints, prev?.contributionPoints || 0) };
                localStorage.setItem('omnitools_current_user', JSON.stringify(updated));
                return updated;
              });
            }
          }
        },
        (error) => {
          console.warn('Firestore users listener fallback:', error);
          setUsers(getLocalUsers());
        }
      );

      // 4. Real-time Tool Usage Stats Listener
      const unsubStats = onSnapshot(
        collection(db, 'tool_stats'),
        (snapshot) => {
          const statsMap: Record<string, number> = { ...DEFAULT_BASELINE_USAGE };
          snapshot.forEach((d) => {
            const data = d.data();
            if (data && data.id && typeof data.usageCount === 'number') {
              statsMap[data.id] = data.usageCount;
            }
          });
          setUsageCounts(statsMap);
          localStorage.setItem('omnitools_tool_usage_counts', JSON.stringify(statsMap));
        },
        (error) => {
          console.warn('Firestore tool_stats listener fallback:', error);
        }
      );

      // 5. Real-time Tool Issues Listener
      const unsubIssues = onSnapshot(
        query(collection(db, 'tool_issues'), orderBy('createdAt', 'desc')),
        (snapshot) => {
          const loaded: ToolIssue[] = [];
          snapshot.forEach((d) => loaded.push(d.data() as ToolIssue));
          setIssues(loaded);
          saveLocalIssues(loaded);
        },
        (error) => {
          console.warn('Firestore tool_issues listener fallback:', error);
          setIssues(getLocalIssues());
        }
      );

      return () => {
        unsubAuth();
        unsubRequests();
        unsubUsers();
        unsubStats();
        unsubIssues();
      };
    } else {
      // Local Storage & Google Sheets Fallback Mode
      const localUsers = getLocalUsers();
      setUsers(localUsers);

      const savedUserJson = localStorage.getItem('omnitools_current_user');
      if (savedUserJson) {
        try {
          const parsed = JSON.parse(savedUserJson);
          setCurrentUser(parsed);
          setIsGuest(parsed.uid.startsWith('guest-'));
          if (parsed.email && parsed.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
            setIsAdminMode(true);
          }
        } catch {
          // ignore
        }
      }

      // Pre-populate with local storage first so the UI loads instantly
      const localReqs = getLocalRequests();
      setRequests(localReqs);

      // Automatically sync and pull submissions from Google Sheets in the background
      fetchRequestsFromGoogleSheet()
        .then((sheetReqs) => {
          if (sheetReqs && sheetReqs.length > 0) {
            const merged = [...sheetReqs];
            for (const lr of localReqs) {
              if (!merged.some((mr) => mr.id === lr.id)) {
                merged.push(lr);
              }
            }
            setRequests(merged);
            saveLocalRequests(merged);
          }
        })
        .catch((err) => {
          console.warn('Startup Google Sheet sync fallback error:', err);
        });
    }
  }, []);

  // Auth Handlers
  const handleLoginGoogle = async () => {
    const { auth, isConfigured } = initFirebase();
    if (isConfigured && auth) {
      try {
        await loginWithGoogle(auth);
        showToast('Signed in with Google! Contribution points and favorites will now be saved.', 'success');
      } catch (err: any) {
        showToast(`Google Sign-In: ${err.message}`, 'penalty');
      }
    } else {
      const existing = getInitialUser();
      const mockUser: UserProfile = {
        uid: existing?.uid || `admin-${Date.now()}`,
        displayName: existing?.displayName || 'Lead Platform Architect',
        email: ADMIN_EMAIL,
        contributionPoints: existing?.contributionPoints || 10,
        generatedCount: existing?.generatedCount || 5,
        rejectedCount: 0,
        submittedCount: 5,
        streakDays: 7,
        lastActiveDate: new Date().toISOString().split('T')[0],
        unlockedBadgeIds: ['first-spark', 'master-architect'],
        shippedTools: existing?.shippedTools || [],
        favoriteToolIds: favoriteIds,
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCurrentUser(mockUser);
      setIsGuest(false);
      setIsAdminMode(true);
      localStorage.setItem('omnitools_current_user', JSON.stringify(mockUser));

      const updatedUsers = [mockUser, ...users.filter(u => u.uid !== mockUser.uid)];
      setUsers(updatedUsers);
      saveLocalUsers(updatedUsers);

      showToast('Signed in as Executive Platform Architect!', 'success');
    }
  };

  const handleLoginGuest = async () => {
    const { auth, isConfigured } = initFirebase();
    if (isConfigured && auth) {
      try {
        await loginAsGuest(auth);
        showToast('Signed in as Guest. Propose tools and test features anonymously.', 'info');
      } catch (err: any) {
        showToast(`Guest login: ${err.message}`, 'penalty');
      }
    } else {
      const existing = getInitialUser();
      const guestId = existing?.uid || `guest-${Math.floor(1000 + Math.random() * 9000)}`;
      const guestUser: UserProfile = {
        uid: guestId,
        displayName: existing?.displayName || `Guest #${guestId.slice(-4)}`,
        contributionPoints: existing?.contributionPoints || 0,
        generatedCount: existing?.generatedCount || 0,
        rejectedCount: 0,
        submittedCount: 0,
        streakDays: existing?.streakDays || 0,
        lastActiveDate: new Date().toISOString().split('T')[0],
        unlockedBadgeIds: [],
        shippedTools: [],
        favoriteToolIds: favoriteIds,
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCurrentUser(guestUser);
      setIsGuest(true);
      setIsAdminMode(false);
      localStorage.setItem('omnitools_current_user', JSON.stringify(guestUser));
      showToast('Signed in as Guest (Anonymous Mode).', 'info');
    }
  };

  const handleLogout = async () => {
    const { auth, isConfigured } = initFirebase();
    if (isConfigured && auth) {
      await logoutUser(auth);
    }
    setCurrentUser(null);
    setIsGuest(false);
    setIsAdminMode(false);
    localStorage.removeItem('omnitools_current_user');
    showToast('Signed out successfully.', 'info');
  };

  // Gamification: Daily Check-in (+1 CP)
  const canClaimDaily = (): boolean => {
    if (!currentUser || isGuest) return false;
    const today = new Date().toISOString().split('T')[0];
    return currentUser.lastActiveDate !== today;
  };

  const handleClaimDailyCheckIn = async () => {
    if (!currentUser || isGuest) {
      showToast('Please sign in with a registered account to claim daily rewards.', 'penalty');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const isConsecutive = currentUser.lastActiveDate === yesterday;
    const newStreak = isConsecutive ? (currentUser.streakDays || 0) + 1 : 1;
    const newPoints = currentUser.contributionPoints + 1;

    const updated: UserProfile = {
      ...currentUser,
      contributionPoints: newPoints,
      streakDays: newStreak,
      lastActiveDate: today,
      updatedAt: new Date().toISOString(),
    };

    setCurrentUser(updated);
    localStorage.setItem('omnitools_current_user', JSON.stringify(updated));

    const { db, isConfigured } = initFirebase();
    if (isConfigured && db) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          contributionPoints: increment(1),
          streakDays: newStreak,
          lastActiveDate: today,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Firestore daily check-in sync error:', err);
      }
    } else {
      const updatedUsers = users.map((u) => (u.uid === currentUser.uid ? updated : u));
      setUsers(updatedUsers);
      saveLocalUsers(updatedUsers);
    }

    showToast(`Claimed daily reward! +1 CP (Streak: ${newStreak} days 🔥)`, 'success');
  };

  // Gamification: Purchase Streak Freeze
  const handleBuyStreakFreeze = async () => {
    if (!currentUser) return;
    const cost = 10;
    if (currentUser.contributionPoints < cost) {
      showToast(`Not enough points! You need ${cost} CP to buy a Streak Freeze.`, 'penalty');
      return;
    }

    const updated: UserProfile = {
      ...currentUser,
      contributionPoints: currentUser.contributionPoints - cost,
      streakFreezes: (currentUser.streakFreezes || 0) + 1,
      updatedAt: new Date().toISOString(),
    };

    setCurrentUser(updated);
    localStorage.setItem('omnitools_current_user', JSON.stringify(updated));

    const { db, isConfigured } = initFirebase();
    if (isConfigured && db) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          contributionPoints: increment(-cost),
          streakFreezes: increment(1),
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Streak freeze purchase sync error:', err);
      }
    } else {
      const updatedUsers = users.map((u) => (u.uid === currentUser.uid ? updated : u));
      setUsers(updatedUsers);
      saveLocalUsers(updatedUsers);
    }

    showToast('Successfully purchased a Streak Freeze! 🧊 Protected against missed days.', 'success');
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

  // Update Status (+2 CP for completed/deployed, -5 CP for inappropriate rejection)
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

    const nowIso = new Date().toISOString();
    const shippedVer = version || req.completedVersion || `v${APP_VERSION}`;

    const updatedReq: ToolRequest = {
      ...req,
      status,
      completedVersion: shippedVer,
      pointsAwarded: pointsDelta,
      rejectionReason: rejectionReason || req.rejectionReason,
      deployedAt: status === 'completed' ? (req.deployedAt || nowIso) : req.deployedAt,
      updatedAt: nowIso,
    };

    const updatedRequests = requests.map((r) => (r.id === requestId ? updatedReq : r));
    setRequests(updatedRequests);
    saveLocalRequests(updatedRequests);

    // Update target author profile & record shipped tool
    if (!req.isGuest && pointsDelta !== 0) {
      const targetUser = users.find((u) => u.uid === req.authorId) || (currentUser?.uid === req.authorId ? currentUser : null);
      if (targetUser) {
        const newCp = Math.max(0, targetUser.contributionPoints + pointsDelta);
        const currentShipped = targetUser.shippedTools || [];
        const newShipped = [...currentShipped];

        if (status === 'completed' && !newShipped.some(t => t.id === req.id)) {
          newShipped.push({
            id: req.id,
            name: req.title,
            version: shippedVer,
            completedAt: nowIso,
          });
        }

        const updatedTargetUser: UserProfile = {
          ...targetUser,
          contributionPoints: newCp,
          generatedCount: status === 'completed' ? targetUser.generatedCount + 1 : targetUser.generatedCount,
          rejectedCount: status === 'rejected' ? targetUser.rejectedCount + 1 : targetUser.rejectedCount,
          shippedTools: newShipped,
          updatedAt: nowIso,
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
          completedVersion: shippedVer,
          pointsAwarded: pointsDelta,
          rejectionReason: updatedReq.rejectionReason || '',
          deployedAt: updatedReq.deployedAt || nowIso,
          updatedAt: nowIso,
        });

        if (!req.isGuest && pointsDelta !== 0) {
          await updateDoc(doc(db, 'users', req.authorId), {
            contributionPoints: increment(pointsDelta),
            generatedCount: status === 'completed' ? increment(1) : increment(0),
            rejectedCount: status === 'rejected' ? increment(1) : increment(0),
            updatedAt: nowIso,
          });
        }
      } catch (err) {
        console.warn('Firestore update status error:', err);
      }
    }

    syncPromptToGoogleSheet(updatedReq, 'update');

    if (status === 'completed') {
      showToast(`Feature "${req.title}" deployed in ${shippedVer}! +2 CP awarded to ${req.authorName}. 🎉`, 'success');
    } else if (status === 'rejected') {
      showToast(`Request rejected. -5 CP penalty applied to ${req.authorName}. ⚠️`, 'penalty');
    } else {
      showToast(`Status updated to "${status.replace('_', ' ')}".`, 'info');
    }
  };

  // Delete single request document
  const handleDeleteRequest = async (requestId: string) => {
    const updated = requests.filter((r) => r.id !== requestId);
    setRequests(updated);
    saveLocalRequests(updated);

    const { db, isConfigured } = initFirebase();
    if (isConfigured && db) {
      try {
        await deleteDoc(doc(db, 'tool_requests', requestId));
      } catch (e) {
        console.warn('Firestore delete error:', e);
      }
    }
    showToast('Request deleted from Firebase & queue.', 'info');
  };

  // Auto-Purge: Delete completed requests deployed for more than 7 days from Firebase
  const handlePurgeOldRequests = async (): Promise<number> => {
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    const purgeTargets = requests.filter((r) => {
      if (r.status !== 'completed') return false;
      const refTime = r.deployedAt ? new Date(r.deployedAt).getTime() : new Date(r.updatedAt).getTime();
      return now - refTime > SEVEN_DAYS_MS;
    });

    if (purgeTargets.length === 0) {
      showToast('No shipped requests older than 7 days found to purge.', 'info');
      return 0;
    }

    const purgeIds = new Set(purgeTargets.map((r) => r.id));
    const remaining = requests.filter((r) => !purgeIds.has(r.id));
    setRequests(remaining);
    saveLocalRequests(remaining);

    const { db, isConfigured } = initFirebase();
    if (isConfigured && db) {
      for (const target of purgeTargets) {
        try {
          await deleteDoc(doc(db, 'tool_requests', target.id));
        } catch (e) {
          console.warn('Firestore purge error for doc id:', target.id, e);
        }
      }
    }

    showToast(`Purged ${purgeTargets.length} deployed requests older than 7 days from Firebase. User profiles retained all points!`, 'success');
    return purgeTargets.length;
  };

  // Upvote/Downvote Request
  const handleVote = async (requestId: string, delta: number = 1) => {
    const updated = requests.map((r) => {
      if (r.id === requestId) {
        const newVotes = Math.max(0, (r.votes || 0) + delta);
        return {
          ...r,
          votes: newVotes,
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    });

    setRequests(updated);
    saveLocalRequests(updated);

    const targetReq = updated.find((r) => r.id === requestId);
    if (targetReq) {
      syncPromptToGoogleSheet(targetReq, 'update');
    }

    const { db, isConfigured } = initFirebase();
    if (isConfigured && db) {
      try {
        await updateDoc(doc(db, 'tool_requests', requestId), {
          votes: increment(delta),
          updatedAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Vote sync error:', e);
      }
    }
  };

  // Import requests extracted from Google Sheets
  const handleImportRequests = (importedRequests: ToolRequest[]) => {
    const current = [...requests];
    for (const item of importedRequests) {
      const idx = current.findIndex((r) => r.id === item.id);
      if (idx >= 0) {
        current[idx] = item;
      } else {
        current.unshift(item);
      }
    }
    setRequests(current);
    saveLocalRequests(current);
    showToast(`Loaded ${importedRequests.length} requests from Google Sheets!`, 'success');
  };

  // Determine if active view is a tool (for displaying tool header with star button)
  const isToolView = TOOLS_REGISTRY.some((t) => t.id === activeTab);

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
        favoriteIds={favoriteIds}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Active Tab View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Active Tool Header with 1-Click Star Button & Usage Count */}
        {isToolView && (
          <ActiveToolHeader
            activeTab={activeTab}
            favoriteIds={favoriteIds}
            usageCount={usageCounts[activeTab] || 0}
            onToggleFavorite={handleToggleFavorite}
            onNavigateFavorites={() => setActiveTab('favorites')}
            onReportBug={handleOpenReportModal}
          />
        )}

        {/* Homepage */}
        {activeTab === 'home' && (
          <HomePage
            setActiveTab={setActiveTab}
            requests={requests}
            users={users}
            usageCounts={usageCounts}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
            currentUser={currentUser}
            onOpenAuth={handleLoginGoogle}
          />
        )}

        {/* My Favorites Hub & Most Used Utilities Dashboard */}
        {activeTab === 'favorites' && (
          <FavoritesHub
            favoriteIds={favoriteIds}
            usageCounts={usageCounts}
            onToggleFavorite={handleToggleFavorite}
            onSelectTool={(id) => setActiveTab(id)}
          />
        )}

        {/* Daily Life Suites (30+ Features) */}
        {activeTab === 'health-suite' && <HealthFitnessSuite />}
        {activeTab === 'finance-suite' && <FinanceLifeSuite />}
        {activeTab === 'productivity-suite' && <ProductivityTimeSuite />}
        {activeTab === 'home-suite' && <HomeTravelSuite />}
        {activeTab === 'quick-utils-suite' && <QuickUtilsSuite />}

        {/* Core Tools */}
        {activeTab === 'calculator' && <ScientificCalculator />}
        {activeTab === 'timer' && <PomodoroTimer />}
        {activeTab === 'text-tools' && <TextTools />}
        {activeTab === 'unit-converter' && <UnitConverter />}
        {activeTab === 'qr-generator' && <QrGenerator />}
        {activeTab === 'speed-test' && <SpeedTestTool />}
        {activeTab === 'typing-test' && <TypingSpeedTool />}
        {activeTab === 'precision-timer' && <PrecisionTimerTool />}
        {activeTab === 'countdown' && <CountdownTool />}

        {/* Extended Suite Tools */}
        {activeTab === 'markdown' && <MarkdownEditor />}
        {activeTab === 'json-studio' && <JsonFormatter />}
        {activeTab === 'color-studio' && <ColorStudio />}
        {activeTab === 'crypto-encoder' && <CryptoEncoder />}
        {activeTab === 'regex-tester' && <RegexTester />}
        {activeTab === 'password-gen' && <PasswordGenerator />}
        {activeTab === 'finance-calc' && <FinanceCalculator />}
        {activeTab === 'css-generator' && <CssGenerator />}
        {activeTab === 'time-converter' && <TimeConverter />}
        {activeTab === 'dimension-calc' && <DimensionCalculator />}
        {activeTab === 'sql-formatter' && <SqlFormatter />}
        {activeTab === 'diff-checker' && <DiffChecker />}
        {activeTab === 'meta-gen' && <MetaTagGenerator />}
        {activeTab === 'html-entities' && <HtmlEntityEncoder />}
        {activeTab === 'csv-viewer' && <CsvViewer />}
        {activeTab === 'jwt-debugger' && <JwtDebugger />}
        {activeTab === 'cron-gen' && <CronGenerator />}
        {activeTab === 'svg-optimizer' && <SvgOptimizer />}
        {activeTab === 'lorem-gen' && <LoremIpsumGenerator />}
        {activeTab === 'barcode-gen' && <BarcodeGenerator />}
        {activeTab === 'chmod-calc' && <ChmodCalculator />}
        {activeTab === 'http-lookup' && <HttpStatusLookup />}
        {activeTab === 'keycode-tester' && <KeycodeEventTester />}
        {activeTab === 'curl-builder' && <CurlBuilder />}
        {activeTab === 'sound-synth' && <SoundBinauralGenerator />}

        {/* Executive Admin Portal (Exclusive for smashyblocks7@gmail.com) */}
        {activeTab === 'admin' && (
          <AdminPortal
            currentUser={currentUser}
            requests={requests}
            issues={issues}
            users={users}
            onUpdateStatus={handleUpdateStatus}
            onResolveIssue={handleResolveIssue}
            onPurgeOldRequests={handlePurgeOldRequests}
            onDeleteRequest={handleDeleteRequest}
            onLoginGoogle={handleLoginGoogle}
          />
        )}

        {/* Community & Gamification */}
        {activeTab === 'request-hub' && (
          <ToolRequestHub
            requests={requests}
            currentUser={currentUser}
            isGuest={isGuest}
            onSubmitRequest={handleSubmitRequest}
            onUpdateStatus={handleUpdateStatus}
            onVote={handleVote}
            onOpenAuth={() => handleLoginGoogle()}
            isAdminMode={isAdminMode}
            onToggleAdminMode={() => setIsAdminMode(!isAdminMode)}
            onImportRequests={handleImportRequests}
          />
        )}
        {activeTab === 'leaderboard' && (
          <div className="space-y-8">
            <TieredBadges
              currentUser={currentUser}
              onClaimDailyCheckIn={handleClaimDailyCheckIn}
              canClaimDaily={canClaimDaily()}
              onBuyStreakFreeze={handleBuyStreakFreeze}
            />
            <Leaderboard users={users} currentUserId={currentUser?.uid} />
          </div>
        )}
      </main>

      {/* Modals */}
      <FirebaseModal
        isOpen={firebaseModalOpen}
        onClose={() => setFirebaseModalOpen(false)}
        onConfigUpdated={() => {
          setFirebaseConfig(getSavedFirebaseConfig());
          showToast('Firebase configuration updated successfully!', 'success');
        }}
      />

      <QuickSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectTab={(tabId) => setActiveTab(tabId)}
        requests={requests}
        favoriteIds={favoriteIds}
        onToggleFavorite={handleToggleFavorite}
      />

      {activeReportTool && (
        <ReportBugModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          toolId={activeReportTool.id}
          toolName={activeReportTool.name}
          currentUser={currentUser}
          isGuest={isGuest}
          onSubmitIssue={handleSubmitBugReport}
          onOpenAuth={handleLoginGoogle}
        />
      )}
    </div>
  );
}
