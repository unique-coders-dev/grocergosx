import React from 'react';
import { View, StyleSheet, SafeAreaView, Image, ScrollView, Platform } from 'react-native';
import { Text, Button, List, Divider } from 'react-native-paper';
import { colors } from '../../../config/theme';

export const LaundryHomeScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="displaySmall" style={styles.title}>Laundry Service</Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Professional wash, dry, and fold delivered to your door.
          </Text>
        </View>

        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&q=80&w=800' }}
          style={styles.heroImage}
        />

        <View style={styles.infoSection}>
          <Text variant="titleLarge" style={styles.sectionTitle}>How it Works</Text>
          
          <List.Item
            title="1. Schedule a Pickup"
            description="Choose a convenient time for us to collect your laundry."
            left={props => <List.Icon {...props} icon="calendar-clock" color={colors.primary} />}
          />
          <Divider />
          <List.Item
            title="2. We Collect & Clean"
            description="Minimum 10 lbs. We handle your clothes with care."
            left={props => <List.Icon {...props} icon="washing-machine" color={colors.primary} />}
          />
          <Divider />
          <List.Item
            title="3. Next-Day Delivery"
            description="Fresh, folded clothes returned to you within 24 hours."
            left={props => <List.Icon {...props} icon="truck-delivery" color={colors.primary} />}
          />
        </View>

        <View style={styles.pricingCard}>
          <Text variant="titleMedium" style={styles.pricingTitle}>Simple Pricing</Text>
          <Text variant="displaySmall" style={styles.price}>$2.50<Text variant="titleMedium">/lb</Text></Text>
          <Text variant="bodySmall" style={styles.minOrder}>Minimum order: 10 lbs ($25.00)</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('LaundrySchedule')}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Schedule Pickup
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
  pricingCard: {
    margin: 24,
    padding: 24,
    backgroundColor: colors.surface,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pricingTitle: {
    color: colors.textSecondary,
    marginBottom: 8,
  },
  price: {
    fontWeight: '700',
    color: colors.primary,
  },
  minOrder: {
    marginTop: 8,
    color: colors.textSecondary,
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
