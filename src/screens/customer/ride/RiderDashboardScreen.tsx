import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors, shadows } from '../../../config/theme';
import { Card, Badge, Button } from '../../../components/common/UI';

const { width, height } = Dimensions.get('window');

export const RiderDashboardScreen = ({ navigation }: any) => {
  const [isOnline, setIsOnline] = useState(false);
  const [activeRequest, setActiveRequest] = useState<any>(null);

  useEffect(() => {
    if (isOnline && !activeRequest) {
      // Simulate receiving a request after 5 seconds of being online
      const timer = setTimeout(() => {
        setActiveRequest({
          id: 'REQ-9921',
          customer: 'John Doe',
          pickup: 'Simpson Bay Yacht Club',
          destination: 'Princess Juliana Airport',
          price: 25.00,
          distance: '4.2 km',
        });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, activeRequest]);

  return (
    <View style={styles.container}>
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
        {isOnline && (
          <Marker coordinate={{ latitude: 18.0425, longitude: -63.0548 }}>
            <View style={styles.riderMarker}>
              <MaterialCommunityIcons name="car" size={24} color={colors.white} />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Rider Header Overlay */}
      <SafeAreaView style={styles.headerOverlay}>
        <Card style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.statusTitle}>{isOnline ? 'You are Online' : 'You are Offline'}</Text>
              <Text style={styles.statusSubtitle}>{isOnline ? 'Waiting for requests...' : 'Go online to start earning'}</Text>
            </View>
            <Switch 
              value={isOnline} 
              onValueChange={setIsOnline} 
              trackColor={{ false: colors.grayLighter, true: colors.primary + '50' }}
              thumbColor={isOnline ? colors.primary : colors.gray}
            />
          </View>
        </Card>
      </SafeAreaView>

      {/* New Request Popup */}
      {activeRequest && (
        <View style={styles.requestOverlay}>
          <Animated.View entering={FadeInUp} style={styles.requestCard}>
            <Badge label="New Ride Request" color={colors.accent} style={styles.requestBadge} />
            <Text style={styles.customerName}>{activeRequest.customer}</Text>
            
            <View style={styles.routeSection}>
              <View style={styles.dotLineContainer}>
                <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                <View style={styles.line} />
                <View style={[styles.dot, { backgroundColor: colors.secondary }]} />
              </View>
              <View style={styles.locationsWrapper}>
                <Text style={styles.locationText} numberOfLines={1}>{activeRequest.pickup}</Text>
                <Text style={styles.locationText} numberOfLines={1}>{activeRequest.destination}</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Distance</Text>
                <Text style={styles.statValue}>{activeRequest.distance}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Earnings</Text>
                <Text style={[styles.statValue, { color: colors.primary }]}>${activeRequest.price.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <Button 
                title="Decline" 
                onPress={() => setActiveRequest(null)} 
                type="outline"
                style={styles.actionBtn}
                textColor={colors.error}
              />
              <Button 
                title="Accept Ride" 
                onPress={() => {}} 
                type="primary"
                style={[styles.actionBtn, { flex: 2 }]}
              />
            </View>
          </Animated.View>
        </View>
      )}

      {/* Earnings Summary (Bottom) */}
      {!activeRequest && (
        <View style={styles.bottomOverlay}>
          <Card style={styles.earningsCard}>
            <View style={styles.earningsHeader}>
              <Text style={styles.earningsLabel}>Today's Earnings</Text>
              <Text style={styles.earningsValue}>$124.50</Text>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Rides</Text>
                <Text style={styles.gridValue}>12</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Hours</Text>
                <Text style={styles.gridValue}>5.4</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Rating</Text>
                <Text style={styles.gridValue}>4.9</Text>
              </View>
            </View>
          </Card>
        </View>
      )}
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
  riderMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    ...shadows.medium,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingTop: 50,
  },
  statusCard: {
    borderRadius: 24,
    padding: 20,
    ...shadows.premium,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.dark,
  },
  statusSubtitle: {
    fontSize: 13,
    color: colors.gray,
    marginTop: 2,
    fontWeight: '600',
  },
  requestOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  requestCard: {
    backgroundColor: colors.white,
    borderRadius: 32,
    padding: 24,
    ...shadows.premium,
  },
  requestBadge: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  customerName: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 20,
  },
  routeSection: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dotLineContainer: {
    width: 20,
    alignItems: 'center',
    paddingVertical: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  line: {
    width: 2,
    height: 24,
    backgroundColor: colors.grayLighter,
    marginVertical: 4,
  },
  locationsWrapper: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  locationText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.dark,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
  },
  earningsCard: {
    borderRadius: 32,
    padding: 24,
    ...shadows.premium,
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  earningsLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray,
  },
  earningsValue: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.grayLighter,
    paddingTop: 16,
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
  },
  gridLabel: {
    fontSize: 11,
    color: colors.gray,
    fontWeight: '600',
  },
  gridValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.dark,
    marginTop: 2,
  },
});
