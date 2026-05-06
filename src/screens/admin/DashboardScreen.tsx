import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { Text, Card, Title, Paragraph, IconButton, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../config/theme';

const { width } = Dimensions.get('window');

const StatCard = ({ title, value, icon, color }: any) => (
  <Card style={styles.statCard}>
    <Card.Content style={styles.statContent}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </View>
      <View>
        <Text variant="bodySmall" style={styles.statTitle}>{title}</Text>
        <Text variant="titleLarge" style={styles.statValue}>{value}</Text>
      </View>
    </Card.Content>
  </Card>
);

export const AdminDashboardScreen = ({ navigation }: any) => {
  const stats = [
    { title: "Today's Orders", value: '12', icon: 'cart-outline', color: colors.primary },
    { title: 'Pending Tasks', value: '5', icon: 'clock-outline', color: '#F59E0B' },
    { title: 'Revenue Today', value: '$450.00', icon: 'currency-usd', color: '#22C55E' },
    { title: 'New Customers', value: '3', icon: 'account-plus-outline', color: '#3B82F6' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.headerTitle}>Dashboard</Text>
          <Text variant="bodyMedium" style={styles.headerSubtitle}>Welcome back, Admin</Text>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge">Recent Orders</Text>
            <IconButton icon="chevron-right" onPress={() => navigation.navigate('Orders')} />
          </View>
          
          <Card style={styles.orderCard}>
            <Card.Content>
              <View style={styles.orderRow}>
                <View>
                  <Text variant="titleMedium">#ORD-5542</Text>
                  <Text variant="bodySmall">Customer: John Doe</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>PENDING</Text>
                </View>
              </View>
              <Paragraph style={styles.orderDetail}>Grocery Shopping • $45.00</Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.orderCard}>
            <Card.Content>
              <View style={styles.orderRow}>
                <View>
                  <Text variant="titleMedium">#ORD-5543</Text>
                  <Text variant="bodySmall">Customer: Jane Smith</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: '#DBEAFE' }]}>
                  <Text style={[styles.statusText, { color: '#1E40AF' }]}>CONFIRMED</Text>
                </View>
              </View>
              <Paragraph style={styles.orderDetail}>Laundry Service • $28.50</Paragraph>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>Service Performance</Text>
          <Card style={styles.chartPlaceholder}>
            <Card.Content style={styles.chartContent}>
              <MaterialCommunityIcons name="chart-bar" size={60} color={colors.border} />
              <Text variant="bodyMedium" style={styles.chartText}>Weekly Revenue Chart Placeholder</Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: (width - 50) / 2,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 2,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statTitle: {
    color: colors.textSecondary,
  },
  statValue: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  orderCard: {
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  statusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
  },
  orderDetail: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.border,
  },
  chartContent: {
    alignItems: 'center',
  },
  chartText: {
    marginTop: 10,
    color: colors.textSecondary,
  },
});
