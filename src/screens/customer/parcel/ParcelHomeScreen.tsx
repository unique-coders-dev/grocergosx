import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Text } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { colors, shadows } from '../../../config/theme';
import { Card, Badge, Button } from '../../../components/common/UI';
import { 
  ServicePageHeader, 
  AddressSelector, 
  SearchBox, 
  CategoryChips, 
  DetailItem 
} from '../../../components/common/ServiceComponents';

const { width } = Dimensions.get('window');

const PARCEL_CATEGORIES = ['All', 'Documents', 'Small Box', 'Fragile', 'Express'];

const PARCEL_TYPES = [
  { id: '1', title: 'Documents', icon: 'file-document-outline', imageUri: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?q=80&w=400' },
  { id: '2', title: 'Gift Box', icon: 'gift-outline', imageUri: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400' },
  { id: '3', title: 'Groceries', icon: 'cart-outline', imageUri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400' },
  { id: '4', title: 'Electronics', icon: 'laptop', imageUri: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=400' },
];

const RECENT_DELIVERIES = [
  { id: '1', from: 'Simpson Bay', to: 'Philipsburg', date: 'May 6, 2025', time: '10:30 AM', items: '1 package', status: 'Delivered', imageUri: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?q=80&w=200' },
  { id: '2', from: 'Maho', to: 'Cole Bay', date: 'May 6, 2025', time: '2:15 PM', items: 'Fragile', status: 'In progress', imageUri: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=200' },
];

export const ParcelHomeScreen = ({ navigation }: any) => {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <SafeAreaView style={styles.container}>
      <ServicePageHeader navigation={navigation} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.titleSection}>
          <Text style={styles.title}>Parcel Delivery</Text>
          <Text style={styles.subtitle}>Send anything, anywhere on the island</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <AddressSelector label="Pickup from" address="Simpson Bay, Yacht Club" icon="map-marker-radius" />
          <AddressSelector label="Deliver to" address="Philipsburg, Front St." icon="map-marker-check" />
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <SearchBox placeholder="What are you sending?" />
          <CategoryChips 
            categories={PARCEL_CATEGORIES} 
            activeCategory={activeCategory} 
            onSelect={setActiveCategory} 
          />
        </Animated.View>

        {/* Hero Banner */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.bannerContainer}>
          <Card style={styles.bannerCard}>
            <FastImage 
              source={{ uri: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800' }} 
              style={styles.bannerImage} 
            />
            <View style={styles.bannerOverlay}>
              <Badge label="New Service" color={colors.primary} style={{ marginBottom: 8 }} />
              <Text style={styles.bannerTitle}>Fast & Secure</Text>
              <Text style={styles.bannerSubtitle}>Island-wide pickup & drop-off</Text>
              <Button 
                title="Book Now" 
                onPress={() => navigation.navigate('ParcelBooking')} 
                size="small" 
                style={{ marginTop: 12, width: 120 }}
              />
            </View>
          </Card>
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Quick Details</Text>
          <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.detailsGrid}>
            <DetailItem icon="package-variant-closed" label="Parcel Type" value="Small Package" />
            <DetailItem icon="clock-fast" label="Delivery Speed" type="switch" active={true} />
            <DetailItem icon="weight-kilogram" label="Estimated Weight" value="Up to 5 lb" />
          </Animated.View>
        </View>

        {/* Popular Parcel Types */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Common Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularScroll}>
            {PARCEL_TYPES.map((type, index) => (
              <Animated.View 
                key={type.id} 
                entering={FadeInRight.delay(600 + index * 100).duration(600)}
                style={styles.popularCard}
              >
                <Card style={styles.typeCard} onPress={() => {}}>
                  <View style={[styles.typeIconBox, { backgroundColor: colors.surface }]}>
                    <MaterialCommunityIcons name={type.icon} size={28} color={colors.primary} />
                  </View>
                  <Text style={styles.typeTitle}>{type.title}</Text>
                </Card>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Recent Deliveries */}
        <View style={[styles.section, { marginBottom: 40 }]}>
          <View style={styles.rowHeader}>
            <Text style={styles.sectionHeader}>History</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
          </View>
          {RECENT_DELIVERIES.map((delivery, index) => (
            <Animated.View 
              key={delivery.id}
              entering={FadeInDown.delay(800 + index * 100).duration(600)}
            >
              <Card style={styles.requestCard} onPress={() => {}}>
                <View style={styles.requestIconContainer}>
                  <MaterialCommunityIcons name="package-variant" size={24} color={colors.primary} />
                </View>
                <View style={styles.requestContent}>
                  <Text style={styles.requestTitle}>{delivery.from} → {delivery.to}</Text>
                  <Text style={styles.requestMeta}>{delivery.date} • {delivery.time}</Text>
                </View>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: delivery.status === 'Delivered' ? colors.primary + '15' : colors.secondaryLight }
                ]}>
                  <Text style={[
                    styles.statusText, 
                    { color: delivery.status === 'Delivered' ? colors.primary : colors.secondary }
                  ]}>{delivery.status}</Text>
                </View>
              </Card>
            </Animated.View>
          ))}
        </View>
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
    paddingBottom: 120,
  },
  titleSection: {
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.dark,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.gray,
    marginTop: 4,
  },
  bannerContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  bannerCard: {
    padding: 0,
    height: 180,
    overflow: 'hidden',
    borderRadius: 24,
    borderWidth: 0,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
    justifyContent: 'center',
  },
  bannerTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.dark,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  detailsGrid: {
    marginBottom: 8,
  },
  popularScroll: {
    paddingRight: 24,
    paddingVertical: 12,
  },
  popularCard: {
    marginRight: 16,
  },
  typeCard: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: colors.white,
    ...shadows.soft,
  },
  typeIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.dark,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  seeAll: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 20,
    borderWidth: 0,
    ...shadows.soft,
  },
  requestIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestContent: {
    flex: 1,
    marginLeft: 16,
  },
  requestTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
  },
  requestMeta: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
