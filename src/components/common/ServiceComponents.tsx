import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Text, Switch } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, shadows } from '../../config/theme';
import { Card, Input } from './UI';

export const ServicePageHeader = ({ navigation, title, cartCount = 0 }: any) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
      <MaterialCommunityIcons name="chevron-left" size={28} color={colors.dark} />
    </TouchableOpacity>
    
    <View style={styles.logoContainer}>
      <Image 
        source={require('../../assets/logos/logo_full.png')} 
        style={styles.logoImage} 
        resizeMode="contain"
      />
    </View>

    <View style={styles.rightActions}>
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => navigation.navigate('Notifications')}
      >
        <MaterialCommunityIcons name="bell-outline" size={24} color={colors.dark} />
        <View style={styles.badgeSmall} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.actionButton, { marginLeft: 12 }]} 
        onPress={() => navigation.navigate('Cart')}
      >
        <MaterialCommunityIcons name="shopping-outline" size={24} color={colors.dark} />
        {cartCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  </View>
);

export const AddressSelector = ({ label, address, icon = 'map-marker-radius' }: { label: string, address: string, icon?: string }) => {
  const handleSelectLocation = () => {
    Alert.alert('Select Location', 'Location picker would open here to dynamically select your address.');
  };

  return (
    <Card style={styles.addressContainer}>
      <TouchableOpacity style={styles.addressRow} activeOpacity={0.7} onPress={handleSelectLocation}>
        <View style={styles.addressIconCircle}>
          <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />
        </View>
        <View style={styles.addressContent}>
          <Text style={styles.addressLabel}>{label}</Text>
          <Text style={styles.addressText} numberOfLines={1}>{address}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-down" size={20} color={colors.grayLight} />
      </TouchableOpacity>
    </Card>
  );
};

export const SearchBox = ({ placeholder }: { placeholder: string }) => (
  <View style={styles.searchContainer}>
    <Input 
      icon="magnify"
      placeholder={placeholder}
    />
  </View>
);

export const CategoryChips = ({ categories, activeCategory, onSelect }: any) => (
  <View style={styles.chipsOuter}>
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.chipsContainer}
    >
      {categories.map((cat: string) => (
        <TouchableOpacity 
          key={cat} 
          style={[styles.chip, activeCategory === cat && styles.activeChip]}
          onPress={() => onSelect(cat)}
        >
          <Text style={[styles.chipText, activeCategory === cat && styles.activeChipText]}>{cat}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

export const DetailItem = ({ 
  icon, 
  label, 
  value, 
  type = 'select', 
  active = false,
  onPress 
}: { 
  icon: string, 
  label: string, 
  value?: string, 
  type?: 'select' | 'toggle' | 'switch',
  active?: boolean,
  onPress?: () => void 
}) => (
  <TouchableOpacity 
    style={styles.detailItem} 
    onPress={onPress} 
    disabled={type !== 'select'}
    activeOpacity={0.8}
  >
    <View style={styles.detailIconContainer}>
      <MaterialCommunityIcons name={icon} size={22} color={colors.primary} />
    </View>
    <View style={styles.detailContent}>
      <Text style={styles.detailLabel}>{label}</Text>
      {value && <Text style={styles.detailValue}>{value}</Text>}
    </View>
    {type === 'select' && (
      <MaterialCommunityIcons name="chevron-down" size={20} color={colors.grayLight} />
    )}
    {type === 'toggle' && (
      <Switch value={active} onValueChange={() => {}} color={colors.primary} />
    )}
    {type === 'switch' && (
      <View style={styles.switchContainer}>
        <TouchableOpacity style={[styles.switchOption, active && styles.activeSwitchOption]}>
          <Text style={[styles.switchText, active && styles.activeSwitchText]}>Standard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.switchOption, !active && styles.activeSwitchOption]}>
          <Text style={[styles.switchText, !active && styles.activeSwitchText]}>Express</Text>
        </TouchableOpacity>
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: colors.white,
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
  logoContainer: {
    alignItems: 'center',
    flex: 1,
  },
  logoImage: {
    height: 38,
    width: 130,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grayLighter,
  },
  badgeSmall: {
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
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  cartBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '800',
  },
  addressContainer: {
    marginHorizontal: 24,
    marginTop: 12,
    padding: 12,
    borderRadius: 20,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addressContent: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 11,
    color: colors.gray,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addressText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  chipsOuter: {
    marginTop: 20,
  },
  chipsContainer: {
    paddingHorizontal: 24,
    paddingRight: 40,
    paddingVertical: 12,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: colors.surface,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.grayLighter,
  },
  activeChip: {
    backgroundColor: colors.dark,
    borderColor: colors.dark,
    ...shadows.soft,
  },
  chipText: {
    fontSize: 13,
    color: colors.gray,
    fontWeight: '700',
  },
  activeChipText: {
    color: colors.white,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.grayLighter,
  },
  detailIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    ...shadows.soft,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.dark,
    marginTop: 2,
  },
  switchContainer: {
    flexDirection: 'row',
    backgroundColor: colors.grayLighter,
    borderRadius: 12,
    padding: 3,
  },
  switchOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  activeSwitchOption: {
    backgroundColor: colors.primary,
  },
  switchText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.gray,
  },
  activeSwitchText: {
    color: colors.white,
  },
});
