import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors, shadows } from '../../../config/theme';
import { Button, Card, Badge } from '../../../components/common/UI';

const { width, height } = Dimensions.get('window');

export const RideBookingScreen = ({ navigation }: any) => {
  const [bookingStatus, setBookingStatus] = useState<'searching' | 'confirmed' | 'arrived'>('searching');
  const [driver, setDriver] = useState<any>(null);

  useEffect(() => {
    if (bookingStatus === 'searching') {
      const timer = setTimeout(() => {
        setBookingStatus('confirmed');
        setDriver({
          name: 'Ricardo M.',
          rating: 4.9,
          car: 'White Toyota Corolla',
          plate: 'SXM-2938',
          image: 'https://i.pravatar.cc/150?u=ricardo',
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [bookingStatus]);

  return (
    <View style={styles.container}>
      {/* Full Screen Map */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 18.0425,
          longitude: -63.0548,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker 
          coordinate={{ latitude: 18.0425, longitude: -63.0548 }}
          title="Pickup"
        >
          <View style={[styles.markerCircle, { backgroundColor: colors.primary }]}>
            <View style={styles.markerInner} />
          </View>
        </Marker>
        <Marker 
          coordinate={{ latitude: 18.0525, longitude: -63.0648 }}
          title="Destination"
        >
          <View style={[styles.markerCircle, { backgroundColor: colors.secondary }]}>
            <View style={styles.markerInner} />
          </View>
        </Marker>

        {bookingStatus === 'confirmed' && (
          <Marker 
            coordinate={{ latitude: 18.0455, longitude: -63.0588 }}
            rotation={45}
          >
            <MaterialCommunityIcons name="car" size={32} color={colors.accent} />
          </Marker>
        )}
      </MapView>

      {/* Top Header Overlay */}
      <SafeAreaView style={styles.headerOverlay}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color={colors.dark} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerStatus}>
            {bookingStatus === 'searching' ? 'Searching for Rider...' : 'Rider is on the way'}
          </Text>
        </View>
      </SafeAreaView>

      {/* Bottom Booking Status Overlay */}
      <View style={styles.bottomOverlay}>
        {bookingStatus === 'searching' ? (
          <Animated.View entering={FadeInUp} style={styles.searchingCard}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.searchingTitle}>Finding your rider</Text>
            <Text style={styles.searchingSubtitle}>Connecting with drivers in Simpson Bay...</Text>
            <TouchableOpacity 
              style={styles.cancelBtn} 
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelText}>Cancel Request</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInUp} style={styles.driverCard}>
            <View style={styles.cardHeader}>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{driver?.name}</Text>
                <View style={styles.ratingRow}>
                  <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
                  <Text style={styles.ratingText}>{driver?.rating}</Text>
                </View>
              </View>
              <View style={styles.carInfo}>
                <Text style={styles.carModel}>{driver?.car}</Text>
                <Badge label={driver?.plate} color={colors.accent} />
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionBtn}>
                <MaterialCommunityIcons name="phone" size={24} color={colors.primary} />
                <Text style={styles.actionText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <MaterialCommunityIcons name="message-text" size={24} color={colors.primary} />
                <Text style={styles.actionText}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <MaterialCommunityIcons name="shield-check" size={24} color={colors.primary} />
                <Text style={styles.actionText}>Safety</Text>
              </TouchableOpacity>
            </View>

            <Button 
              title="Track Ride" 
              onPress={() => {}} 
              type="primary"
              style={styles.trackBtn}
            />
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    ...shadows.medium,
  },
  markerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    ...shadows.medium,
  },
  headerStatus: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.dark,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  searchingCard: {
    backgroundColor: colors.white,
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    ...shadows.premium,
  },
  searchingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.dark,
    marginTop: 20,
  },
  searchingSubtitle: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 8,
    textAlign: 'center',
  },
  cancelBtn: {
    marginTop: 24,
    padding: 12,
  },
  cancelText: {
    color: colors.error,
    fontWeight: '700',
    fontSize: 14,
  },
  driverCard: {
    backgroundColor: colors.white,
    borderRadius: 32,
    padding: 24,
    ...shadows.premium,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.dark,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray,
    marginLeft: 4,
  },
  carInfo: {
    alignItems: 'flex-end',
  },
  carModel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.grayLighter,
    marginVertical: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gray,
    marginTop: 6,
  },
  trackBtn: {
    width: '100%',
  },
});
