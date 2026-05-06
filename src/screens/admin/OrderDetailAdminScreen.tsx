import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Text, Card, Button, Divider, List, IconButton, Menu } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import firestore from '@react-native-firebase/firestore';
import { Order } from '../../types';
import { colors } from '../../config/theme';

export const OrderDetailAdminScreen = ({ route, navigation }: any) => {
  const { orderId } = route.params;
  const [menuVisible, setMenuVisible] = useState(false);
  const [updating, setUpdating] = useState(false);

  const { data: order, isLoading, refetch } = useQuery({
    queryKey: ['admin-order-detail', orderId],
    queryFn: async () => {
      const doc = await firestore().collection('orders').doc(orderId).get();
      return { id: doc.id, ...doc.data() } as Order;
    },
  });

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      await firestore().collection('orders').doc(orderId).update({
        status: newStatus,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      
      // In a real app, trigger FCM here via Cloud Function or API
      
      Alert.alert('Success', `Order status updated to ${newStatus}`);
      refetch();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setUpdating(false);
      setMenuVisible(false);
    }
  };

  const getStatusList = () => {
    if (order?.type === 'grocery') return ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    if (order?.type === 'laundry') return ['scheduled', 'picked_up', 'in_cleaning', 'out_for_delivery', 'delivered', 'cancelled'];
    return ['booked', 'confirmed', 'picked_up', 'in_transit', 'delivered', 'cancelled'];
  };

  if (isLoading || !order) {
    return <View style={styles.center}><Text>Loading...</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="chevron-left" onPress={() => navigation.goBack()} />
        <Text variant="titleLarge">Order Details</Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button 
              mode="contained" 
              onPress={() => setMenuVisible(true)}
              loading={updating}
              style={styles.statusButton}
            >
              Update Status
            </Button>
          }
        >
          {getStatusList().map((status) => (
            <Menu.Item 
              key={status} 
              onPress={() => updateStatus(status)} 
              title={status.toUpperCase()} 
            />
          ))}
        </Menu>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.row}>
              <Text variant="titleMedium">Status</Text>
              <Text variant="titleMedium" style={{ color: colors.primary }}>
                {order.status.toUpperCase()}
              </Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.row}>
              <Text variant="bodyMedium">Order ID</Text>
              <Text variant="bodyMedium">#{order.id}</Text>
            </View>
            <View style={styles.row}>
              <Text variant="bodyMedium">Customer ID</Text>
              <Text variant="bodyMedium">{order.customerId}</Text>
            </View>
            <View style={styles.row}>
              <Text variant="bodyMedium">Placed On</Text>
              <Text variant="bodyMedium">
                {new Date(order.createdAt?.seconds * 1000).toLocaleString()}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Text variant="titleMedium" style={styles.sectionTitle}>Delivery Info</Text>
        <Card style={styles.sectionCard}>
          <Card.Content>
            <List.Item
              title={order.type === 'grocery' ? "Delivery Address" : order.type === 'laundry' ? "Pickup Address" : "Destination"}
              description={order.type === 'grocery' ? order.deliveryAddress : order.type === 'laundry' ? order.pickupAddress : order.recipientAddress}
              left={props => <List.Icon {...props} icon="map-marker" />}
            />
            <List.Item
              title={order.type === 'laundry' ? "Pickup Time" : "Scheduled Slot"}
              description={order.type === 'grocery' ? order.scheduledTime : order.pickupTime}
              left={props => <List.Icon {...props} icon="clock" />}
            />
          </Card.Content>
        </Card>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          {order.type === 'grocery' ? 'Order Items' : 'Service Details'}
        </Text>
        <Card style={styles.sectionCard}>
          <Card.Content>
            {order.type === 'grocery' ? (
              order.items?.map((item: any, index: number) => (
                <View key={index}>
                  <View style={styles.row}>
                    <Text variant="bodyLarge">{item.name} x {item.quantity}</Text>
                    <Text variant="bodyLarge">${(item.price * item.quantity).toFixed(2)}</Text>
                  </View>
                  <Divider style={styles.itemDivider} />
                </View>
              ))
            ) : order.type === 'laundry' ? (
              <View>
                <View style={styles.row}>
                  <Text variant="bodyLarge">Estimated Weight</Text>
                  <Text variant="bodyLarge">{order.estimatedWeight} lbs</Text>
                </View>
                <Divider style={styles.itemDivider} />
              </View>
            ) : (
              <View>
                <View style={styles.row}>
                  <Text variant="bodyLarge">Parcel Size</Text>
                  <Text variant="bodyLarge">{order.parcelSize}</Text>
                </View>
                <Divider style={styles.itemDivider} />
              </View>
            )}
            
            {order.notes && (
              <View style={{ marginTop: 10, marginBottom: 15 }}>
                <Text variant="labelMedium">Special Instructions:</Text>
                <Text variant="bodySmall" style={{ color: colors.textSecondary }}>{order.notes}</Text>
              </View>
            )}

            <View style={[styles.row, { marginTop: 10 }]}>
              <Text variant="titleLarge">Total Amount</Text>
              <Text variant="titleLarge" style={styles.total}>${order.totalAmount.toFixed(2)}</Text>
            </View>
          </Card.Content>
        </Card>

        <Button 
          mode="outlined" 
          onPress={() => Alert.alert('Contact Customer', 'Calling +590...')}
          style={styles.contactButton}
          icon="phone"
        >
          Contact Customer
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  scrollContent: {
    padding: 16,
  },
  sectionCard: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  divider: {
    marginVertical: 12,
  },
  itemDivider: {
    marginVertical: 8,
    backgroundColor: '#EEE',
  },
  total: {
    color: colors.primary,
    fontWeight: '700',
  },
  statusButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  contactButton: {
    marginTop: 10,
    marginBottom: 30,
    borderColor: colors.primary,
  },
});
