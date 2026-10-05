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
import { SuggestEnhancementModal } from './components/SuggestEnhancementModal';
import { SettingsPage } from './components/SettingsPage';
import { playClickSound, playSuccessSound } from './services/soundEffects';
import { FriendsHub } from './components/FriendsHub';
import { TOOLS_REGISTRY, DEFAULT_FAVORITE_IDS, THEMES } from './data/toolsRegistry';

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
import { ThreeDViewer } from './components/tools/ThreeDViewer';
import { ThreeDConverter } from './components/tools/ThreeDConverter';
import { FileConverterSuite } from './components/tools/FileConverterSuite';
import { JwtAuditor } from './components/tools/JwtAuditor';
import { PomodoroSoundscapeMixer } from './components/tools/PomodoroSoundscapeMixer';
import { JsonToTsGenerator } from './components/tools/JsonToTsGenerator';
import { CssGridBuilder } from './components/tools/CssGridBuilder';
import { RegexVisualizer } from './components/tools/RegexVisualizer';
import { DataSculptor } from './components/tools/DataSculptor';
import { CssSnapshotDiff } from './components/tools/CssSnapshotDiff';
import { AssetOverrider } from './components/tools/AssetOverrider';
import { ApiPlaybackMock } from './components/tools/ApiPlaybackMock';
import { CodeDocContextTool } from './components/tools/CodeDocContextTool';
import { RequestReplayTool } from './components/tools/RequestReplayTool';
import { StyleSyncVars } from './components/tools/StyleSyncVars';
import { DevLinkSnippets } from './components/tools/DevLinkSnippets';
import { CodeLensNavigatorTool } from './components/tools/CodeLensNavigatorTool';
import { A11yLensLive } from './components/tools/A11yLensLive';
import GraphingCalculator from './components/tools/GraphingCalculator';
import RegexPlayground from './components/tools/RegexPlayground';
import PerfGuard from './components/tools/PerfGuard';
import MockRequest from './components/tools/MockRequest';
import ApiContextSwitcher from './components/tools/ApiContextSwitcher';
import StateLens from './components/tools/StateLens';
import StateSync from './components/tools/StateSync';
import CssGridPlayground from './components/tools/CssGridPlayground';
import ApiMocktail from './components/tools/ApiMocktail';
import DomDiffSnapshot from './components/tools/DomDiffSnapshot';
import InteractionFlowRecorder from './components/tools/InteractionFlowRecorder';
import BundleAnalyzer from './components/tools/BundleAnalyzer';
import ComponentGrapher from './components/tools/ComponentGrapher';
import EventFlowDebugger from './components/tools/EventFlowDebugger';
import NoAiSearch from './components/tools/NoAiSearch';
import CssStackingVisualizer from './components/tools/CssStackingVisualizer';
import { AutoGeminiBot } from './components/tools/AutoGeminiBot';

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
import { ToolRequest, UserProfile, RequestStatus, FirebaseCustomConfig, ADMIN_EMAIL, isAdminEmail, ToolUsageStat, ToolIssue, ThemeId } from './types';
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
  logoutUser,
  cleanFirestoreData
} from './services/firebase';
import { syncPromptToGoogleSheet, fetchRequestsFromGoogleSheet } from './services/googleSheets';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
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
  'friends-hub': 148,
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
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem('omnitools_theme');
      if (saved && (saved === 'indigo' || saved === 'cyberpunk' || saved === 'emerald' || saved === 'minimalist')) {
        return saved as ThemeId;
      }
    } catch {}
    return 'indigo';
  });

  const handleThemeChange = (theme: ThemeId) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('omnitools_theme', theme);
    showToast(`Switched workspace theme to ${THEMES[theme].name}! ✨`, 'success');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('omnitools_theme', currentTheme);
  }, [currentTheme]);

  // Apply visual and ergonomic preferences on mount
  useEffect(() => {
    try {
      const fontScale = localStorage.getItem('omnitools_font_scale');
      if (fontScale) document.documentElement.setAttribute('data-font-scale', fontScale);

      const codeFont = localStorage.getItem('omnitools_code_font');
      if (codeFont) document.documentElement.setAttribute('data-code-font', codeFont);

      const highContrast = localStorage.getItem('omnitools_high_contrast');
      if (highContrast) document.documentElement.setAttribute('data-high-contrast', highContrast);

      const reducedMotion = localStorage.getItem('omnitools_reduced_motion');
      if (reducedMotion) document.documentElement.setAttribute('data-reduced-motion', reducedMotion);
    } catch {}
  }, []);

  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const toolParam = params.get('tool');
      if (toolParam) return toolParam;
      if (params.get('tab') === 'settings') return 'settings';
      if (window.location.pathname === '/admin') return 'admin';

      const shouldRestore = localStorage.getItem('omnitools_restore_last_tool') === 'true';
      const lastTool = localStorage.getItem('omnitools_last_tool');
      if (shouldRestore && lastTool) return lastTool;

      const defaultLanding = localStorage.getItem('omnitools_default_tab');
      if (defaultLanding && ['home', 'favorites', 'request-hub', 'leaderboard', 'settings'].includes(defaultLanding)) {
        return defaultLanding;
      }
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
    if (localStorage.getItem('omnitools_track_usage') === 'false') return;

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
    if (activeTab && activeTab !== 'home' && activeTab !== 'settings' && activeTab !== 'leaderboard' && activeTab !== 'favorites' && activeTab !== 'request-hub') {
      localStorage.setItem('omnitools_last_tool', activeTab);
    }
  }, [activeTab]);

  // Report Bug Modal Handlers
  const handleOpenReportModal = (toolId: string, toolName: string) => {
    setActiveReportTool({ id: toolId, name: toolName });
    setReportModalOpen(true);
  };

  const [enhancementModalOpen, setEnhancementModalOpen] = useState(false);
  const [enhancingTool, setEnhancingTool] = useState<{ id: string; name: string } | null>(null);

  const handleOpenEnhancementModal = (toolId: string, toolName: string) => {
    setEnhancingTool({ id: toolId, name: toolName });
    setEnhancementModalOpen(true);
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
        await setDoc(doc(db, 'tool_issues', newIssue.id), cleanFirestoreData(newIssue));
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

        await setDoc(doc(db, 'users', target.reporterId), {
          contributionPoints: increment(3),
          updatedAt: nowIso,
        }, { merge: true });
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
      playClickSound();
      showToast(`Removed "${toolName}" from favorites.`, 'info');
    } else {
      playSuccessSound();
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
          await setDoc(doc(db, 'users', currentUser.uid), {
            favoriteToolIds: newFavorites,
            updatedAt: new Date().toISOString(),
          }, { merge: true });
        } catch (e) {
          console.warn('Sync favorites error:', e);
        }
      }
    }
  };

  // Update Friends List
  const handleUpdateFriends = async (newFriendIds: string[]) => {
    if (!currentUser) return;
    const updatedUser: UserProfile = {
      ...currentUser,
      friendIds: newFriendIds,
      updatedAt: new Date().toISOString(),
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('omnitools_current_user', JSON.stringify(updatedUser));

    const updatedUsers = users.map((u) => (u.uid === currentUser.uid ? updatedUser : u));
    setUsers(updatedUsers);
    saveLocalUsers(updatedUsers);

    const { db, isConfigured } = initFirebase();
    if (isConfigured && db) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid), {
          friendIds: newFriendIds,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (e) {
        console.warn('Firestore update friends error:', e);
      }
    }
    showToast('Friends list updated successfully!', 'success');
  };

  // Global keyboard shortcuts for navigation & search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      } else if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        const key = e.key.toLowerCase();
        if (key === 'h') {
          e.preventDefault();
          setActiveTab('home');
        } else if (key === 'l') {
          e.preventDefault();
          setActiveTab('leaderboard');
        } else if (key === 'f') {
          e.preventDefault();
          setActiveTab('favorites');
        } else if (key === 'r') {
          e.preventDefault();
          setActiveTab('request-hub');
        }
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
          const isOwnerAdmin = user.email && isAdminEmail(user.email);
          if (isOwnerAdmin) {
            setIsAdminMode(true);
          }

          // Fetch existing Firestore profile to preserve user CP & streaks
          let firestoreUser: UserProfile | null = null;
          try {
            const userSnap = await getDoc(doc(db, 'users', user.uid));
            if (userSnap.exists()) {
              firestoreUser = userSnap.data() as UserProfile;
            }
          } catch (e) {
            console.warn('Error reading existing user from Firestore:', e);
          }

          const existingLocal = getInitialUser();
          const existingPoints = Math.max(
            firestoreUser?.contributionPoints ?? 0,
            existingLocal && existingLocal.uid === user.uid ? existingLocal.contributionPoints : 0
          );
          const existingStreak = Math.max(
            firestoreUser?.streakDays ?? 1,
            existingLocal && existingLocal.uid === user.uid ? existingLocal.streakDays : 1
          );
          const existingShipped = firestoreUser?.shippedTools?.length
            ? firestoreUser.shippedTools
            : existingLocal && existingLocal.uid === user.uid
            ? existingLocal.shippedTools || []
            : [];
          const existingFriends = firestoreUser?.friendIds?.length
            ? firestoreUser.friendIds
            : existingLocal && existingLocal.uid === user.uid
            ? existingLocal.friendIds || []
            : [];
          const existingBadges = firestoreUser?.unlockedBadgeIds?.length
            ? firestoreUser.unlockedBadgeIds
            : existingLocal?.unlockedBadgeIds || [];

          const userProfile: UserProfile = {
            uid: user.uid,
            displayName: user.displayName || firestoreUser?.displayName || (user.isAnonymous ? 'Guest User' : 'Community Member'),
            photoURL: user.photoURL || firestoreUser?.photoURL || undefined,
            email: user.email || firestoreUser?.email || undefined,
            contributionPoints: existingPoints,
            generatedCount: Math.max(firestoreUser?.generatedCount ?? 0, existingLocal?.generatedCount ?? 0),
            rejectedCount: Math.max(firestoreUser?.rejectedCount ?? 0, existingLocal?.rejectedCount ?? 0),
            submittedCount: Math.max(firestoreUser?.submittedCount ?? 0, existingLocal?.submittedCount ?? 0),
            streakDays: existingStreak,
            lastActiveDate: firestoreUser?.lastActiveDate || new Date().toISOString().split('T')[0],
            unlockedBadgeIds: existingBadges,
            shippedTools: existingShipped,
            favoriteToolIds: favoriteIds,
            friendIds: existingFriends,
            createdAt: firestoreUser?.createdAt || existingLocal?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          try {
            await setDoc(doc(db, 'users', user.uid), cleanFirestoreData(userProfile), { merge: true });
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
        friendIds: existing?.friendIds || [],
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
        friendIds: existing?.friendIds || [],
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
        await setDoc(doc(db, 'users', currentUser.uid), {
          contributionPoints: increment(1),
          streakDays: newStreak,
          lastActiveDate: today,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
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
        await setDoc(doc(db, 'users', currentUser.uid), {
          contributionPoints: increment(-cost),
          streakFreezes: increment(1),
          updatedAt: new Date().toISOString(),
        }, { merge: true });
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

  const handleUpdateUser = async (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('omnitools_current_user', JSON.stringify(updatedUser));
    const updatedUsers = users.some(u => u.uid === updatedUser.uid)
      ? users.map(u => u.uid === updatedUser.uid ? updatedUser : u)
      : [updatedUser, ...users];
    setUsers(updatedUsers);
    saveLocalUsers(updatedUsers);

    const { db, isConfigured } = initFirebase();
    if (isConfigured && db) {
      try {
        await setDoc(doc(db, 'users', updatedUser.uid), cleanFirestoreData(updatedUser), { merge: true });
      } catch (e) {
        console.warn('Error updating user profile in Firestore:', e);
      }
    }
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
        await setDoc(doc(db, 'tool_requests', newReq.id), cleanFirestoreData(newReq));
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
          await setDoc(doc(db, 'users', req.authorId), {
            contributionPoints: increment(pointsDelta),
            generatedCount: status === 'completed' ? increment(1) : increment(0),
            rejectedCount: status === 'rejected' ? increment(1) : increment(0),
            updatedAt: nowIso,
          }, { merge: true });
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
    <div className={`min-h-screen ${THEMES[currentTheme].bgClass} flex flex-col font-sans selection:bg-blue-600 selection:text-white`}>
      {/* Toast Notification Container */}
      {toast && (
        <div
          className={`fixed z-50 animate-bounce ${
            localStorage.getItem('omnitools_toast_pos') === 'top-right'
              ? 'top-5 right-5'
              : localStorage.getItem('omnitools_toast_pos') === 'bottom-center'
              ? 'bottom-5 left-1/2 -translate-x-1/2'
              : 'bottom-5 right-5'
          }`}
        >
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
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
      />

      {/* Active Tab View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Active Tool Header with 1-Click Star Button & Usage Count */}
        {isToolView && (
          <ActiveToolHeader
            activeTab={activeTab}
            favoriteIds={favoriteIds}
            usageCount={usageCounts[activeTab] || 0}
            currentUser={currentUser}
            onToggleFavorite={handleToggleFavorite}
            onNavigateFavorites={() => setActiveTab('favorites')}
            onReportBug={handleOpenReportModal}
            onSuggestEnhancement={handleOpenEnhancementModal}
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
            onOpenSearch={() => setSearchModalOpen(true)}
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
        {activeTab === 'friends-hub' && (
          <FriendsHub
            currentUser={currentUser}
            users={users}
            onUpdateFriends={handleUpdateFriends}
            onOpenAuth={handleLoginGoogle}
          />
        )}

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
        {activeTab === '3d-viewer' && <ThreeDViewer />}
        {activeTab === '3d-converter' && <ThreeDConverter />}
        {activeTab === 'jwt-auditor' && <JwtAuditor />}
        {activeTab === 'ambient-soundscape' && <PomodoroSoundscapeMixer />}
        {activeTab === 'json-ts-gen' && <JsonToTsGenerator />}
        {activeTab === 'css-grid-builder' && <CssGridBuilder />}
        {activeTab === 'regex-visualizer' && <RegexVisualizer />}
        {activeTab === 'data-sculptor' && <DataSculptor />}
        {activeTab === 'css-snapshot-diff' && <CssSnapshotDiff />}
        {activeTab === 'asset-overrider' && <AssetOverrider />}
        {activeTab === 'api-playback' && <ApiPlaybackMock />}
        {activeTab === 'codedoc-context' && <CodeDocContextTool />}
        {activeTab === 'request-replay' && <RequestReplayTool />}
        {activeTab === 'stylesync-vars' && <StyleSyncVars />}
        {activeTab === 'devlink-snippets' && <DevLinkSnippets />}
        {activeTab === 'codelens-navigator' && <CodeLensNavigatorTool />}
        {activeTab === 'a11ylens-live' && <A11yLensLive />}
        {activeTab === 'graphing-calculator' && <GraphingCalculator />}
        {activeTab === 'regex-playground' && <RegexPlayground />}
        {activeTab === 'perf-guard' && <PerfGuard />}
        {activeTab === 'mock-request' && <MockRequest />}
        {activeTab === 'api-context-switcher' && <ApiContextSwitcher />}
        {activeTab === 'state-lens' && <StateLens />}
        {activeTab === 'state-sync' && <StateSync />}
        {activeTab === 'css-grid-playground' && <CssGridPlayground />}
        {activeTab === 'api-mocktail' && <ApiMocktail />}
        {activeTab === 'dom-diff-snapshot' && <DomDiffSnapshot />}
        {activeTab === 'interaction-flow-recorder' && <InteractionFlowRecorder />}
        {activeTab === 'bundle-analyzer' && <BundleAnalyzer />}
        {activeTab === 'component-grapher' && <ComponentGrapher />}
        {activeTab === 'event-flow-debugger' && <EventFlowDebugger />}
        {activeTab === 'no-ai-search' && <NoAiSearch />}
        {activeTab === 'css-stacking-visualizer' && <CssStackingVisualizer />}
        {activeTab === 'auto-gemini-bot' && (
          <AutoGeminiBot
            currentUser={currentUser}
            requests={requests}
            onUpdateUser={handleUpdateUser}
            onSubmitRequest={handleSubmitRequest}
            onOpenAuth={handleLoginGoogle}
          />
        )}

        {/* Universal File Converter Suite & 100+ Permutation Tools */}
        {(activeTab === 'file-converter' || activeTab.startsWith('convert-')) && (
          <FileConverterSuite
            initialToolId={activeTab}
            onSelectTool={(toolId) => setActiveTab(toolId)}
          />
        )}

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
            setActiveTab={setActiveTab}
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

        {/* Workspace Settings */}
        {activeTab === 'settings' && (
          <SettingsPage onBack={() => setActiveTab('home')} />
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

      {/* Keyboard Shortcuts Footer Legend */}
      <footer className="mt-20 border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500 space-y-3">
        <div className="flex items-center justify-center gap-2 flex-wrap px-4">
          <span className="font-bold text-slate-400">Keyboard Shortcuts:</span>
          <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-md font-mono text-slate-300">
            <strong className="text-blue-400">H</strong> Home
          </span>
          <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-md font-mono text-slate-300">
            <strong className="text-amber-400">L</strong> Leaderboard
          </span>
          <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-md font-mono text-slate-300">
            <strong className="text-purple-400">F</strong> Favorites
          </span>
          <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-md font-mono text-slate-300">
            <strong className="text-cyan-400">R</strong> Requests
          </span>
          <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-md font-mono text-slate-300">
            <strong className="text-emerald-400">Ctrl+K</strong> Search
          </span>
        </div>
        <div>OmniTools Platform Architect • Professional Web Utility Suite</div>
      </footer>

      {enhancingTool && (
        <SuggestEnhancementModal
          tool={enhancingTool}
          currentUser={currentUser}
          isGuest={isGuest}
          isOpen={enhancementModalOpen}
          onClose={() => setEnhancementModalOpen(false)}
          onSubmit={handleSubmitRequest}
          onOpenAuth={handleLoginGoogle}
        />
      )}
    </div>
  );
}
