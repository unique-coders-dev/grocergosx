import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Text, Card, Avatar, Divider, Button, List, IconButton, TextInput } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import firestore from '@react-native-firebase/firestore';
import { User, Order } from '../../types';
import { colors } from '../../config/theme';

export const CustomerDetailAdminScreen = ({ route, navigation }: any) => {
  const { uid } = route.params;
  const [adjustingPoints, setAdjustingPoints] = useState(false);
  const [pointsDelta, setPointsDelta] = useState('');

  const { data: customer, isLoading: customerLoading, refetch: refetchCustomer } = useQuery({
    queryKey: ['admin-customer-detail', uid],
    queryFn: async () => {
      const doc = await firestore().collection('users').doc(uid).get();
      return { uid: doc.id, ...doc.data() } as User;
    },
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-customer-orders', uid],
    queryFn: async () => {
      const snapshot = await firestore()
        .collection('orders')
        .where('customerId', '==', uid)
        .orderBy('createdAt', 'desc')
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    },
  });

  const handleAdjustPoints = async () => {
    const delta = parseInt(pointsDelta);
    if (isNaN(delta)) return;

    setAdjustingPoints(true);
    try {
      await firestore().collection('users').doc(uid).update({
        loyaltyPoints: firestore.FieldValue.increment(delta),
      });
      setPointsDelta('');
      refetchCustomer();
      Alert.alert('Success', `Adjusted points by ${delta}`);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setAdjustingPoints(false);
    }
  };

  if (customerLoading) return <View style={styles.center}><Text>Loading...</Text></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="chevron-left" onPress={() => navigation.goBack()} />
        <Text variant="titleLarge">Customer Profile</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Text 
              size={80} 
              label={customer?.name.substring(0, 2).toUpperCase() || '??'} 
              style={styles.avatar}
            />
            <Text variant="headlineSmall" style={styles.name}>{customer?.name}</Text>
            <Text variant="bodyMedium" style={styles.email}>{customer?.email}</Text>
            <Text variant="bodySmall" style={styles.role}>Role: {customer?.role?.toUpperCase()}</Text>
          </Card.Content>
        </Card>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text variant="titleLarge" style={styles.statValue}>{customer?.loyaltyPoints || 0}</Text>
            <Text variant="bodySmall">Points</Text>
          </View>
          <View style={styles.statBox}>
            <Text variant="titleLarge" style={styles.statValue}>{orders?.length || 0}</Text>
            <Text variant="bodySmall">Orders</Text>
          </View>
          <View style={styles.statBox}>
            <Text variant="titleLarge" style={styles.statValue}>{customer?.referralCode || 'N/A'}</Text>
            <Text variant="bodySmall">Code</Text>
          </View>
        </View>

        <Text variant="titleMedium" style={styles.sectionTitle}>Adjust Loyalty Points</Text>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.pointsAction}>
              <TextInput
                label="+/- Points"
                mode="outlined"
                keyboardType="numeric"
                value={pointsDelta}
                onChangeText={setPointsDelta}
                style={styles.pointsInput}
              />
              <Button 
                mode="contained" 
                onPress={handleAdjustPoints}
                loading={adjustingPoints}
                style={styles.adjustButton}
              >
                Apply
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Text variant="titleMedium" style={styles.sectionTitle}>Order History</Text>
        {orders?.map(order => (
          <List.Item
            key={order.id}
            title={`${order.type.toUpperCase()} - #${order.id.substring(0, 8)}`}
            description={`${new Date(order.createdAt?.seconds * 1000).toLocaleDateString()} • $${order.totalAmount.toFixed(2)}`}
            left={props => <List.Icon {...props} icon="package-variant" />}
            right={props => (
              <View style={styles.orderRight}>
                <Text style={styles.orderStatus}>{order.status}</Text>
                <List.Icon {...props} icon="chevron-right" />
              </View>
            )}
            onPress={() => navigation.navigate('OrderDetailAdmin', { orderId: order.id })}
            style={styles.orderItem}
          />
        ))}
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
  },
  scrollContent: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 20,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    backgroundColor: colors.primary,
    marginBottom: 16,
  },
  name: {
    fontWeight: '700',
  },
  email: {
    color: colors.textSecondary,
  },
  role: {
    marginTop: 4,
    color: colors.primary,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 1,
  },
  statValue: {
    fontWeight: '700',
    color: colors.primary,
  },
  sectionTitle: {
    marginVertical: 15,
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
  },
  pointsAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsInput: {
    flex: 1,
    marginRight: 10,
    backgroundColor: 'white',
  },
  adjustButton: {
    height: 50,
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  orderItem: {
    backgroundColor: 'white',
    marginBottom: 1,
  },
  orderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderStatus: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
});
