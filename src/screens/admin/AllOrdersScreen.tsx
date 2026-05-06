import React, { useState } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text, Searchbar, SegmentedButtons, Card, IconButton, Badge } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import firestore from '@react-native-firebase/firestore';
import { Order } from '../../types';
import { colors } from '../../config/theme';

export const AllOrdersScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceType, setServiceType] = useState('grocery');

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['admin-orders', serviceType],
    queryFn: async () => {
      const snapshot = await firestore()
        .collection('orders')
        .where('type', '==', serviceType)
        .orderBy('createdAt', 'desc')
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'scheduled':
      case 'booked':
        return '#F59E0B'; // Yellow
      case 'confirmed':
        return '#3B82F6'; // Blue
      case 'delivered':
      case 'completed':
        return '#22C55E'; // Green
      case 'cancelled':
        return '#EF4444'; // Red
      default:
        return '#8B5CF6'; // Purple
    }
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <Card 
      style={styles.card} 
      onPress={() => navigation.navigate('OrderDetailAdmin', { orderId: order.id })}
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <View>
            <Text variant="titleMedium">#{order.id.substring(0, 8).toUpperCase()}</Text>
            <Text variant="bodySmall" style={styles.date}>
              {new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
              {order.status.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <IconButton icon="account" size={16} style={styles.icon} />
            <Text variant="bodyMedium">Customer ID: {order.customerId.substring(0, 10)}...</Text>
          </View>
          <View style={styles.infoRow}>
            <IconButton icon="map-marker" size={16} style={styles.icon} />
            <Text variant="bodyMedium" numberOfLines={1}>
              {order.type === 'grocery' ? order.deliveryAddress : 
               order.type === 'laundry' ? order.pickupAddress : 
               order.recipientAddress}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text variant="titleMedium" style={styles.amount}>${order.totalAmount.toFixed(2)}</Text>
          <IconButton icon="chevron-right" size={20} />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search by order ID..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          elevation={0}
        />
        <SegmentedButtons
          value={serviceType}
          onValueChange={setServiceType}
          buttons={[
            { value: 'grocery', label: 'Grocery' },
            { value: 'laundry', label: 'Laundry' },
            { value: 'parcel', label: 'Parcel' },
          ]}
          style={styles.segmented}
        />
      </View>

      <FlatList
        data={orders?.filter(o => o.id.toLowerCase().includes(searchQuery.toLowerCase()))}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <OrderCard order={item} />}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text>No orders found for this service.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 16,
  },
  segmented: {
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  date: {
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardBody: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -8,
  },
  icon: {
    margin: 0,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  amount: {
    fontWeight: '700',
    color: colors.primary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
  },
});
