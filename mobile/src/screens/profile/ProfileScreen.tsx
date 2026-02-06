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
import { ProfileStackParamList } from '../../types/navigation.types';
import { useProfile } from '../../hooks/useUser';
import { useLogout } from '../../hooks/useAuth';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Loading } from '../../components/common/Loading';
import { theme } from '../../theme/theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { data: user, isLoading } = useProfile();
  const logout = useLogout();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout.mutateAsync();
        },
      },
    ]);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* User Info */}
        <View style={styles.header}>
          <Text style={styles.avatar}>👤</Text>
          <Text style={styles.name}>{user.name || 'User'}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <Button
          title="✏ Edit Profile"
          variant="outline"
          onPress={() => navigation.navigate('EditProfile')}
          style={styles.editButton}
        />

        {/* Account Section */}
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <Card>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>👤</Text>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Name</Text>
              <Text style={styles.menuValue}>{user.name || 'Not set'}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>✉</Text>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Email</Text>
              <Text style={styles.menuValue}>{user.email}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </Card>

        {/* About Section */}
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <Card>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>ℹ</Text>
            <Text style={styles.menuLabel}>About Split It</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>📜</Text>
            <Text style={styles.menuLabel}>Terms of Service</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>🔒</Text>
            <Text style={styles.menuLabel}>Privacy Policy</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </Card>

        {/* Logout Button */}
        <Button
          title="🚪 Log Out"
          variant="outline"
          onPress={handleLogout}
          style={styles.logoutButton}
        />

        <Text style={styles.version}>Version 1.0.0 (Build 1)</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  name: {
    ...theme.typography.heading2,
    marginBottom: theme.spacing.xs,
  },
  email: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  editButton: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.caption,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: theme.spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    ...theme.typography.body,
  },
  menuValue: {
    ...theme.typography.caption,
    marginTop: theme.spacing.xs,
  },
  chevron: {
    fontSize: 24,
    color: theme.colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  logoutButton: {
    marginTop: theme.spacing.xl,
    borderColor: theme.colors.error,
  },
  version: {
    ...theme.typography.caption,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
});
