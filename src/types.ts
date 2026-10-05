export type ThemeId = 'indigo' | 'cyberpunk' | 'emerald' | 'minimalist';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  bgClass: string;
  cardBgClass: string;
  borderClass: string;
  accentClass: string;
}

export type RequestCategory = 'math' | 'productivity' | 'text' | 'conversion' | 'developer' | 'utility' | 'other';
export type RequestStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';

export const ADMIN_EMAILS = [
  'rainforest.cck3@gmail.com',
  'smashyblocks7@gmail.com'
];
export const ADMIN_EMAIL = 'rainforest.cck3@gmail.com';

export const isAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.some((e) => e.toLowerCase() === email.toLowerCase());
};

export interface ToolRequest {
  id: string;
  title: string;
  description: string;
  category: RequestCategory;
  status: RequestStatus;
  completedVersion?: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  isGuest: boolean;
  pointsAwarded: number; // +2 for completed/generated, -5 for inappropriate/spam
  rejectionReason?: string;
  votes: number;
  voters: string[];
  createdAt: string;
  updatedAt: string;
  deployedAt?: string; // Timestamp when marked as completed/deployed
}

export interface ShippedToolRecord {
  id: string;
  name: string;
  version: string;
  completedAt: string;
}

export interface ToolUsageStat {
  id: string;
  usageCount: number;
  lastUsedAt: string;
}

export interface ToolIssue {
  id: string;
  toolId: string;
  toolName: string;
  description: string;
  reporterId: string;
  reporterName: string;
  status: 'open' | 'resolved' | 'dismissed';
  fixNotes?: string;
  pointsAwarded: number; // +3 CP for successful fix
  createdAt: string;
  updatedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond' | 'master';
  minPoints: number;
  icon: string;
}

export interface CPTransaction {
  id: string;
  amount: number;
  reason: string;
  timestamp: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL?: string;
  email?: string;
  contributionPoints: number;
  generatedCount: number;
  rejectedCount: number;
  submittedCount: number;
  streakDays: number;
  streakFreezes?: number;
  lastActiveDate: string;
  unlockedBadgeIds: string[];
  shippedTools?: ShippedToolRecord[];
  favoriteToolIds?: string[];
  friendIds?: string[];
  friendRequests?: string[];
  transactions?: CPTransaction[];
  showNameOnLeaderboard?: boolean;
  createdAt: string;
  updatedAt: string;
  autoGeminiPurchased?: boolean;
  autoGeminiEnabled?: boolean;
  autoGeminiIntervalMinutes?: number;
  autoGeminiLastRun?: string;
  autoGeminiSubmittedCount?: number;
}

export interface CompletionStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  rejected: number;
  completionRate: number;
  totalPointsDistributed: number;
}

export interface FirebaseCustomConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  databaseId?: string;
}
