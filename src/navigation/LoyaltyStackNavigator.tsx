import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoyaltyScreen } from '../screens/customer/loyalty/LoyaltyScreen';
import { ReferFriendsScreen } from '../screens/customer/loyalty/ReferFriendsScreen';

const Stack = createStackNavigator();

export const LoyaltyStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoyaltyMain" component={LoyaltyScreen} />
      <Stack.Screen name="ReferFriends" component={ReferFriendsScreen} />
    </Stack.Navigator>
  );
};
