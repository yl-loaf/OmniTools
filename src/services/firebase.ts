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
      return [];
    }
    const parsed: ToolRequest[] = JSON.parse(data);
    // Purge fake mock requests
    const realReqs = parsed.filter(
      (r) => !['req-1', 'req-2', 'req-3', 'req-4'].includes(r.id) &&
             !['dev-alex', 'elena-ux', 'marcus-k'].includes(r.authorId)
    );
    if (realReqs.length !== parsed.length) {
      localStorage.setItem(LOCAL_REQUESTS_KEY, JSON.stringify(realReqs));
    }
    return realReqs;
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
      return [];
    }
    const parsed: UserProfile[] = JSON.parse(data);
    // Purge fake mock seed users
    const realUsers = parsed.filter(
      (u) => !['dev-alex', 'elena-ux', 'marcus-k'].includes(u.uid)
    );
    if (realUsers.length !== parsed.length) {
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(realUsers));
    }
    return realUsers;
  } catch {
    return [];
  }
}

export function saveLocalUsers(users: UserProfile[]) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

// Tool Issues / Bug Reports Storage
const LOCAL_ISSUES_KEY = 'omnitools_issues_local';

export function getLocalIssues(): import('../types').ToolIssue[] {
  try {
    const data = localStorage.getItem(LOCAL_ISSUES_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveLocalIssues(issues: import('../types').ToolIssue[]) {
  localStorage.setItem(LOCAL_ISSUES_KEY, JSON.stringify(issues));
}

