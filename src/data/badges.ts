import { Badge } from '../types';

export const COMMUNITY_BADGES: Badge[] = [
  {
    id: 'first-spark',
    name: 'Bronze Spark',
    description: 'Generated your first accepted community tool (+2 CP)',
    tier: 'bronze',
    minPoints: 2,
    icon: '⚡',
  },
  {
    id: 'silver-builder',
    name: 'Silver Builder',
    description: 'Earned 10+ Contribution Points through useful ideas',
    tier: 'silver',
    minPoints: 10,
    icon: '🛡️',
  },
  {
    id: 'gold-architect',
    name: 'Gold Architect',
    description: 'Reached 25+ Contribution Points with standout feature ideas',
    tier: 'gold',
    minPoints: 25,
    icon: '🏆',
  },
  {
    id: 'diamond-innovator',
    name: 'Diamond Innovator',
    description: 'Achieved 50+ Contribution Points shaping the toolkit',
    tier: 'diamond',
    minPoints: 50,
    icon: '💎',
  },
  {
    id: 'master-creator',
    name: 'Mythic Mastermind',
    description: 'Elite 100+ Contribution Points community champion',
    tier: 'master',
    minPoints: 100,
    icon: '👑',
  },
];

export const POINT_RULES = {
  IDEA_GENERATED: 2,
  IDEA_REJECTED_INAPPROPRIATE: -5,
  DAILY_CHECKIN: 1,
};
