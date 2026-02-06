import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation.types';
import { useBalances, useUserBalance } from '../../hooks/useBalances';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Loading } from '../../components/common/Loading';
import { theme } from '../../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Balances'>;

export const BalancesScreen: React.FC<Props> = ({ route, navigation }) => {
  const { groupId } = route.params;
  const { data: balances, isLoading: balancesLoading } = useBalances(groupId);
  const { data: userBalance, isLoading: userBalanceLoading } = useUserBalance(groupId);

  if (balancesLoading || userBalanceLoading) {
    return <Loading />;
  }

  const formatAmount = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Group Summary */}
        <Card>
          <Text style={styles.sectionTitle}>GROUP SUMMARY</Text>
          <Text style={styles.summaryText}>
            Total unsettled: {formatAmount(balances?.totalOwed || 0)}
          </Text>
          <Text style={styles.summaryText}>
            Status: {balances?.isBalanced ? 'All settled' : 'Has balances'}
          </Text>
        </Card>

        {/* User Balance */}
        {userBalance && (
          <Card>
            <Text style={styles.sectionTitle}>YOUR BALANCE</Text>
            <Text
              style={[
                styles.userBalance,
                userBalance.netBalance > 0 && styles.balancePositive,
                userBalance.netBalance < 0 && styles.balanceNegative,
              ]}
            >
              {userBalance.netBalance === 0
                ? 'All settled up'
                : userBalance.netBalance > 0
                ? `You're owed: ${formatAmount(userBalance.netBalance)}`
                : `You owe: ${formatAmount(Math.abs(userBalance.netBalance))}`}
            </Text>

            {userBalance.owes.map((debt) => (
              <View key={debt.userId} style={styles.balanceRow}>
                <View style={styles.balanceInfo}>
                  <Text style={styles.balanceName}>You owe {debt.userName}</Text>
                  <Text style={styles.balanceAmount}>
                    {formatAmount(debt.amount)}
                  </Text>
                </View>
                <Button
                  title="Settle Up"
                  variant="secondary"
                  onPress={() =>
                    navigation.navigate('SettleUp', {
                      groupId,
                      userId: debt.userId,
                      userName: debt.userName,
                      amount: debt.amount,
                    })
                  }
                />
              </View>
            ))}

            {userBalance.owedBy.map((credit) => (
              <View key={credit.userId} style={styles.balanceRow}>
                <View style={styles.balanceInfo}>
                  <Text style={styles.balanceName}>
                    {credit.userName} owes you
                  </Text>
                  <Text style={[styles.balanceAmount, styles.balancePositive]}>
                    {formatAmount(credit.amount)}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        )}

        {/* All Balances */}
        <Text style={styles.sectionHeader}>ALL BALANCES</Text>
        {balances?.balances.map((balance) => (
          <Card key={balance.userId}>
            <Text style={styles.memberName}>{balance.userName}</Text>
            <Text
              style={[
                styles.memberBalance,
                balance.netBalance > 0 && styles.balancePositive,
                balance.netBalance < 0 && styles.balanceNegative,
              ]}
            >
              Balance: {formatAmount(balance.netBalance)}
            </Text>

            {balance.owes.map((debt) => (
              <Text key={debt.userId} style={styles.debtText}>
                ↳ Owes {debt.userName} {formatAmount(debt.amount)}
              </Text>
            ))}

            {balance.owedBy.map((credit) => (
              <Text key={credit.userId} style={styles.creditText}>
                ↳ {credit.userName} owes {formatAmount(credit.amount)}
              </Text>
            ))}
          </Card>
        ))}
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
  sectionTitle: {
    ...theme.typography.caption,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  sectionHeader: {
    ...theme.typography.caption,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  summaryText: {
    ...theme.typography.body,
    marginBottom: theme.spacing.xs,
  },
  userBalance: {
    ...theme.typography.heading3,
    marginBottom: theme.spacing.md,
  },
  balancePositive: {
    color: theme.colors.secondary,
  },
  balanceNegative: {
    color: theme.colors.error,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceName: {
    ...theme.typography.body,
    marginBottom: theme.spacing.xs,
  },
  balanceAmount: {
    ...theme.typography.heading3,
  },
  memberName: {
    ...theme.typography.heading3,
    marginBottom: theme.spacing.xs,
  },
  memberBalance: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  debtText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginBottom: theme.spacing.xs,
  },
  creditText: {
    ...theme.typography.caption,
    color: theme.colors.secondary,
    marginBottom: theme.spacing.xs,
  },
});
