import React, { useState, useEffect } from 'react';
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
import { Card, Badge, Button, Skeleton } from '../../../components/common/UI';
import { 
  ServicePageHeader, 
  AddressSelector, 
  SearchBox, 
  CategoryChips, 
  DetailItem 
} from '../../../components/common/ServiceComponents';

const { width } = Dimensions.get('window');

const LAUNDRY_CATEGORIES = ['All', 'Wash & Fold', 'Ironing', 'Bedding', 'Delicates', 'Express'];

const POPULAR_SERVICES = [
  { id: '1', title: 'Wash & Fold', icon: 'washing-machine', imageUri: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=400' },
  { id: '2', title: 'Ironing', icon: 'iron-outline', imageUri: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=400' },
  { id: '3', title: 'Bedding', icon: 'bed-outline', imageUri: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=400' },
  { id: '4', title: 'Dry Cleaning', icon: 'tie', imageUri: 'https://images.unsplash.com/photo-1489066604574-233c5a548ba0?q=80&w=400' },
];

const RECENT_REQUESTS = [
  { id: '1', title: 'Simpson Bay Pickup', date: 'May 6, 2025', time: '10:00 AM', service: 'Wash & Fold', status: 'Completed', imageUri: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=200' },
  { id: '2', title: 'Maho Pickup', date: 'May 7, 2025', time: '1:30 PM', service: 'Wash & Fold + Ironing', status: 'In progress', imageUri: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=200' },
];

export const LaundryHomeScreen = ({ navigation }: any) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ServicePageHeader navigation={navigation} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={{ paddingHorizontal: 24, marginTop: 12 }}>
            <Skeleton width="60%" height={32} style={{ marginBottom: 24 }} />
            <Skeleton width="100%" height={80} style={{ borderRadius: 20, marginBottom: 12 }} />
            <Skeleton width="100%" height={80} style={{ borderRadius: 20, marginBottom: 24 }} />
            <Skeleton width="100%" height={56} style={{ borderRadius: 18, marginBottom: 24 }} />
            <Skeleton width="100%" height={180} style={{ borderRadius: 24, marginBottom: 32 }} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ServicePageHeader navigation={navigation} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.titleSection}>
          <Text style={styles.title}>Laundry Service</Text>
          <Text style={styles.subtitle}>Professional care for your garments</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <AddressSelector label="Pickup from" address="Simpson Bay, Yacht Club" icon="map-marker-radius" />
          <AddressSelector label="Return to" address="Philipsburg, Front St." icon="map-marker-check" />
          <SearchBox placeholder="What laundry service do you need?" />
          <CategoryChips 
            categories={LAUNDRY_CATEGORIES} 
            activeCategory={activeCategory} 
            onSelect={setActiveCategory} 
          />
        </Animated.View>

        {/* Hero Banner */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.bannerContainer}>
          <Card style={styles.bannerCard} onPress={() => {}}>
            <FastImage 
              source={{ uri: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=800' }} 
              style={styles.bannerImage} 
            />
            <View style={styles.bannerOverlay}>
              <Badge label="Best Choice" color={colors.primary} style={{ marginBottom: 8 }} />
              <Text style={styles.bannerTitle}>Wash & Iron</Text>
              <Text style={styles.bannerSubtitle}>24h turnaround available</Text>
            </View>
          </Card>
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Quick Select</Text>
          <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.detailsGrid}>
            <DetailItem icon="tshirt-crew-outline" label="Standard Wash" value="Wash & Fold" />
            <DetailItem icon="iron-outline" label="Extra Service" type="toggle" active={true} />
            <DetailItem icon="clock-fast" label="Processing" type="switch" active={true} />
          </Animated.View>

          <Button 
            title="Book Laundry" 
            onPress={() => navigation.navigate('LaundrySchedule')} 
            style={{ marginTop: 12 }}
          />
        </View>

        {/* Popular Services */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Service Types</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularScroll}>
            {POPULAR_SERVICES.map((service, index) => (
              <Animated.View 
                key={service.id} 
                entering={FadeInRight.delay(600 + index * 100).duration(600)}
                style={styles.popularCard}
              >
                <Card style={styles.typeCard} onPress={() => {}}>
                  <View style={styles.typeIconBox}>
                    <MaterialCommunityIcons name={service.icon} size={28} color={colors.primary} />
                  </View>
                  <Text style={styles.typeTitle}>{service.title}</Text>
                </Card>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Recent Requests */}
        <View style={[styles.section, { marginBottom: 40 }]}>
          <View style={styles.rowHeader}>
            <Text style={styles.sectionHeader}>Recent Requests</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
          </View>
          {RECENT_REQUESTS.map((request, index) => (
            <Animated.View 
              key={request.id}
              entering={FadeInDown.delay(800 + index * 100).duration(600)}
            >
              <Card style={styles.requestCard} onPress={() => {}}>
                <View style={styles.requestIconContainer}>
                  <MaterialCommunityIcons name="washing-machine" size={24} color={colors.primary} />
                </View>
                <View style={styles.requestContent}>
                  <Text style={styles.requestTitle}>{request.title}</Text>
                  <Text style={styles.requestMeta}>{request.date} • {request.time}</Text>
                  <Text style={styles.requestServiceText}>{request.service}</Text>
                </View>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: request.status === 'Completed' ? colors.primary + '15' : colors.secondaryLight }
                ]}>
                  <Text style={[
                    styles.statusText, 
                    { color: request.status === 'Completed' ? colors.primary : colors.secondary }
                  ]}>{request.status}</Text>
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
    opacity: 0.8,
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
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
    marginBottom: 12,
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
    backgroundColor: colors.surface,
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
  requestServiceText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 2,
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
