import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation.types';
import { settlementSchema } from '../../schemas/validation.schemas';
import { useCreateSettlement } from '../../hooks/useSettlements';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { theme } from '../../theme/theme';
import { getUser } from '../../store/authStore';

type Props = NativeStackScreenProps<RootStackParamList, 'SettleUp'>;

interface SettlementForm {
  amount: string;
  notes?: string;
}

export const SettleUpScreen: React.FC<Props> = ({ route, navigation }) => {
  const { groupId, userId, userName, amount } = route.params;
  const createSettlement = useCreateSettlement();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SettlementForm>({
    resolver: zodResolver(settlementSchema),
    defaultValues: {
      amount: (amount / 100).toFixed(2),
      notes: '',
    },
  });

  const onSubmit = async (data: SettlementForm) => {
    try {
      const amountInCents = Math.round(parseFloat(data.amount) * 100);

      if (amountInCents > amount) {
        Alert.alert('Error', 'Amount cannot exceed what you owe');
        return;
      }

      await createSettlement.mutateAsync({
        groupId,
        paidTo: userId,
        amount: amountInCents,
        currency: 'USD',
        notes: data.notes,
      });

      Alert.alert('Success', 'Payment recorded successfully');
      navigation.goBack();
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to record payment';
      Alert.alert('Error', message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Settle Up</Text>
        <Text style={styles.subtitle}>You are settling with:</Text>
        <Text style={styles.userName}>{userName}</Text>

        <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Amount"
              placeholder="0.00"
              value={value}
              onChangeText={onChange}
              error={errors.amount?.message}
              keyboardType="decimal-pad"
            />
          )}
        />

        <Text style={styles.hint}>
          You owe: ${(amount / 100).toFixed(2)}
        </Text>

        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Notes (optional)"
              placeholder="Paid via Venmo"
              value={value}
              onChangeText={onChange}
              error={errors.notes?.message}
            />
          )}
        />

        <View style={styles.warning}>
          <Text style={styles.warningText}>
            ⚠ {userName} will need to confirm this settlement
          </Text>
        </View>

        <Button
          title="Record Payment"
          onPress={handleSubmit(onSubmit)}
          loading={createSettlement.isPending}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  title: {
    ...theme.typography.heading2,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  userName: {
    ...theme.typography.heading3,
    marginBottom: theme.spacing.lg,
  },
  hint: {
    ...theme.typography.caption,
    marginBottom: theme.spacing.lg,
  },
  warning: {
    backgroundColor: theme.colors.warning + '20',
    padding: theme.spacing.md,
    borderRadius: 8,
    marginBottom: theme.spacing.lg,
  },
  warningText: {
    ...theme.typography.caption,
    color: theme.colors.warning,
  },
});
