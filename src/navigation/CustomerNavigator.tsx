import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, shadows } from '../config/theme';

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
          let iconName = 'home-variant';
          if (route.name === 'OrdersTab') iconName = 'shopping-outline';
          else if (route.name === 'ServicesTab') iconName = 'apps';
          else if (route.name === 'ProfileTab') iconName = 'account-outline';
          
          if (focused) {
            iconName = iconName.replace('-outline', '');
            if (iconName === 'home-variant') iconName = 'home-variant';
            if (iconName === 'apps') iconName = 'apps';
          }

          return <MaterialCommunityIcons name={iconName} size={28} color={color} />;
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.dark,
        tabBarInactiveTintColor: colors.grayLight,
        tabBarStyle: {
          height: 80,
          paddingTop: 10,
          borderTopWidth: 0,
          backgroundColor: 'white',
          ...shadows.premium,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
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
        options={{ tabBarLabel: 'My Orders' }} 
      />
      <Tab.Screen 
        name="ServicesTab" 
        component={ServicesScreen} 
        options={{ 
          tabBarLabel: 'Services',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="apps" color={color} size={size} />
          ),
        }} 
      />
      <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} options={{ tabBarLabel: 'Account' }} />
    </Tab.Navigator>
  );
};
