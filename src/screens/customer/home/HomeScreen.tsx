import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import { Text, Portal, Modal, IconButton } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import Animated, { 
  FadeInDown, 
  FadeInRight,
} from 'react-native-reanimated';
import { colors, shadows } from '../../../config/theme';
import { useAuthStore } from '../../../store/authStore';
import { HomeHeader, WelcomeSection, SearchSection, SectionHeader } from '../../../components/home/HomeComponents';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../../api/grocery';
import { ProductCard } from '../../../components/grocery/ProductCard';
import { Button, Card, Badge, Input, Skeleton } from '../../../components/common/UI';
import { CategoryChips } from '../../../components/common/ServiceComponents';

const { width } = Dimensions.get('window');

const PROMO_BANNERS = [
  { id: '1' },
  { id: '2' },
  { id: '3' },
];

const SERVICES = [
  { 
    id: 'grocery', 
    title: 'Grocery', 
    icon: 'cart-variant', 
    color: colors.primary, 
    thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200',
    route: 'GroceryHome' 
  },
  { 
    id: 'laundry', 
    title: 'Laundry', 
    icon: 'washing-machine', 
    color: colors.secondary, 
    thumbnail: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=200',
    route: 'LaundryHome' 
  },
  { 
    id: 'parcel', 
    title: 'Parcel', 
    icon: 'truck-fast', 
    color: colors.accent, 
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=200',
    route: 'ParcelHome' 
  },
  { 
    id: 'ride', 
    title: 'Ride', 
    icon: 'car-connected', 
    color: colors.accent, 
    thumbnail: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=200',
    route: 'RideHome' 
  },
];

