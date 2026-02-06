import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation.types';
import { createExpenseSchema } from '../../schemas/validation.schemas';
import { useCreateExpense } from '../../hooks/useExpenses';
import { useGroup } from '../../hooks/useGroups';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { theme } from '../../theme/theme';
import { getUser } from '../../store/authStore';

type Props = NativeStackScreenProps<RootStackParamList, 'AddExpense'>;

interface AddExpenseForm {
  description: string;
  amount: string;
  paidBy: string;
  date: Date;
  splitType: 'equal' | 'manual';
}

export const AddExpenseScreen: React.FC<Props> = ({ route, navigation }) => {
  const { groupId } = route.params;
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string>('');

  const createExpense = useCreateExpense();
  const { data: group } = useGroup(groupId);

  React.useEffect(() => {
    const loadUser = async () => {
      const user = await getUser();
      if (user) {
        setCurrentUserId(user.id);
        // Pre-select all members
        if (group?.members) {
          setSelectedMembers(new Set(group.members.map((m) => m.userId)));
        }
      }
    };
    loadUser();
  }, [group]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddExpenseForm>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      description: '',
      amount: '',
      paidBy: currentUserId,
      date: new Date(),
      splitType: 'equal',
    },
  });

  const toggleMember = (userId: string) => {
    const newSelection = new Set(selectedMembers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedMembers(newSelection);
  };

  const onSubmit = async (data: AddExpenseForm) => {
    if (selectedMembers.size === 0) {
      Alert.alert('Error', 'Please select at least one member');
      return;
    }

    try {
      const amountInCents = Math.round(parseFloat(data.amount) * 100);
      const splitAmount = Math.round(amountInCents / selectedMembers.size);

      const splitDetails = Array.from(selectedMembers).map((userId) => ({
        userId,
        amount: splitAmount,
      }));

      await createExpense.mutateAsync({
        groupId,
        description: data.description,
        amount: amountInCents,
        currency: 'USD',
        paidBy: data.paidBy || currentUserId,
        splitType: 'equal',
        splitDetails,
      });

      Alert.alert('Success', 'Expense added successfully');
      navigation.goBack();
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to add expense';
      Alert.alert('Error', message);
    }
  };

  if (!group) return null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Description"
              placeholder="Dinner at Italian Restaurant"
              value={value}
              onChangeText={onChange}
              error={errors.description?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Amount"
              placeholder="80.00"
              value={value}
              onChangeText={onChange}
              error={errors.amount?.message}
              keyboardType="decimal-pad"
            />
          )}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paid by</Text>
          <Card>
            {group.members.map((member) => (
              <TouchableOpacity
                key={member.userId}
                style={styles.radioRow}
                onPress={() =>
                  control._formValues.paidBy = member.userId
                }
              >
                <Text style={styles.radioCircle}>
                  {watch('paidBy') === member.userId ? '◉' : '○'}
                </Text>
                <Text style={styles.radioLabel}>
                  {member.name || member.email}
                  {member.userId === currentUserId && ' (You)'}
                </Text>
              </TouchableOpacity>
            ))}
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Split with</Text>
          <Card>
            {group.members.map((member) => (
              <TouchableOpacity
                key={member.userId}
                style={styles.checkboxRow}
                onPress={() => toggleMember(member.userId)}
              >
                <Text style={styles.checkbox}>
                  {selectedMembers.has(member.userId) ? '☑' : '☐'}
                </Text>
                <Text style={styles.checkboxLabel}>
                  {member.name || member.email}
                  {member.userId === currentUserId && ' (You)'}
                </Text>
              </TouchableOpacity>
            ))}
          </Card>
        </View>

        <Button
          title="Save Expense"
          onPress={handleSubmit(onSubmit)}
          loading={createExpense.isPending}
        />
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
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  radioCircle: {
    fontSize: 20,
    marginRight: theme.spacing.md,
    color: theme.colors.primary,
  },
  radioLabel: {
    ...theme.typography.body,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  checkbox: {
    fontSize: 20,
    marginRight: theme.spacing.md,
    color: theme.colors.primary,
  },
  checkboxLabel: {
    ...theme.typography.body,
  },
});
