import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation.types';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { AddExpenseScreen } from '../screens/expenses/AddExpenseScreen';
import { ExpenseDetailsScreen } from '../screens/expenses/ExpenseDetailsScreen';
import { BalancesScreen } from '../screens/balances/BalancesScreen';
import { SettleUpScreen } from '../screens/balances/SettleUpScreen';
import { getToken } from '../store/authStore';
import { Loading } from '../components/common/Loading';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await getToken();
    setIsAuthenticated(!!token);
  };

  if (isAuthenticated === null) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen
              name="AddExpense"
              component={AddExpenseScreen}
              options={{ headerShown: true, title: 'Add Expense' }}
            />
            <Stack.Screen
              name="ExpenseDetails"
              component={ExpenseDetailsScreen}
              options={{ headerShown: true, title: 'Expense Details' }}
            />
            <Stack.Screen
              name="Balances"
              component={BalancesScreen}
              options={{ headerShown: true, title: 'Balances' }}
            />
            <Stack.Screen
              name="SettleUp"
              component={SettleUpScreen}
              options={{ headerShown: true, title: 'Settle Up' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
