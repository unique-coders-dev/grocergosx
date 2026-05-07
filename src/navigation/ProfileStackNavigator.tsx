import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileScreen } from '../screens/customer/profile/ProfileScreen';
import { SupportScreen } from '../screens/customer/profile/SupportScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';

const Stack = createStackNavigator();

// Define wrapper components outside to avoid re-render performance warnings
const EditProfileScreen = () => <PlaceholderScreen name="Edit Profile" />;
const AddressBookScreen = () => <PlaceholderScreen name="Address Book" />;
const PaymentMethodsScreen = () => <PlaceholderScreen name="Payment Methods" />;
const NotificationSettingsScreen = () => <PlaceholderScreen name="Notification Settings" />;
const EventsScreen = () => <PlaceholderScreen name="Local Events" />;
const AboutScreen = () => <PlaceholderScreen name="About GrocerGo" />;

export const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="AddressBook" component={AddressBookScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="Events" component={EventsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
};
