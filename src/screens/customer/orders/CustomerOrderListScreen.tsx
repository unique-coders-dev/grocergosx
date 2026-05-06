import React, { useState } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text, SegmentedButtons, Card, IconButton, ActivityIndicator, Button } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Order } from '../../../types';
import { colors } from '../../../config/theme';

export const CustomerOrderListScreen = ({ navigation }: any) => {
  const [filter, setFilter] = useState('active');
  const userUid = auth().currentUser?.uid;

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['customer-orders', filter, userUid],
    queryFn: async () => {
      let query = firestore().collection('orders').where('customerId', '==', userUid);
      
      if (filter === 'active') {
        query = query.where('status', 'not-in', ['delivered', 'completed', 'cancelled']);
      } else {
        query = query.where('status', 'in', ['delivered', 'completed', 'cancelled']);
      }

      const snapshot = await query.orderBy('status').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    },
  });

  const getStatusInfo = (status: string) => {
    const s = status.toLowerCase();
    if (['pending', 'scheduled', 'booked'].includes(s)) return { color: '#F59E0B', icon: 'clock-outline' };
    if (['confirmed', 'preparing', 'in_cleaning', 'picked_up'].includes(s)) return { color: '#3B82F6', icon: 'sync' };
    if (['out_for_delivery', 'in_transit'].includes(s)) return { color: '#8B5CF6', icon: 'truck-delivery' };
    if (['delivered', 'completed'].includes(s)) return { color: '#22C55E', icon: 'check-circle' };
    return { color: '#EF4444', icon: 'close-circle' };
  };

  const OrderCard = ({ order }: { order: Order }) => {
    const { color, icon } = getStatusInfo(order.status);
    return (
      <Card style={styles.card} onPress={() => {}}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
              <IconButton icon={icon} iconColor={color} size={24} />
            </View>
            <View style={styles.headerText}>
              <Text variant="titleMedium">{order.type.toUpperCase()}</Text>
              <Text variant="bodySmall" style={styles.orderId}>Order #{order.id.substring(0, 8).toUpperCase()}</Text>
            </View>
            <View style={styles.priceColumn}>
              <Text variant="titleMedium" style={styles.amount}>${order.totalAmount.toFixed(2)}</Text>
              <Text variant="bodySmall" style={[styles.status, { color }]}>{order.status.toUpperCase()}</Text>
            </View>
          </View>
          
          <View style={styles.cardFooter}>
            <Text variant="bodySmall" style={styles.date}>
              {new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Support')}>
              <Text style={styles.helpLink}>Need help?</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>My Orders</Text>
        <SegmentedButtons
          value={filter}
          onValueChange={setFilter}
          buttons={[
            { value: 'active', label: 'Active' },
            { value: 'past', label: 'Past Orders' },
          ]}
          style={styles.segmented}
        />
      </View>

      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <OrderCard order={item} />}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            {isLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <>
                <IconButton icon="package-variant" size={60} iconColor={colors.border} />
                <Text variant="titleMedium" style={styles.emptyText}>No orders found</Text>
                <Button mode="text" onPress={() => navigation.navigate('HomeTab')}>Start Shopping</Button>
              </>
            )}
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
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontWeight: '700',
    marginBottom: 16,
  },
  segmented: {
    marginBottom: 4,
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  orderId: {
    color: colors.textSecondary,
  },
  priceColumn: {
    alignItems: 'flex-end',
  },
  amount: {
    fontWeight: '700',
  },
  status: {
    fontSize: 10,
    fontWeight: '800',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  date: {
    color: colors.textSecondary,
  },
  helpLink: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: colors.textSecondary,
    marginTop: 10,
  },
});
