import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, shadows } from '../../../config/theme';
import { Card, Badge } from '../../../components/common/UI';
import { ServicePageHeader } from '../../../components/common/ServiceComponents';

const { width } = Dimensions.get('window');

const ALL_SERVICES = [
  {
    id: 'grocery',
    title: 'Grocery Shopping',
    subtitle: 'Fresh Essentials Delivered',
    description: 'We shop and deliver fresh groceries from your favorite local stores directly to your home.',
    icon: 'cart-variant',
    color: colors.primary,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800',
    route: 'GroceryHome',
    tag: 'Daily'
  },
  {
    id: 'laundry',
    title: 'Laundry Service',
    subtitle: 'Professional Garment Care',
    description: 'Expert wash, fold, and ironing services with island-wide pickup and next-day delivery.',
    icon: 'washing-machine',
    color: colors.secondary,
    image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=800',
    route: 'LaundryHome',
    tag: 'Next Day'
  },
  {
    id: 'parcel',
    title: 'Parcel Delivery',
    subtitle: 'Island-wide Courier',
    description: 'Secure and reliable courier services for documents, packages, and gifts across St. Maarten.',
    icon: 'truck-fast',
    color: colors.accent,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800',
    route: 'ParcelHome',
    tag: 'Reliable'
  }
];

export const ServicesScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <ServicePageHeader navigation={navigation} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.duration(600)} style={styles.titleSection}>
          <Text style={styles.headerTitle}>Premium Services</Text>
          <Text style={styles.headerSubtitle}>Excellence in every delivery</Text>
        </Animated.View>

        {ALL_SERVICES.map((service, index) => (
          <Animated.View 
            key={service.id}
            entering={FadeInDown.delay(200 + index * 100).duration(800)}
          >
            <Card 
              style={styles.serviceCard}
              onPress={() => navigation.navigate(service.route)}
            >
              <FastImage source={{ uri: service.image }} style={styles.cardImage} />
              <View style={styles.fullOverlay}>
                <View style={[styles.iconBox, { backgroundColor: service.color }]}>
                  <MaterialCommunityIcons name={service.icon} size={32} color={colors.white} />
                </View>
                
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                
                <View style={styles.badgeContainer}>
                  <Badge label={service.tag} color={service.color} />
                </View>
              </View>
            </Card>
          </Animated.View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  titleSection: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.dark,
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.gray,
    marginTop: 4,
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  serviceCard: {
    padding: 0,
    height: 300,
    marginBottom: 24,
    marginHorizontal: 24,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 0,
    ...shadows.premium,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  fullOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...shadows.medium,
  },
  serviceTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  serviceSubtitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 4,
    marginBottom: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  serviceDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  badgeContainer: {
    marginTop: 20,
  },
});
