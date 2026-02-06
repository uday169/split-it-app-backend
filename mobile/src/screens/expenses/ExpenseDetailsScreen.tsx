import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation.types';
import { useExpense } from '../../hooks/useExpenses';
import { Card } from '../../components/common/Card';
import { Loading } from '../../components/common/Loading';
import { theme } from '../../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ExpenseDetails'>;

export const ExpenseDetailsScreen: React.FC<Props> = ({ route }) => {
  const { expenseId } = route.params;
  const { data: expense, isLoading } = useExpense(expenseId);

  if (isLoading) {
    return <Loading />;
  }

  if (!expense) {
    return (
      <View style={styles.container}>
        <Text>Expense not found</Text>
      </View>
    );
  }

  const formatAmount = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.title}>{expense.description}</Text>
          <Text style={styles.amount}>{formatAmount(expense.amount)}</Text>
          <Text style={styles.meta}>
            Paid by {expense.paidBy.name} on {formatDate(expense.date)}
          </Text>
        </Card>

        <Text style={styles.sectionTitle}>SPLIT DETAILS</Text>
        <Card>
          {expense.splits.map((split) => (
            <View key={split.userId} style={styles.splitRow}>
              <Text style={styles.splitName}>{split.userName}</Text>
              <Text style={styles.splitAmount}>
                {formatAmount(split.amount)}
              </Text>
            </View>
          ))}
        </Card>
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
    padding: theme.spacing.lg,
  },
  title: {
    ...theme.typography.heading2,
    marginBottom: theme.spacing.sm,
  },
  amount: {
    ...theme.typography.heading1,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  meta: {
    ...theme.typography.caption,
  },
  sectionTitle: {
    ...theme.typography.caption,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  splitName: {
    ...theme.typography.body,
  },
  splitAmount: {
    ...theme.typography.body,
    fontWeight: '600',
  },
});
