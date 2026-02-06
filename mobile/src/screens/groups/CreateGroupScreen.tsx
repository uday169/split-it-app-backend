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
import { GroupStackParamList } from '../../types/navigation.types';
import { createGroupSchema } from '../../schemas/validation.schemas';
import { useCreateGroup } from '../../hooks/useGroups';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { theme } from '../../theme/theme';

type Props = NativeStackScreenProps<GroupStackParamList, 'CreateGroup'>;

interface CreateGroupForm {
  name: string;
  description?: string;
}

export const CreateGroupScreen: React.FC<Props> = ({ navigation }) => {
  const createGroup = useCreateGroup();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGroupForm>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: CreateGroupForm) => {
    try {
      const group = await createGroup.mutateAsync(data);
      Alert.alert('Success', 'Group created successfully');
      navigation.goBack();
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to create group';
      Alert.alert('Error', message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Create Group</Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Group Name"
              placeholder="Bali Trip 2026"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Description (optional)"
              placeholder="Our vacation expenses"
              value={value}
              onChangeText={onChange}
              error={errors.description?.message}
              multiline
              numberOfLines={3}
              style={styles.textArea}
            />
          )}
        />

        <Button
          title="Create Group"
          onPress={handleSubmit(onSubmit)}
          loading={createGroup.isPending}
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
    marginBottom: theme.spacing.lg,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: theme.spacing.md,
  },
});
