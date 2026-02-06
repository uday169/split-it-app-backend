import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation.types';
import { useGroup } from '../../hooks/useGroups';
import { useExpenses } from '../../hooks/useExpenses';
import { useUserBalance } from '../../hooks/useBalances';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Loading } from '../../components/common/Loading';
import { theme } from '../../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>;

export const GroupDetailsScreen: React.FC<Props> = ({ route, navigation }: any) => {
  const { groupId } = route.params;
  
  const { data: group, isLoading: groupLoading } = useGroup(groupId);
  const { data: expenses } = useExpenses(groupId, 1, 10);
  const { data: balance } = useUserBalance(groupId);

  if (groupLoading) {
    return <Loading />;
  }

  if (!group) {
    return (
      <View style={styles.container}>
        <Text>Group not found</Text>
      </View>
    );
  }

  const formatAmount = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  const handleAddMember = () => {
    navigation.navigate('Main', {
      screen: 'Home',
      params: {
        screen: 'AddMember',
        params: { groupId },
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Members Section */}
        <Card>
          <Text style={styles.sectionTitle}>MEMBERS ({group.memberCount})</Text>
          {group.members.map((member) => (
            <View key={member.userId} style={styles.memberRow}>
              <Text style={styles.memberCircle}>👤</Text>
              <Text style={styles.memberName}>
                {member.name || member.email}{' '}
                {member.role === 'admin' && (
                  <Text style={styles.adminBadge}>• Admin</Text>
                )}
              </Text>
            </View>
          ))}
          <Button
            title="+ Add Member"
            variant="outline"
            onPress={handleAddMember}
            style={styles.addButton}
          />
        </Card>

        {/* Balance Section */}
        {balance && (
          <Card>
            <Text style={styles.sectionTitle}>YOUR BALANCE</Text>
            <Text
              style={[
                styles.balanceAmount,
                balance.netBalance > 0 && styles.balancePositive,
                balance.netBalance < 0 && styles.balanceNegative,
              ]}
            >
              {balance.netBalance === 0
                ? 'All settled up'
                : balance.netBalance > 0
                ? `You're owed: ${formatAmount(balance.netBalance)}`
                : `You owe: ${formatAmount(Math.abs(balance.netBalance))}`}
            </Text>
            <Button
              title="View Balances"
              variant="outline"
              onPress={() =>
                navigation.navigate('Balances', { groupId })
              }
              style={styles.viewBalancesButton}
            />
          </Card>
        )}

        {/* Add Expense Button */}
        <Button
          title="+ Add Expense"
          onPress={() => navigation.navigate('AddExpense', { groupId })}
          style={styles.addExpenseButton}
        />

        {/* Recent Expenses */}
        <Text style={styles.sectionHeader}>RECENT EXPENSES</Text>
        {expenses?.expenses.map((expense) => (
          <TouchableOpacity
            key={expense.id}
            onPress={() =>
              navigation.navigate('ExpenseDetails', { expenseId: expense.id })
            }
          >
            <Card>
              <View style={styles.expenseRow}>
                <Text style={styles.expenseEmoji}>🍝</Text>
                <View style={styles.expenseInfo}>
                  <Text style={styles.expenseName}>{expense.description}</Text>
                  <Text style={styles.expenseMeta}>
                    {expense.paidBy.name} paid {formatAmount(expense.amount)}
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {expenses?.expenses.length === 0 && (
          <Text style={styles.noExpenses}>No expenses yet</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.caption,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  memberCircle: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  memberName: {
    ...theme.typography.body,
  },
  adminBadge: {
    ...theme.typography.caption,
    color: theme.colors.primary,
  },
  addButton: {
    marginTop: theme.spacing.sm,
  },
  balanceAmount: {
    ...theme.typography.heading3,
    marginBottom: theme.spacing.md,
  },
  balancePositive: {
    color: theme.colors.secondary,
  },
  balanceNegative: {
    color: theme.colors.error,
  },
  viewBalancesButton: {
    marginTop: theme.spacing.sm,
  },
  addExpenseButton: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    ...theme.typography.caption,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseEmoji: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseName: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  expenseMeta: {
    ...theme.typography.caption,
  },
  noExpenses: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingVertical: theme.spacing.xl,
  },
});
