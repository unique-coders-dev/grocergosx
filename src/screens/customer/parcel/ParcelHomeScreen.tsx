import React from 'react';
import { View, StyleSheet, SafeAreaView, Image, ScrollView, Platform } from 'react-native';
import { Text, Button, List, Divider } from 'react-native-paper';
import { colors } from '../../../config/theme';

export const ParcelHomeScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="displaySmall" style={styles.title}>Parcel Delivery</Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Fast, reliable island-wide pickup and drop-off.
          </Text>
        </View>

        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800' }}
          style={styles.heroImage}
        />

        <View style={styles.infoSection}>
          <Text variant="titleLarge" style={styles.sectionTitle}>Our Service</Text>
          
          <List.Item
            title="Door-to-Door Delivery"
            description="We pick up from your location and deliver directly."
            left={props => <List.Icon {...props} icon="map-marker-distance" color={colors.primary} />}
          />
          <Divider />
          <List.Item
            title="Real-Time Tracking"
            description="Know exactly where your parcel is at every step."
            left={props => <List.Icon {...props} icon="crosshairs-gps" color={colors.primary} />}
          />
          <Divider />
          <List.Item
            title="Safe & Secure"
            description="Fragile or sensitive items? We handle with care."
            left={props => <List.Icon {...props} icon="shield-check" color={colors.primary} />}
          />
        </View>

        <View style={styles.sizeGuide}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Size Guide</Text>
          <View style={styles.sizeRow}>
            <View style={styles.sizeItem}>
              <Text variant="titleSmall">Small</Text>
              <Text variant="bodySmall">Envelope/Box</Text>
              <Text variant="titleMedium" style={styles.sizePrice}>$10</Text>
            </View>
            <View style={styles.sizeItem}>
              <Text variant="titleSmall">Medium</Text>
              <Text variant="bodySmall">Storage Bin</Text>
              <Text variant="titleMedium" style={styles.sizePrice}>$18</Text>
            </View>
            <View style={styles.sizeItem}>
              <Text variant="titleSmall">Large</Text>
              <Text variant="bodySmall">Furniture/TV</Text>
              <Text variant="titleMedium" style={styles.sizePrice}>$30+</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('ParcelBooking')}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Send a Parcel
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    padding: 24,
  },
  title: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSecondary,
  },
  heroImage: {
    width: '100%',
    height: 200,
  },
  infoSection: {
    padding: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginVertical: 16,
    marginLeft: 8,
  },
  sizeGuide: {
    padding: 16,
    backgroundColor: colors.surface,
    margin: 16,
    borderRadius: 16,
  },
  sizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  sizeItem: {
    alignItems: 'center',
    flex: 1,
  },
  sizePrice: {
    color: colors.primary,
    fontWeight: '700',
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  button: {
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  buttonContent: {
    height: 56,
  },
});
