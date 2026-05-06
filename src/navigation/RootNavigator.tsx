import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthNavigator } from './AuthNavigator';
import { CustomerNavigator } from './CustomerNavigator';
import { AdminNavigator } from './AdminNavigator';
import { useAuthStore } from '../store/authStore';
import { useAuth } from '../hooks/useAuth';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';

const Stack = createStackNavigator();

export const RootNavigator = () => {
  const { user, loading } = useAuthStore();
  useAuth();

  if (loading) {
    return <PlaceholderScreen name="GrocerGo SXM" />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : user.role === 'admin' ? (
          <Stack.Screen name="Admin" component={AdminNavigator} />
        ) : (
          <Stack.Screen name="Customer" component={CustomerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
