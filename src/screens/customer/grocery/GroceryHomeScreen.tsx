import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import FastImage from 'react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { getProducts } from '../../../api/grocery';
import { ProductCard } from '../../../components/grocery/ProductCard';
import { colors, shadows } from '../../../config/theme';
import { useCartStore } from '../../../store/cartStore';
import { useAuthStore } from '../../../store/authStore';
import { Button, Card, Badge, Input, Skeleton } from '../../../components/common/UI';
import { 
  ServicePageHeader, 
  AddressSelector, 
  CategoryChips, 
} from '../../../components/common/ServiceComponents';

const { width } = Dimensions.get('window');

const GROCERY_CATEGORIES = ['All', 'Produce', 'Dairy', 'Snacks', 'Drinks', 'Household'];

const SHOP_BY_CATEGORY = [
  { id: '1', name: 'Produce', imageUri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200' },
  { id: '2', name: 'Breakfast', imageUri: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=200' },
  { id: '3', name: 'Beverages', imageUri: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=200' },
  { id: '4', name: 'Snacks', imageUri: 'https://images.unsplash.com/photo-1599490659223-e153c07dc4c4?q=80&w=200' },
];

const QUICK_ADD = [
  { id: '1', name: 'Avocados', price: 1.79, unit: 'each', imageUri: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=200' },
  { id: '2', name: 'Yogurt', price: 1.49, unit: 'cup', imageUri: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=200' },
  { id: '3', name: 'Cheddar Cheese', price: 2.99, unit: 'block', imageUri: 'https://images.unsplash.com/photo-1485962391905-2d793ad41e92?q=80&w=200' },
  { id: '4', name: 'Paper Towels', price: 4.49, unit: 'roll', imageUri: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d1a?q=80&w=200' },
];

export const GroceryHomeScreen = ({ navigation }: any) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const cartItemsCount = useCartStore((state) => state.items.length);

  const {
    data: products,
    isLoading: productsLoading,
    refetch: refetchProducts,
    isRefetching: productsRefetching,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = () => {
    refetchProducts();
  };

  const essentials = products?.slice(0, 4) || [];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ServicePageHeader navigation={navigation} cartCount={cartItemsCount} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={{ paddingHorizontal: 24, marginTop: 12 }}>
            <Skeleton width="70%" height={32} style={{ marginBottom: 24 }} />
            <Skeleton width="100%" height={80} style={{ borderRadius: 20, marginBottom: 24 }} />
            <Skeleton width="100%" height={56} style={{ borderRadius: 18, marginBottom: 24 }} />
            <Skeleton width="100%" height={180} style={{ borderRadius: 24, marginBottom: 32 }} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 }}>
              <View style={{ width: '50%', padding: 8 }}><Skeleton width="100%" height={220} style={{ borderRadius: 20 }} /></View>
              <View style={{ width: '50%', padding: 8 }}><Skeleton width="100%" height={220} style={{ borderRadius: 20 }} /></View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ServicePageHeader navigation={navigation} cartCount={cartItemsCount} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={productsRefetching} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <Animated.View entering={FadeInDown.duration(600)} style={styles.titleSection}>
          <Text style={styles.title}>Grocery Shopping</Text>
          <Text style={styles.subtitle}>Fresh items delivered to your doorstep</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <AddressSelector label="Deliver to" address={user?.address || 'Simpson Bay, St. Maarten'} />
          <View style={styles.searchContainer}>
            <Input icon="magnify" placeholder="Search groceries, drinks, or essentials..." />
          </View>
          <CategoryChips 
            categories={GROCERY_CATEGORIES} 
            activeCategory={activeCategory} 
            onSelect={setActiveCategory} 
          />
        </Animated.View>

        {/* Hero Banner */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.bannerContainer}>
          <Card style={styles.bannerCard} onPress={() => {}}>
            <FastImage 
              source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800' }} 
              style={styles.bannerImage} 
            />
            <View style={styles.bannerOverlay}>
              <Badge label="Fresh Daily" color={colors.primary} style={{ marginBottom: 8 }} />
              <Text style={styles.bannerTitle}>Organic Produce</Text>
              <Text style={styles.bannerSubtitle}>Up to 20% off this weekend</Text>
            </View>
          </Card>
        </Animated.View>

        {/* Popular Essentials */}
        <View style={styles.section}>
          <View style={styles.rowHeader}>
            <Text style={styles.sectionHeader}>Popular Essentials</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
          </View>
          <View style={styles.essentialsGrid}>
            {essentials.map((item, index) => (
              <Animated.View 
                key={item.id} 
                entering={FadeInDown.delay(500 + index * 100).duration(600)}
                style={styles.essentialItem}
              >
                <ProductCard
                  product={item}
                  onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                />
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Shop by Category */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Shop by Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {SHOP_BY_CATEGORY.map((cat, index) => (
              <Animated.View 
                key={cat.id} 
                entering={FadeInRight.delay(600 + index * 100).duration(600)}
                style={styles.categoryCard}
              >
                <Card style={styles.catCard} onPress={() => {}}>
                  <FastImage source={{ uri: cat.imageUri }} style={styles.categoryImage} />
                  <Text style={styles.categoryTitle}>{cat.name}</Text>
                </Card>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Quick Add */}
        <View style={[styles.section, { marginBottom: 40 }]}>
          <Text style={styles.sectionHeader}>Quick Add</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {QUICK_ADD.map((item, index) => (
              <Animated.View 
                key={item.id} 
                entering={FadeInRight.delay(800 + index * 100).duration(600)}
              >
                <Card style={styles.quickAddCard} onPress={() => {}}>
                  <FastImage source={{ uri: item.imageUri }} style={styles.quickAddImage} />
                  <View style={styles.quickAddInfo}>
                    <Text style={styles.quickAddName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.quickAddPrice}>${item.price} <Text style={{ fontWeight: '400', fontSize: 10 }}>/ {item.unit}</Text></Text>
                  </View>
                  <View style={styles.quickAddBtn}>
                    <MaterialCommunityIcons name="plus" size={18} color={colors.primary} />
                  </View>
                </Card>
              </Animated.View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {cartItemsCount > 0 && (
        <Animated.View entering={FadeInDown} style={styles.fabContainer}>
          <TouchableOpacity 
            style={styles.fab}
            onPress={() => navigation.navigate('Cart')}
          >
            <MaterialCommunityIcons name="shopping" size={28} color={colors.white} />
            <View style={styles.fabBadge}>
              <Text style={styles.fabBadgeText}>{cartItemsCount}</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
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
  searchContainer: {
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 8,
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
    letterSpacing: -0.3,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAll: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  essentialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  essentialItem: {
    width: '50%',
    paddingHorizontal: 8,
  },
  horizontalScroll: {
    paddingRight: 24,
    paddingVertical: 12,
  },
  categoryCard: {
    marginRight: 16,
  },
  catCard: {
    width: 110,
    padding: 0,
    overflow: 'hidden',
    borderRadius: 20,
    alignItems: 'center',
    paddingBottom: 12,
  },
  categoryImage: {
    width: '100%',
    height: 80,
    backgroundColor: colors.surface,
  },
  categoryTitle: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '700',
    color: colors.dark,
  },
  quickAddCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 12,
    marginRight: 16,
    width: 200,
    borderWidth: 0,
    ...shadows.soft,
  },
  quickAddImage: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  quickAddInfo: {
    flex: 1,
    marginLeft: 12,
  },
  quickAddName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
  },
  quickAddPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 2,
  },
  quickAddBtn: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  fabBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  fabBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
  },
});
