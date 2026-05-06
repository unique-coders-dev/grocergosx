import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../config/theme';

export const ServicesScreen = ({ navigation }: any) => {
  const services = [
    {
      id: 'grocery',
      title: 'Grocery Shopping',
      subtitle: 'Essentials delivered to your door',
      icon: 'cart',
      color: '#EB1414',
      route: 'GroceryHome',
    },
    {
      id: 'laundry',
      title: 'Laundry Services',
      subtitle: 'Wash, dry & fold pickup',
      icon: 'washing-machine',
      color: '#2196F3',
      route: 'LaundryHome',
    },
    {
      id: 'parcel',
      title: 'Parcel Delivery',
      subtitle: 'Island-wide courier service',
      icon: 'truck-delivery',
      color: '#4CAF50',
      route: 'ParcelHome',
    },
    {
      id: 'stocking',
      title: 'Pre-Arrival Stocking',
      subtitle: 'Fill your fridge before you arrive',
      icon: 'fridge',
      color: '#FF9800',
      route: 'PreArrival',
    },
  ];

  const ServiceCard = ({ service }: { service: any }) => (
    <Card 
      style={styles.card} 
      onPress={() => navigation.navigate(service.route)}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: service.color + '15' }]}>
          <MaterialCommunityIcons name={service.icon} size={32} color={service.color} />
        </View>
        <View style={styles.textContainer}>
          <Text variant="titleMedium" style={styles.serviceTitle}>{service.title}</Text>
          <Text variant="bodySmall" style={styles.serviceSubtitle}>{service.subtitle}</Text>
        </View>
        <IconButton icon="chevron-right" iconColor={colors.border} />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="displaySmall" style={styles.headerTitle}>Our Services</Text>
        <Text variant="bodyLarge" style={styles.headerSubtitle}>
          Select a service to get started
        </Text>
        
        <View style={styles.grid}>
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    padding: 24,
  },
  headerTitle: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    color: colors.textSecondary,
    marginBottom: 30,
  },
  grid: {
    gap: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  serviceTitle: {
    fontWeight: '600',
  },
  serviceSubtitle: {
    color: colors.textSecondary,
  },
});
