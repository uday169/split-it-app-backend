import type { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Otp: { email: string };
};

// Group Stack
export type GroupStackParamList = {
  GroupsList: undefined;
  GroupDetails: { groupId: string };
  CreateGroup: undefined;
  AddMember: { groupId: string };
};

// Expense Stack
export type ExpenseStackParamList = {
  AddExpense: { groupId: string };
  ExpenseDetails: { expenseId: string };
};

// Balance Stack
export type BalanceStackParamList = {
  Balances: { groupId: string };
  SettleUp: { groupId: string; userId: string; userName: string; amount: number };
};

// Profile Stack
export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
};

// Bottom Tab Navigator
export type MainTabParamList = {
  Home: NavigatorScreenParams<GroupStackParamList>;
  Activity: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  AddExpense: { groupId: string };
  ExpenseDetails: { expenseId: string };
  Balances: { groupId: string };
  SettleUp: { groupId: string; userId: string; userName: string; amount: number };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
