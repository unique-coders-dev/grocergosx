import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text, Avatar, List, Divider, Button, Card } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { useAuthStore } from '../../../store/authStore';
import { colors } from '../../../config/theme';

export const ProfileScreen = ({ navigation }: any) => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await auth().signOut();
    logout();
  };

  const ProfileItem = ({ icon, title, subtitle, onPress, color = colors.textPrimary }: any) => (
    <List.Item
      title={title}
      description={subtitle}
      left={props => <List.Icon {...props} icon={icon} color={color} />}
      right={props => <List.Icon {...props} icon="chevron-right" />}
      onPress={onPress}
      style={styles.listItem}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <Avatar.Text 
            size={80} 
            label={user?.name?.substring(0, 2).toUpperCase() || '??'} 
            style={styles.avatar} 
          />
          <View style={styles.profileInfo}>
            <Text variant="headlineSmall" style={styles.userName}>{user?.name}</Text>
            <Text variant="bodyMedium" style={styles.userEmail}>{user?.email}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
              <Text style={styles.editLink}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Account Settings</Text>
          <Card style={styles.card}>
            <ProfileItem icon="map-marker-outline" title="Address Book" subtitle="Manage your saved addresses" onPress={() => navigation.navigate('AddressBook')} />
            <Divider />
            <ProfileItem icon="credit-card-outline" title="Payment Methods" subtitle="Saved cards & payment options" onPress={() => navigation.navigate('PaymentMethods')} />
            <Divider />
            <ProfileItem icon="bell-outline" title="Notifications" subtitle="App alerts & push settings" onPress={() => navigation.navigate('NotificationSettings')} />
          </Card>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Support & More</Text>
          <Card style={styles.card}>
            <ProfileItem icon="help-circle-outline" title="Support & FAQ" subtitle="Help center & contact info" onPress={() => navigation.navigate('Support')} />
            <Divider />
            <ProfileItem icon="calendar-star" title="St. Maarten Events" subtitle="Local events & guide" onPress={() => navigation.navigate('Events')} />
            <Divider />
            <ProfileItem icon="information-outline" title="About GrocerGo" subtitle="Terms, privacy & version" onPress={() => navigation.navigate('About')} />
          </Card>
        </View>

        <Button 
          mode="outlined" 
          onPress={handleLogout} 
          style={styles.logoutButton}
          textColor={colors.error}
          icon="logout"
        >
          Log Out
        </Button>
        <Text style={styles.version}>Version 1.0.0 (May 2026)</Text>
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
    paddingBottom: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    backgroundColor: colors.primary,
  },
  profileInfo: {
    marginLeft: 20,
  },
  userName: {
    fontWeight: '700',
  },
  userEmail: {
    color: colors.textSecondary,
    marginBottom: 4,
  },
  editLink: {
    color: colors.primary,
    fontWeight: '600',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 10,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  listItem: {
    paddingVertical: 4,
  },
  logoutButton: {
    marginTop: 40,
    marginHorizontal: 20,
    borderColor: colors.error,
    borderWidth: 1,
    borderRadius: 12,
  },
  version: {
    textAlign: 'center',
    marginTop: 20,
    color: colors.textSecondary,
    fontSize: 12,
  },
});
