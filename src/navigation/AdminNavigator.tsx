import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { AdminDashboardScreen } from '../screens/admin/DashboardScreen';
import { AllOrdersScreen } from '../screens/admin/AllOrdersScreen';
import { OrderDetailAdminScreen } from '../screens/admin/OrderDetailAdminScreen';
import { ProductListScreen } from '../screens/admin/ProductListScreen';
import { AddEditProductScreen } from '../screens/admin/AddEditProductScreen';
import { CustomerListScreen } from '../screens/admin/CustomerListScreen';
import { CustomerDetailAdminScreen } from '../screens/admin/CustomerDetailAdminScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';
import { colors } from '../config/theme';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const OrderStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AllOrders" component={AllOrdersScreen} />
    <Stack.Screen name="OrderDetailAdmin" component={OrderDetailAdminScreen} />
  </Stack.Navigator>
);

const ProductStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProductList" component={ProductListScreen} />
    <Stack.Screen name="AddProduct" component={AddEditProductScreen} />
    <Stack.Screen name="EditProduct" component={AddEditProductScreen} />
  </Stack.Navigator>
);

const CustomerStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CustomerList" component={CustomerListScreen} />
    <Stack.Screen name="CustomerDetail" component={CustomerDetailAdminScreen} />
    <Stack.Screen name="OrderDetailAdmin" component={OrderDetailAdminScreen} />
  </Stack.Navigator>
);

export const AdminNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: colors.primary,
        headerTintColor: colors.primary,
      }}
    >
      <Drawer.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Drawer.Screen name="Orders" component={OrderStack} />
      <Drawer.Screen name="Products" component={ProductStack} />
      <Drawer.Screen name="Customers" component={CustomerStack} />
      <Drawer.Screen name="Settings" component={() => <PlaceholderScreen name="Admin Settings" />} />
    </Drawer.Navigator>
  );
};
