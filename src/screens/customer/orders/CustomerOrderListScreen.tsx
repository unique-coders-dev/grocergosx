import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native';
import { Text } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Order } from '../../../types';
import { colors, shadows } from '../../../config/theme';
import { Card, Badge, Skeleton, Button } from '../../../components/common/UI';

export const CustomerOrderListScreen = ({ navigation }: any) => {
  const [filter, setFilter] = useState('active');
  const [isLoadingUI, setIsLoadingUI] = useState(true);
  const userUid = auth().currentUser?.uid;

  const { data: orders, isLoading: isQueryLoading, refetch } = useQuery({
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

  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingUI(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusInfo = (status: string) => {
    const s = status.toLowerCase();
    if (['pending', 'scheduled', 'booked'].includes(s)) return { color: '#F59E0B', label: 'Processing' };
    if (['confirmed', 'preparing', 'in_cleaning', 'picked_up'].includes(s)) return { color: colors.primary, label: 'In Progress' };
    if (['out_for_delivery', 'in_transit'].includes(s)) return { color: colors.accent, label: 'On Way' };
    if (['delivered', 'completed'].includes(s)) return { color: '#10B981', label: 'Delivered' };
    return { color: colors.error, label: 'Cancelled' };
  };

  const OrderCard = ({ order, index }: { order: Order; index: number }) => {
    const { color, label } = getStatusInfo(order.status);
    const date = order.createdAt?.seconds 
      ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : 'Just now';

    return (
      <Animated.View entering={FadeInDown.delay(index * 100).duration(600)}>
        <Card style={styles.orderCard} onPress={() => {}}>
          <View style={styles.cardHeader}>
            <View style={styles.orderTypeContainer}>
              <View style={[styles.typeIcon, { backgroundColor: colors.primary + '15' }]}>
                <MaterialCommunityIcons 
                  name={order.type === 'parcel' ? 'truck-fast' : order.type === 'laundry' ? 'washing-machine' : 'cart-outline'} 
                  size={20} 
                  color={colors.primary} 
                />
              </View>
              <View>
                <Text style={styles.orderType}>{order.type.charAt(0).toUpperCase() + order.type.slice(1)}</Text>
                <Text style={styles.orderDate}>{date}</Text>
              </View>
            </View>
            <Badge label={label} color={color} />
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.orderId}>Order #{order.id.substring(0, 6).toUpperCase()}</Text>
              <Text style={styles.itemCount}>
                {order.type === 'grocery' ? 'Grocery Items' : order.type === 'parcel' ? 'Parcel Delivery' : 'Laundry Service'}
              </Text>
            </View>
            <Text style={styles.amount}>${order.totalAmount.toFixed(2)}</Text>
          </View>
        </Card>
      </Animated.View>
    );
  };

  if (isLoadingUI || isQueryLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Orders</Text>
        </View>
        <View style={{ padding: 24 }}>
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} width="100%" height={120} style={{ borderRadius: 24, marginBottom: 16 }} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, filter === 'active' && styles.activeTab]}
            onPress={() => setFilter('active')}
          >
            <Text style={[styles.tabText, filter === 'active' && styles.activeTabText]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, filter === 'past' && styles.activeTab]}
            onPress={() => setFilter('past')}
          >
            <Text style={[styles.tabText, filter === 'past' && styles.activeTabText]}>Past Orders</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => <OrderCard order={item} index={index} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isQueryLoading} onRefresh={refetch} tintColor={colors.primary} />
        }
        ListEmptyComponent={() => (
          <Animated.View entering={FadeInUp} style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <MaterialCommunityIcons name="package-variant" size={48} color={colors.grayLighter} />
            </View>
            <Text style={styles.emptyTitle}>No Orders Yet</Text>
            <Text style={styles.emptySubtitle}>When you place an order, it will appear here.</Text>
            <Button 
              title="Start Shopping" 
              onPress={() => navigation.navigate('HomeTab')} 
              style={{ marginTop: 24, paddingHorizontal: 32 }}
            />
          </Animated.View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.dark,
    letterSpacing: -0.5,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: colors.white,
    ...shadows.soft,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray,
  },
  activeTabText: {
    color: colors.dark,
  },
  listContent: {
    padding: 24,
    paddingTop: 8,
    paddingBottom: 120,
  },
  orderCard: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 0,
    ...shadows.soft,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderType: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.dark,
  },
  orderDate: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 2,
    fontWeight: '600',
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.grayLighter,
    marginVertical: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.dark,
  },
  itemCount: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 2,
  },
  amount: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.dark,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});