const DUMMY_PRODUCTS = [
  { id: 'p1', name: 'Fresh Avocado', price: 2.99, unit: '1 piece', imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=400' },
  { id: 'p2', name: 'Organic Bananas', price: 1.50, unit: '1 kg', imageUrl: 'https://images.unsplash.com/photo-1603833665858-e81b1c7e4620?q=80&w=400' },
  { id: 'p3', name: 'Red Apples', price: 3.20, unit: '1 kg', imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=400' },
  { id: 'p4', name: 'Whole Milk', price: 4.50, unit: '1 gallon', imageUrl: 'https://images.unsplash.com/photo-1563636619-e91084b05963?q=80&w=400' },
];

const CATEGORIES = ['All', 'Fast Food', 'Groceries', 'Pharmacy', 'Laundry', 'Parcel'];

export const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentLocation, setCurrentLocation] = useState(user?.address || 'Simpson Bay, St. Maarten');
  const [filterVisible, setFilterVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const { data: products } = useQuery({
    queryKey: ['popular_products'],
    queryFn: () => getProducts(),
  });

  const handleAddressPress = () => {
    Alert.alert(
      'Select Location',
      'Choose your delivery area',
      [
        { text: 'Simpson Bay', onPress: () => setCurrentLocation('Simpson Bay, St. Maarten') },
        { text: 'Philipsburg', onPress: () => setCurrentLocation('Philipsburg, St. Maarten') },
        { text: 'Maho', onPress: () => setCurrentLocation('Maho, St. Maarten') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const popularItems = searchQuery ? (products?.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 4) || []) : DUMMY_PRODUCTS;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <HomeHeader />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={{ paddingHorizontal: 24, marginTop: 12 }}>
            <Skeleton width="60%" height={32} style={{ marginBottom: 8 }} />
            <Skeleton width="40%" height={16} style={{ marginBottom: 24 }} />
            <Skeleton width="100%" height={56} style={{ borderRadius: 18, marginBottom: 24 }} />
            <Skeleton width="100%" height={180} style={{ borderRadius: 24, marginBottom: 32 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Skeleton width="30%" height={100} style={{ borderRadius: 16 }} />
              <Skeleton width="30%" height={100} style={{ borderRadius: 16 }} />
              <Skeleton width="30%" height={100} style={{ borderRadius: 16 }} />
            </View>
            <View style={{ marginTop: 32 }}>
              <Skeleton width="50%" height={24} style={{ marginBottom: 16 }} />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 }}>
                <View style={{ width: '50%', padding: 8 }}><Skeleton width="100%" height={200} style={{ borderRadius: 20 }} /></View>
                <View style={{ width: '50%', padding: 8 }}><Skeleton width="100%" height={200} style={{ borderRadius: 20 }} /></View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(600)}>
          <WelcomeSection 
            name={user?.name || 'Guest'} 
            address={currentLocation} 
            onAddressPress={handleAddressPress}
          />
          {/* Rider Mode Toggle (Demo Shortcut) */}
          <View style={{ paddingHorizontal: 24, marginTop: -10, marginBottom: 20 }}>
            <TouchableOpacity 
              style={styles.riderToggle}
              onPress={() => navigation.navigate('RiderDashboard')}
            >
              <MaterialCommunityIcons name="bike-fast" size={20} color={colors.white} />
              <Text style={styles.riderToggleText}>Switch to Rider Mode</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <SearchSection 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            onFilterPress={() => setFilterVisible(true)}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <CategoryChips 
            categories={CATEGORIES} 
            activeCategory={activeCategory} 
            onSelect={setActiveCategory} 
          />
        </Animated.View>

        <View style={styles.servicesSection}>
          <SectionHeader title="Our Services" />
          <View style={styles.servicesRow}>
            {SERVICES.map((service, index) => (
              <Animated.View 
                key={service.id} 
                entering={FadeInDown.delay(400 + index * 100).duration(600)}
                style={styles.serviceItem}
              >
                <Card 
                  style={styles.serviceCard}
                  onPress={() => navigation.navigate('HomeTab', { screen: service.route })}
                >
                  <FastImage source={{ uri: service.thumbnail }} style={styles.serviceThumbnail} />
                  <View style={[styles.serviceGradient, { backgroundColor: 'rgba(0,0,0,0.45)' }]}>
                    <View style={[styles.serviceIconCircle, { backgroundColor: service.color }]}>
                      <MaterialCommunityIcons name={service.icon} size={18} color={colors.white} />
                    </View>
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                  </View>
                </Card>
              </Animated.View>
            ))}
          </View>
        </View>

        <View style={styles.promoSection}>
          <SectionHeader title="Exclusive Offers" />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promoScrollContent}
            snapToInterval={width * 0.7 + 16}
            decelerationRate="fast"
          >
            {PROMO_BANNERS.map((banner, index) => (
              <Animated.View 
                key={banner.id}
                entering={FadeInRight.delay(600 + index * 100).duration(800)}
              >
                <Card style={styles.bannerCard} onPress={() => {}}>
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800' }} 
                    style={styles.bannerImage} 
                    resizeMode="cover"
                  />
                </Card>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.popularSection}>
          <SectionHeader 
            title="Popular Today" 
            onSeeAll={() => navigation.navigate('GroceryHome')} 
          />
          <View style={styles.popularGrid}>
            {popularItems.map((item: any, index: number) => (
              <Animated.View 
                key={item.id} 
                entering={FadeInDown.delay(800 + index * 100).duration(600)}
                style={styles.productWrapper}
              >
                <ProductCard 
                  product={item} 
                  onPress={() => navigation.navigate('ProductDetail', { productId: item.id })} 
                />
              </Animated.View>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <Portal>
        <Modal
          visible={filterVisible}
          onDismiss={() => setFilterVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Refine Search</Text>
            <IconButton icon="close" size={24} onPress={() => setFilterVisible(false)} />
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalLabel}>Price Range</Text>
            <View style={styles.modalRow}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Input placeholder="Min ($)" keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <Input placeholder="Max ($)" keyboardType="numeric" />
              </View>
            </View>

            <Text style={styles.modalLabel}>Category</Text>
            <View style={styles.modalChips}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity 
                  key={cat} 
                  style={[styles.modalChip, activeCategory === cat && styles.modalActiveChip]}
                  onPress={() => setActiveCategory(cat)}
                >
                  <Text style={[styles.modalChipText, activeCategory === cat && styles.modalActiveChipText]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button 
              title="Apply Filters" 
              onPress={() => setFilterVisible(false)}
              style={{ marginTop: 24 }}
            />
          </ScrollView>
        </Modal>
      </Portal>
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
  riderToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignSelf: 'flex-start',
    ...shadows.soft,
  },
  riderToggleText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 8,
  },
  servicesSection: {
    marginTop: 24,
  },
  servicesRow: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  serviceItem: {
    width: (width - 60) / 2,
    marginBottom: 4,
  },
  serviceCard: {
    padding: 0,
    height: 120,
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 0,
    ...shadows.soft,
  },
  serviceThumbnail: {
    width: '100%',
    height: '100%',
  },
  serviceGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    ...shadows.soft,
  },
  serviceTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
  },
  promoSection: {
    marginTop: 32,
  },
  promoScrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  bannerCard: {
    width: width * 0.7,
    height: 180,
    padding: 0,
    marginRight: 16,
    overflow: 'hidden',
    borderRadius: 24,
    borderWidth: 0,
    ...shadows.medium,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  popularSection: {
    marginTop: 32,
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  productWrapper: {
    width: '50%',
    paddingHorizontal: 8,
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: 24,
    margin: 20,
    borderRadius: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.dark,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
    marginTop: 16,
    marginBottom: 12,
  },
  modalRow: {
    flexDirection: 'row',
  },
  modalChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  modalChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.surface,
    margin: 4,
    borderWidth: 1,
    borderColor: colors.grayLighter,
  },
  modalActiveChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modalChipText: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: '700',
  },
  modalActiveChipText: {
    color: colors.white,
  },
});
