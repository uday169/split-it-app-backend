// API Request Types
export interface SendOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface UpdateProfileRequest {
  name: string;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
}

export interface AddMemberRequest {
  email: string;
}

export interface CreateExpenseRequest {
  groupId: string;
  description: string;
  amount: number;
  currency?: string;
  paidBy: string;
  splitType: 'equal' | 'manual';
  date?: string;
  splitDetails: Array<{
    userId: string;
    amount: number;
  }>;
}

export interface UpdateExpenseRequest {
  description?: string;
  amount?: number;
  splitDetails?: Array<{
    userId: string;
    amount: number;
  }>;
}

export interface CreateSettlementRequest {
  groupId: string;
  paidTo: string;
  amount: number;
  currency?: string;
  notes?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  expiresIn: number;
  user: User;
}

export interface SendOtpResponse {
  message: string;
  expiresIn: number;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  userRole?: 'admin' | 'member';
}

export interface GroupMember {
  userId: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  addedAt: string;
}

export interface GroupDetails extends Group {
  members: GroupMember[];
}

export interface GroupsListResponse {
  groups: Group[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  currency: string;
  paidBy: {
    userId: string;
    name: string;
  };
  date: string;
  createdAt: string;
  splitCount: number;
}

export interface ExpenseDetails extends Omit<Expense, 'paidBy' | 'splitCount'> {
  paidBy: {
    userId: string;
    name: string;
    email: string;
  };
  splitType: 'equal' | 'manual';
  splits: Array<{
    userId: string;
    userName: string;
    amount: number;
  }>;
}

export interface ExpensesListResponse {
  expenses: Expense[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface Balance {
  userId: string;
  userName: string;
  netBalance: number;
  owes: Array<{
    userId: string;
    userName: string;
    amount: number;
  }>;
  owedBy: Array<{
    userId: string;
    userName: string;
    amount: number;
  }>;
}

export interface BalancesResponse {
  groupId: string;
  balances: Balance[];
  totalOwed: number;
  isBalanced: boolean;
}

export interface UserBalanceResponse {
  userId: string;
  groupId: string;
  netBalance: number;
  owes: Array<{
    userId: string;
    userName: string;
    email: string;
    amount: number;
  }>;
  owedBy: Array<{
    userId: string;
    userName: string;
    email: string;
    amount: number;
  }>;
}

export interface Settlement {
  id: string;
  groupId: string;
  paidBy: {
    userId: string;
    name: string;
  };
  paidTo: {
    userId: string;
    name: string;
  };
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed';
  notes?: string;
  createdAt: string;
  confirmedAt?: string;
}

export interface SettlementsListResponse {
  settlements: Settlement[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}
