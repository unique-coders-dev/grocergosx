import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/customer/home/HomeScreen';
import { GroceryHomeScreen } from '../screens/customer/grocery/GroceryHomeScreen';
import { ProductDetailScreen } from '../screens/customer/grocery/ProductDetailScreen';
import { CartScreen } from '../screens/customer/grocery/CartScreen';
import { CheckoutScreen } from '../screens/customer/grocery/CheckoutScreen';
import { OrderConfirmationScreen } from '../screens/customer/grocery/OrderConfirmationScreen';
import { LaundryHomeScreen } from '../screens/customer/laundry/LaundryHomeScreen';
import { LaundryScheduleScreen } from '../screens/customer/laundry/LaundryScheduleScreen';
import { ParcelHomeScreen } from '../screens/customer/parcel/ParcelHomeScreen';
import { ParcelBookingScreen } from '../screens/customer/parcel/ParcelBookingScreen';
import { RideHomeScreen } from '../screens/customer/ride/RideHomeScreen';
import { RideBookingScreen } from '../screens/customer/ride/RideBookingScreen';
import { RiderDashboardScreen } from '../screens/customer/ride/RiderDashboardScreen';
import { PreArrivalStockingScreen } from '../screens/customer/services/PreArrivalStockingScreen';
import { NotificationScreen } from '../screens/customer/notifications/NotificationScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';

const Stack = createStackNavigator();

export const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="GroceryHome" component={GroceryHomeScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
      <Stack.Screen name="LaundryHome" component={LaundryHomeScreen} />
      <Stack.Screen name="LaundrySchedule" component={LaundryScheduleScreen} />
      <Stack.Screen name="ParcelHome" component={ParcelHomeScreen} />
      <Stack.Screen name="ParcelBooking" component={ParcelBookingScreen} />
      <Stack.Screen name="RideHome" component={RideHomeScreen} />
      <Stack.Screen name="RideBooking" component={RideBookingScreen} />
      <Stack.Screen name="RiderDashboard" component={RiderDashboardScreen} />
      <Stack.Screen name="PreArrival" component={PreArrivalStockingScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
    </Stack.Navigator>
  );
};
