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
import { AuthStackParamList } from '../../types/navigation.types';
import { loginSchema } from '../../schemas/validation.schemas';
import { useSendOtp } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { theme } from '../../theme/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

interface LoginForm {
  email: string;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const sendOtp = useSendOtp();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await sendOtp.mutateAsync(data);
      navigation.navigate('Otp', { email: data.email });
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to send OTP';
      Alert.alert('Error', message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>💸</Text>
        <Text style={styles.title}>Split It</Text>
        <Text style={styles.subtitle}>Share expenses easily</Text>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Email"
                placeholder="john@example.com"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            )}
          />

          <Button
            title="Send OTP"
            onPress={handleSubmit(onSubmit)}
            loading={sendOtp.isPending}
          />
        </View>

        <Text style={styles.terms}>
          By continuing, you agree to our{'\n'}Terms & Privacy Policy
        </Text>
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
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  logo: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.heading1,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xxl,
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  terms: {
    ...theme.typography.caption,
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
});
