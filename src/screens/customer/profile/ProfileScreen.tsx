import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import auth from '@react-native-firebase/auth';
import { useAuthStore } from '../../../store/authStore';
import { colors, shadows } from '../../../config/theme';
import { Card, Button } from '../../../components/common/UI';

const { width } = Dimensions.get('window');

export const ProfileScreen = ({ navigation }: any) => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await auth().signOut();
    logout();
  };

  const ProfileItem = ({ icon, title, subtitle, onPress, isLast = false }: any) => (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.7}
      style={[styles.profileItem, !isLast && styles.profileItemBorder]}
    >
      <View style={styles.profileItemLeft}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name={icon} size={22} color={colors.primary} />
        </View>
        <View style={styles.profileItemText}>
          <Text style={styles.profileItemTitle}>{title}</Text>
          <Text style={styles.profileItemSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color={colors.grayLight} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <View style={styles.headerBg}>
            <View style={styles.avatarContainer}>
              <Avatar.Text 
                size={90} 
                label={user?.name?.substring(0, 2).toUpperCase() || '??'} 
                style={styles.avatar} 
                labelStyle={{ fontWeight: '800' }}
              />
              <TouchableOpacity style={styles.editBadge} onPress={() => navigation.navigate('EditProfile')}>
                <MaterialCommunityIcons name="camera" size={16} color={colors.white} />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Orders</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>450</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>St. Maarten</Text>
                <Text style={styles.statLabel}>Location</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <Card style={styles.menuCard}>
            <ProfileItem 
              icon="map-marker-outline" 
              title="Address Book" 
              subtitle="Manage your saved delivery locations" 
              onPress={() => navigation.navigate('AddressBook')} 
            />
            <ProfileItem 
              icon="credit-card-outline" 
              title="Payment Methods" 
              subtitle="Manage cards & wallet balance" 
              onPress={() => navigation.navigate('PaymentMethods')} 
            />
            <ProfileItem 
              icon="bell-outline" 
              title="Notifications" 
              subtitle="Alerts, promotions & push settings" 
              onPress={() => navigation.navigate('NotificationSettings')} 
              isLast 
            />
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Information</Text>
          <Card style={styles.menuCard}>
            <ProfileItem 
              icon="help-circle-outline" 
              title="Support & FAQ" 
              subtitle="Help center & contact information" 
              onPress={() => navigation.navigate('Support')} 
            />
            <ProfileItem 
              icon="calendar-star" 
              title="Local Events" 
              subtitle="Explore events in St. Maarten" 
              onPress={() => navigation.navigate('Events')} 
            />
            <ProfileItem 
              icon="information-outline" 
              title="About GrocerGo" 
              subtitle="Terms, privacy & version 1.0.0" 
              onPress={() => navigation.navigate('About')} 
              isLast 
            />
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.footer}>
          <Button 
            title="Log Out" 
            onPress={handleLogout} 
            type="outline"
            icon="logout"
            textColor={colors.error}
            style={styles.logoutBtn}
          />
          <Text style={styles.version}>Built with passion in St. Maarten</Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  headerBg: {
    width: '100%',
    padding: 24,
    backgroundColor: colors.surface,
    borderRadius: 32,
    alignItems: 'center',
    ...shadows.soft,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: colors.primary,
    ...shadows.medium,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.dark,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.dark,
  },
  userEmail: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.grayLighter,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.dark,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 2,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.grayLighter,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.dark,
    marginBottom: 16,
    marginLeft: 4,
  },
  menuCard: {
    padding: 0,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 0,
    ...shadows.soft,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingVertical: 18,
  },
  profileItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLighter,
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileItemText: {
    marginLeft: 16,
    flex: 1,
  },
  profileItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
  },
  profileItemSubtitle: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 2,
  },
  footer: {
    marginTop: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logoutBtn: {
    width: '100%',
    borderColor: colors.error,
    backgroundColor: colors.error + '10',
  },
  version: {
    marginTop: 20,
    fontSize: 12,
    color: colors.grayLight,
    fontWeight: '600',
  },
});
