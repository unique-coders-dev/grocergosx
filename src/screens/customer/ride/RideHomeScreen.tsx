import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { colors, shadows } from '../../../config/theme';
import { Button, Card, Badge, Input } from '../../../components/common/UI';
import { ServicePageHeader } from '../../../components/common/ServiceComponents';

const { width, height } = Dimensions.get('window');

const VEHICLE_TYPES = [
  { id: 'bike', name: 'Bike', icon: 'motorbike', price: 12.50, eta: '3 min', color: colors.primary },
  { id: 'car', name: 'Car', icon: 'car', price: 25.00, eta: '5 min', color: colors.accent },
  { id: 'premium', name: 'Premium', icon: 'car-back', price: 45.00, eta: '6 min', color: '#FFD700' },
  { id: 'suv', name: 'SUV', icon: 'car-estate', price: 35.00, eta: '8 min', color: colors.secondary },
];

export const RideHomeScreen = ({ navigation }: any) => {
  const [selectedType, setSelectedType] = useState('car');
  const [pickup, setPickup] = useState('Simpson Bay Yacht Club');
  const [destination, setDestination] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ServicePageHeader navigation={navigation} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.duration(600)} style={styles.titleSection}>
          <Text style={styles.title}>Ride Booking</Text>
          <Text style={styles.subtitle}>Fast and reliable rides across the island</Text>
        </Animated.View>

        {/* Map Preview */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: 18.0425,
              longitude: -63.0548,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          />
          <View style={styles.mapOverlay}>
            <TouchableOpacity style={styles.expandBtn} onPress={() => navigation.navigate('RideBooking')}>
              <MaterialCommunityIcons name="arrow-expand-all" size={20} color={colors.dark} />
              <Text style={styles.expandText}>Open Map</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Location Inputs */}
        <View style={styles.locationSection}>
          <Card style={styles.locationCard}>
            <View style={styles.locationRow}>
              <View style={styles.dotLineContainer}>
                <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                <View style={styles.line} />
                <View style={[styles.dot, { backgroundColor: colors.secondary }]} />
              </View>
              <View style={styles.inputsWrapper}>
                <TouchableOpacity style={styles.locationInput} onPress={() => {}}>
                  <Text style={styles.inputLabel}>Pickup Location</Text>
                  <Text style={styles.inputValue} numberOfLines={1}>{pickup}</Text>
                </TouchableOpacity>
                <View style={styles.inputDivider} />
                <TouchableOpacity style={styles.locationInput} onPress={() => {}}>
                  <Text style={styles.inputLabel}>Destination</Text>
                  <Text style={[styles.inputValue, !destination && { color: colors.grayLight }]} numberOfLines={1}>
                    {destination || 'Where are you going?'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        </View>

        {/* Vehicle Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Vehicle</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.vehicleScroll}>
            {VEHICLE_TYPES.map((type, index) => (
              <Animated.View 
                key={type.id} 
                entering={FadeInRight.delay(400 + index * 100).duration(600)}
              >
                <TouchableOpacity 
                  style={[
                    styles.vehicleCard, 
                    selectedType === type.id && { borderColor: type.color, backgroundColor: type.color + '05' }
                  ]}
                  onPress={() => setSelectedType(type.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.vehicleIconCircle, { backgroundColor: type.color + '15' }]}>
                    <MaterialCommunityIcons name={type.icon} size={32} color={type.color} />
                  </View>
                  <Text style={styles.vehicleName}>{type.name}</Text>
                  <Text style={styles.vehicleEta}>{type.eta}</Text>
                  <Text style={styles.vehiclePrice}>${type.price.toFixed(2)}</Text>
                  {selectedType === type.id && (
                    <View style={[styles.selectedBadge, { backgroundColor: type.color }]}>
                      <MaterialCommunityIcons name="check" size={12} color={colors.white} />
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <Card style={styles.paymentCard}>
            <View style={styles.paymentRow}>
              <MaterialCommunityIcons name="credit-card-outline" size={24} color={colors.primary} />
              <Text style={styles.paymentText}>Visa •••• 4242</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.grayLight} />
            </View>
          </Card>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Booking Button */}
      <View style={styles.bottomBar}>
        <Button 
          title="Confirm Ride Booking" 
          onPress={() => navigation.navigate('RideBooking')} 
          type="primary"
          size="large"
          icon="car-connected"
          style={styles.bookBtn}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: 20,
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
  mapContainer: {
    marginHorizontal: 24,
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    ...shadows.medium,
    marginTop: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    ...shadows.soft,
  },
  expandText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.dark,
    marginLeft: 6,
  },
  locationSection: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  locationCard: {
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.grayLightest,
  },
  locationRow: {
    flexDirection: 'row',
  },
  dotLineContainer: {
    width: 24,
    alignItems: 'center',
    paddingVertical: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.grayLighter,
    marginVertical: 4,
  },
  inputsWrapper: {
    flex: 1,
    marginLeft: 12,
  },
  locationInput: {
    paddingVertical: 4,
  },
  inputLabel: {
    fontSize: 11,
    color: colors.gray,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
    marginTop: 2,
  },
  inputDivider: {
    height: 1,
    backgroundColor: colors.grayLighter,
    marginVertical: 12,
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.dark,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  vehicleScroll: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    paddingVertical: 12,
  },
  vehicleCard: {
    width: 110,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: 16,
    alignItems: 'center',
    ...shadows.soft,
  },
  vehicleIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.dark,
  },
  vehicleEta: {
    fontSize: 11,
    color: colors.gray,
    marginTop: 2,
    fontWeight: '600',
  },
  vehiclePrice: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.primary,
    marginTop: 8,
  },
  selectedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  paymentCard: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.grayLightest,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    ...shadows.premium,
  },
  bookBtn: {
    width: '100%',
  },
});
