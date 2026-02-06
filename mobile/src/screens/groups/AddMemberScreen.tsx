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
import { addMemberSchema } from '../../schemas/validation.schemas';
import { useAddMember } from '../../hooks/useMembers';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { theme } from '../../theme/theme';

type Props = NativeStackScreenProps<GroupStackParamList, 'AddMember'>;

interface AddMemberForm {
  email: string;
}

export const AddMemberScreen: React.FC<Props> = ({ route, navigation }) => {
  const { groupId } = route.params;
  const addMember = useAddMember();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddMemberForm>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: AddMemberForm) => {
    try {
      await addMember.mutateAsync({ groupId, data });
      Alert.alert('Success', 'Member added successfully');
      navigation.goBack();
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to add member';
      Alert.alert('Error', message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Add Member</Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Email Address"
              placeholder="jane@example.com"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          )}
        />

        <Text style={styles.hint}>An invite email will be sent</Text>

        <Button
          title="Add Member"
          onPress={handleSubmit(onSubmit)}
          loading={addMember.isPending}
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
  hint: {
    ...theme.typography.caption,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
});
