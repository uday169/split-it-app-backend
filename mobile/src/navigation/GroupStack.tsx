import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GroupStackParamList } from '../types/navigation.types';
import { GroupsListScreen } from '../screens/groups/GroupsListScreen';
import { GroupDetailsScreen } from '../screens/groups/GroupDetailsScreen';
import { CreateGroupScreen } from '../screens/groups/CreateGroupScreen';
import { AddMemberScreen } from '../screens/groups/AddMemberScreen';

const Stack = createNativeStackNavigator<GroupStackParamList>();

export const GroupStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="GroupsList"
        component={GroupsListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GroupDetails"
        component={GroupDetailsScreen as any}
        options={{ title: 'Group Details' }}
      />
      <Stack.Screen
        name="CreateGroup"
        component={CreateGroupScreen}
        options={{ title: 'Create Group', presentation: 'modal' }}
      />
      <Stack.Screen
        name="AddMember"
        component={AddMemberScreen}
        options={{ title: 'Add Member', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
};
