import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { colors, shadows } from '../../config/theme';
import { Card, Input } from '../common/UI';

export const HomeHeader = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/logos/logo_full.png')} 
          style={styles.logoImage} 
          resizeMode="contain"
        />
      </View>
      <TouchableOpacity 
        style={styles.notificationButton} 
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Notifications')}
      >
        <MaterialCommunityIcons name="bell-outline" size={24} color={colors.dark} />
        <View style={styles.notificationDot} />
      </TouchableOpacity>
    </View>
  );
};

export const WelcomeSection = ({ name, address, onAddressPress }: { name: string; address?: string; onAddressPress?: () => void }) => (
  <View style={styles.welcomeContainer}>
    <View style={styles.greetingHeader}>
      <Text style={styles.greetingTitle}>Hello, {name.split(' ')[0]}</Text>
      <Text style={styles.greetingSubtitle}>Let's get everything you need</Text>
    </View>
    
    <TouchableOpacity 
      style={styles.addressBar} 
      onPress={onAddressPress}
      activeOpacity={0.8}
    >
      <View style={styles.addressIconContainer}>
        <MaterialCommunityIcons name="map-marker-radius" size={20} color={colors.primary} />
      </View>
      <View style={styles.addressTextWrapper}>
        <Text style={styles.addressLabel}>Delivering to</Text>
        <Text style={styles.addressValue} numberOfLines={1}>{address || 'Select your location'}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.grayLight} />
    </TouchableOpacity>
  </View>
);

export const SearchSection = ({ searchQuery, setSearchQuery, onSearch, onFilterPress }: any) => (
  <View style={styles.searchContainer}>
    <View style={styles.searchRow}>
      <View style={styles.inputWrapper}>
        <Input 
          icon="magnify"
          placeholder="Search products, services..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={onSearch}
        />
      </View>
      <TouchableOpacity 
        style={styles.filterIconButton} 
        onPress={onFilterPress}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="tune-variant" size={24} color={colors.white} />
      </TouchableOpacity>
    </View>
  </View>
);

export const SectionHeader = ({ title, onSeeAll, style }: { title: string; onSeeAll?: () => void; style?: ViewStyle }) => (
  <View style={[styles.sectionHeader, style]}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {onSeeAll && (
      <TouchableOpacity onPress={onSeeAll} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={styles.seeAllText}>See all</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 44,
    paddingBottom: 12,
    backgroundColor: colors.white,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  logoImage: {
    height: 38,
    width: 130,
  },
  notificationButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.grayLighter,
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  welcomeContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  greetingHeader: {
    marginBottom: 20,
  },
  greetingTitle: {
    fontSize: 24, // Reduced from 28
    fontWeight: '800',
    color: colors.dark,
    letterSpacing: -0.5,
  },
  greetingSubtitle: {
    fontSize: 15, // Reduced from 16
    color: colors.gray,
    marginTop: 2,
  },
  addressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.grayLighter,
    ...shadows.soft,
  },
  addressIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addressTextWrapper: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addressValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    marginRight: 12,
  },
  filterIconButton: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.dark,
    letterSpacing: -0.5,
  },
  seeAllText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
});
