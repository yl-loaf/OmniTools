export type RequestCategory = 'math' | 'productivity' | 'text' | 'conversion' | 'developer' | 'utility' | 'other';
export type RequestStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';

export const ADMIN_EMAIL = 'smashyblocks7@gmail.com';

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
  createdAt: string;
  updatedAt: string;
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
