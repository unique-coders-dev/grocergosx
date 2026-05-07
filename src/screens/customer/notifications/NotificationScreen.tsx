import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, shadows } from '../../../config/theme';
import { Card, Badge } from '../../../components/common/UI';

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Order Delivered',
    message: 'Your grocery order #1234 has been delivered successfully.',
    time: '2 mins ago',
    type: 'success',
    icon: 'check-circle-outline'
  },
  {
    id: '2',
    title: 'Promo Applied',
    message: 'You saved $5 on your last laundry service!',
    time: '1 hour ago',
    type: 'info',
    icon: 'tag-outline'
  },
  {
    id: '3',
    title: 'New Service Available',
    message: 'Parcel delivery is now available in your area.',
    time: 'Yesterday',
    type: 'accent',
    icon: 'truck-fast-outline'
  },
];

export const NotificationScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color={colors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {MOCK_NOTIFICATIONS.length > 0 ? (
          MOCK_NOTIFICATIONS.map((item) => (
            <Card key={item.id} style={styles.notificationCard}>
              <View style={[styles.iconContainer, { backgroundColor: (colors as any)[item.type] + '15' }]}>
                <MaterialCommunityIcons name={item.icon} size={24} color={(colors as any)[item.type]} />
              </View>
              <View style={styles.content}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
                <Text style={styles.message}>{item.message}</Text>
              </View>
            </Card>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="bell-off-outline" size={64} color={colors.grayLighter} />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grayLighter,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.dark,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    borderWidth: 0,
    ...shadows.soft,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
  },
  time: {
    fontSize: 12,
    color: colors.grayLight,
  },
  message: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray,
    marginTop: 16,
    fontWeight: '600',
  },
});
