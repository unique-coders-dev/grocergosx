import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../config/theme';

import { HomeStackNavigator } from './HomeStackNavigator';

import { ServicesScreen } from '../screens/customer/services/ServicesScreen';

import { LoyaltyStackNavigator } from './LoyaltyStackNavigator';
import { ProfileStackNavigator } from './ProfileStackNavigator';

import { CustomerOrderListScreen } from '../screens/customer/orders/CustomerOrderListScreen';

const Tab = createBottomTabNavigator();

export const CustomerNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';
          if (route.name === 'OrdersTab') iconName = 'clipboard-text';
          else if (route.name === 'ServicesTab') iconName = 'apps';
          else if (route.name === 'LoyaltyTab') iconName = 'star';
          else if (route.name === 'ProfileTab') iconName = 'account';
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStackNavigator} 
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="OrdersTab" 
        component={CustomerOrderListScreen} 
        options={{ tabBarLabel: 'Orders' }} 
      />
      <Tab.Screen name="ServicesTab" component={ServicesScreen} options={{ tabBarLabel: 'Services' }} />
      <Tab.Screen name="LoyaltyTab" component={LoyaltyStackNavigator} options={{ tabBarLabel: 'Loyalty' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};
