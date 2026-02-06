import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Card } from '../../components/common/Card';
import { theme } from '../../theme/theme';
import { useActivity } from '../../hooks/useActivity';
import { ActivityItem } from '../../api/activity.api';
import { formatAmount } from '../../utils/currency';
import { formatDistanceToNow } from 'date-fns';

export const ActivityScreen: React.FC = () => {
  const [page] = useState(1);
  const { data, isLoading, refetch, isRefetching } = useActivity(page, 20);

  const renderActivityItem = ({ item }: { item: ActivityItem }) => {
    const isExpense = item.type === 'expense';
    const timeAgo = formatDistanceToNow(new Date(item.createdAt), { addSuffix: true });

    return (
      <Card style={styles.activityCard}>
        <View style={styles.activityHeader}>
          <Text style={styles.groupName}>{item.groupName}</Text>
          <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>
        
        <View style={styles.activityBody}>
          <Text style={styles.activityIcon}>
            {isExpense ? '💵' : '💰'}
          </Text>
          
          <View style={styles.activityDetails}>
            <Text style={styles.description}>{item.description}</Text>
            
            {isExpense && item.paidBy ? (
              <Text style={styles.subtext}>
                {item.paidBy.name} paid {formatAmount(item.amount, item.currency)}
              </Text>
            ) : item.paidBy && item.paidTo ? (
              <Text style={styles.subtext}>
                {item.paidBy.name} paid {item.paidTo.name}
              </Text>
            ) : null}
          </View>
          
          <View style={styles.amountContainer}>
            <Text style={styles.amount}>
              {formatAmount(item.amount, item.currency)}
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>📋</Text>
      <Text style={styles.emptyTitle}>No activity yet</Text>
      <Text style={styles.emptyText}>
        Your recent expenses and settlements{'\n'}will appear here
      </Text>
    </View>
  );

  const renderLoader = () => (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Activity</Text>
        </View>
        {renderLoader()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
      </View>

      <FlatList
        data={data?.activities || []}
        renderItem={renderActivityItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    ...theme.typography.heading2,
  },
  list: {
    padding: theme.spacing.md,
  },
  activityCard: {
    marginBottom: theme.spacing.md,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  groupName: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  timeAgo: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  activityBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    fontSize: 32,
    marginRight: theme.spacing.sm,
  },
  activityDetails: {
    flex: 1,
  },
  description: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtext: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  amountContainer: {
    marginLeft: theme.spacing.sm,
  },
  amount: {
    ...theme.typography.heading3,
    color: theme.colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    ...theme.typography.heading2,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
