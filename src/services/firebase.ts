import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  getDocs,
  getDocFromServer,
  onSnapshot,
  updateDoc,
  deleteDoc,
  Unsubscribe
} from 'firebase/firestore';
import {
  getAuth,
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { FirebaseCustomConfig, ToolRequest, UserProfile } from '../types';

const STORAGE_KEY_FIREBASE_CONFIG = 'omnitools_firebase_config';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  authInstance?: Auth | null
) {
  const currentUser = authInstance?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Error: ', JSON.stringify(errInfo));
  return errInfo;
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

export function getSavedFirebaseConfig(): FirebaseCustomConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FIREBASE_CONFIG);
    if (!raw) {
      const defaultConfig: FirebaseCustomConfig = {
        apiKey: "AIzaSyAMu6zJOZq39bJdLy5ohF5oQ2zXJpubATM",
        authDomain: "omnitools-e2d82.firebaseapp.com",
        projectId: "omnitools-e2d82",
        storageBucket: "omnitools-e2d82.firebasestorage.app",
        messagingSenderId: "435380731603",
        appId: "1:435380731603:web:3169574ad4782d98b91e26",
      };
      localStorage.setItem(STORAGE_KEY_FIREBASE_CONFIG, JSON.stringify(defaultConfig));
      return defaultConfig;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveFirebaseConfig(config: FirebaseCustomConfig) {
  localStorage.setItem(STORAGE_KEY_FIREBASE_CONFIG, JSON.stringify(config));
  app = null;
  db = null;
  auth = null;
  return initFirebase(config);
}

export function clearFirebaseConfig() {
  localStorage.removeItem(STORAGE_KEY_FIREBASE_CONFIG);
  app = null;
  db = null;
  auth = null;
}

export function initFirebase(customConfig?: FirebaseCustomConfig | null) {
  const config = customConfig || getSavedFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    return { app: null, db: null, auth: null, isConfigured: false };
  }

  try {
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }

    db = config.databaseId ? getFirestore(app, config.databaseId) : getFirestore(app);
    auth = getAuth(app);

    return { app, db, auth, isConfigured: true };
  } catch (err) {
    console.error('Failed to initialize Firebase with custom config:', err);
    return { app: null, db: null, auth: null, isConfigured: false };
  }
}

export async function testFirestoreConnection(database: Firestore): Promise<{ success: boolean; message: string }> {
  try {
    await getDocFromServer(doc(database, 'test', 'connection'));
    return { success: true, message: 'Successfully connected to Cloud Firestore!' };
  } catch (error: any) {
    const msg = error?.message || String(error);
    if (msg.includes('the client is offline')) {
      return { success: false, message: 'Client is offline. Please check your network & Firestore rules.' };
    }
    if (msg.includes('permission-denied') || msg.includes('Missing or insufficient permissions')) {
      return { success: true, message: 'Project reachable (Firestore rules evaluated successfully).' };
    }
    return { success: false, message: msg };
  }
}

// Auth helpers
export async function loginWithGoogle(authInstance: Auth) {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(authInstance, provider);
}

export async function loginAsGuest(authInstance: Auth) {
  return signInAnonymously(authInstance);
}

export async function logoutUser(authInstance: Auth) {
  return signOut(authInstance);
}

// Local Storage Fallback Store
const LOCAL_REQUESTS_KEY = 'omnitools_requests_local';
const LOCAL_USERS_KEY = 'omnitools_users_local';

export function getLocalRequests(): ToolRequest[] {
  try {
    const data = localStorage.getItem(LOCAL_REQUESTS_KEY);
    if (!data) {
      const initial: ToolRequest[] = [
        {
          id: 'req-1',
          title: 'Pomodoro Focus Timer & Lap Stopwatch',
          description: 'Customizable work/break intervals (25m/5m/15m) with pleasant synthesizer chimes and millisecond lap splits.',
          category: 'productivity',
          status: 'completed',
          completedVersion: 'v1.0.2',
          authorId: 'dev-alex',
          authorName: 'Alex Chen',
          isGuest: false,
          pointsAwarded: 2,
          votes: 24,
          voters: [],
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'req-2',
          title: 'Text & String Transformation Studio',
          description: 'Convert case (camelCase, snake_case, Title Case), Base64 encode/decode, and format/beautify JSON.',
          category: 'text',
          status: 'completed',
          completedVersion: 'v1.0.2',
          authorId: 'elena-ux',
          authorName: 'Elena Rostova',
          isGuest: false,
          pointsAwarded: 2,
          votes: 19,
          voters: [],
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'req-3',
          title: 'Markdown Live Previewer & Cheat Sheet',
          description: 'Split-screen Markdown editor with GitHub flavored syntax, tables, and one-click copy as formatted HTML.',
          category: 'developer',
          status: 'in_progress',
          authorId: 'marcus-k',
          authorName: 'Marcus Kane',
          isGuest: false,
          pointsAwarded: 0,
          votes: 31,
          voters: [],
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'req-4',
          title: 'Password Generator with Entropy Meter',
          description: 'Generate high-security passwords with selectable symbols, ambiguous character exclusion, and bit strength analysis.',
          category: 'utility',
          status: 'pending',
          authorId: 'guest-77',
          authorName: 'Guest Contributor',
          isGuest: true,
          pointsAwarded: 0,
          votes: 12,
          voters: [],
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      localStorage.setItem(LOCAL_REQUESTS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveLocalRequests(requests: ToolRequest[]) {
  localStorage.setItem(LOCAL_REQUESTS_KEY, JSON.stringify(requests));
}

export function getLocalUsers(): UserProfile[] {
  try {
    const data = localStorage.getItem(LOCAL_USERS_KEY);
    if (!data) {
      const initialUsers: UserProfile[] = [
        {
          uid: 'dev-alex',
          displayName: 'Alex Chen',
          contributionPoints: 14,
          generatedCount: 5,
          rejectedCount: 0,
          submittedCount: 6,
          streakDays: 5,
          lastActiveDate: new Date().toISOString().split('T')[0],
          unlockedBadgeIds: ['first-spark', 'silver-builder'],
          createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          uid: 'elena-ux',
          displayName: 'Elena Rostova',
          contributionPoints: 10,
          generatedCount: 4,
          rejectedCount: 0,
          submittedCount: 4,
          streakDays: 3,
          lastActiveDate: new Date().toISOString().split('T')[0],
          unlockedBadgeIds: ['first-spark', 'silver-builder'],
          createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          uid: 'marcus-k',
          displayName: 'Marcus Kane',
          contributionPoints: 6,
          generatedCount: 2,
          rejectedCount: 0,
          submittedCount: 3,
          streakDays: 2,
          lastActiveDate: new Date().toISOString().split('T')[0],
          unlockedBadgeIds: ['first-spark'],
          createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    }
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveLocalUsers(users: UserProfile[]) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}
