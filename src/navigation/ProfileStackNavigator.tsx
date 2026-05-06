import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileScreen } from '../screens/customer/profile/ProfileScreen';
import { SupportScreen } from '../screens/customer/profile/SupportScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';

const Stack = createStackNavigator();

export const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="EditProfile" component={() => <PlaceholderScreen name="Edit Profile" />} />
      <Stack.Screen name="AddressBook" component={() => <PlaceholderScreen name="Address Book" />} />
      <Stack.Screen name="PaymentMethods" component={() => <PlaceholderScreen name="Payment Methods" />} />
      <Stack.Screen name="NotificationSettings" component={() => <PlaceholderScreen name="Notification Settings" />} />
      <Stack.Screen name="Events" component={() => <PlaceholderScreen name="Local Events" />} />
      <Stack.Screen name="About" component={() => <PlaceholderScreen name="About GrocerGo" />} />
    </Stack.Navigator>
  );
};
