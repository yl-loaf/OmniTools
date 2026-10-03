export type RequestCategory = 'math' | 'productivity' | 'text' | 'conversion' | 'developer' | 'utility' | 'other';
export type RequestStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';

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
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond' | 'master';
  minPoints: number;
  icon: string;
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
