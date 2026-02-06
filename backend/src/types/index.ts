import { Request } from 'express';

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Auth types
export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthRequest<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: JwtPayload;
}

// Group types
export interface Group {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  memberCount: number;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: 'admin' | 'member';
  joinedAt: Date;
}

// Expense types
export type SplitType = 'equal' | 'manual';

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  currency: string;
  paidBy: string;
  splitType: SplitType;
  date: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseSplit {
  id: string;
  expenseId: string;
  userId: string;
  amount: number;
}

// Balance types
export interface Balance {
  userId: string;
  userName: string;
  owes: Array<{
    userId: string;
    userName: string;
    amount: number;
  }>;
}

// Settlement types
export interface Settlement {
  id: string;
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  currency: string;
  date: Date;
  confirmedByPayer: boolean;
  confirmedByPayee: boolean;
  confirmedAt?: Date;
  createdAt: Date;
}

// Email OTP types
export interface EmailOtp {
  id: string;
  email: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}
