// Types derived from 3ridge-backend schema.gql — read-only subset only

export type ChainType = "EVM" | "APTOS" | "STACKS" | "SOLANA";

export type QuestType =
  | "TWITTER_FOLLOW"
  | "TWITTER_LIKE"
  | "TWITTER_RETWEET"
  | "DISCORD_JOIN"
  | "TELEGRAM_JOIN"
  | "VOOI_TELEGRAM"
  | "QUIZ"
  | "SURVEY"
  | "UPLOAD_SCREENSHOT"
  | "ON_CHAIN_TRANSACTION"
  | "VISIT_WEB"
  | "BASIC";

export type EventRewardType = "LUCKY_DRAW" | "FIRST_COME_FIRST_SERVED" | "ALL";
export type EventRewardMethod = "MANUAL" | "EMAIL" | "SOLANA" | "EVM" | "Telegram";
export type AdminRole = "Master" | "Manager" | "Staff";

export interface Wallet {
  chainType: ChainType;
  walletAddress: string;
}

export interface EmailCredential {
  email: string;
}

export interface DiscordUser {
  username: string;
  global_name: string | null;
}

export interface TelegramUser {
  id: number;
  username: string;
  first_name: string | null;
  last_name: string | null;
  photo_url: string | null;
  auth_date: number;
}

export interface Prize {
  name: string;
  method: EventRewardMethod;
  winnerLimit: number | null;
}

export interface EventReward {
  type: EventRewardType;
  description: string;
  point: number;
  prizes: Prize[];
}

export interface EventParticipant {
  _id: string;
  profileImage: string | null;
}

export interface ProjectSocials {
  discord: string | null;
  medium: string | null;
  website: string | null;
  telegram: string | null;
  naverBlog: string | null;
  twitter: string | null;
  kakaotalk: string | null;
  youtube: string | null;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  image: string | null;
  socials: ProjectSocials;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  image: string | null;
  questCounts: number;
  reward: EventReward | null;
  isVisible: boolean;
  project: Project | null;
  beginDate: string;
  untilDate: string;
  createdAt: string;
  updatedAt: string;
  participants: EventParticipant[];
}

export interface Quest {
  _id: string;
  eventId: string;
  displayText: string;
  type: QuestType;
  createdAt: string;
  updatedAt: string;
}

export interface CompletedQuest {
  user: string;
  event: string;
  completedQuestIds: string[];
  isCompletedEvent: boolean;
}

export interface User {
  _id: string;
  emailCredential: EmailCredential | null;
  wallets: Wallet[];
  socials: Array<{ type: string; [key: string]: unknown }>;
  profileImage: string | null;
  point: number;
  roles: string[];
  privyId: string | null;
}

export interface ParticipatedEventsResponse {
  participatedEvents: Event[];
  completedEvents: Event[];
  participatedEventsCounts: number;
  completedEventsCounts: number;
}

export interface AdminUser {
  _id: string;
  name: string;
  username: string;
  roles: AdminRole[];
  privyId: string | null;
  slackId: string | null;
}

export interface Short {
  _id: string;
  src: string;
  target: string;
  queryString: string | null;
}

export interface QuestAnswer {
  _id: string;
  user: string;
  event: string;
  quest: string;
  answers: string[];
}

// Auth types (for login mutation only)
export interface AuthUser {
  roles: string[];
  adminRoles: AdminRole[] | null;
  sub: string;
  group: string | null;
  username: string | null;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  user: AuthUser;
}

// Mashboard REST types
export interface LeaderboardEntry {
  id: string;
  name: string;
  [key: string]: unknown;
}

export interface MindshareData {
  [key: string]: unknown;
}

export interface OracleSummary {
  [key: string]: unknown;
}
