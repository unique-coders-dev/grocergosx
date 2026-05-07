import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, shadows } from '../../../config/theme';
import { Card, Button, Input, Badge } from '../../../components/common/UI';
import { ServicePageHeader } from '../../../components/common/ServiceComponents';

const parcelSchema = z.object({
  senderAddress: z.string().min(5, 'Required'),
  recipientName: z.string().min(2, 'Required'),
  recipientPhone: z.string().min(10, 'Required'),
  recipientAddress: z.string().min(5, 'Required'),
  notes: z.string().optional(),
});

type ParcelFormData = z.infer<typeof parcelSchema>;

export const ParcelBookingScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [parcelSize, setParcelSize] = useState('Small');
  const [timeSlot, setTimeSlot] = useState('morning');

  const sizePrices: { [key: string]: number } = {
    Small: 10,
    Medium: 18,
    Large: 30,
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ParcelFormData>({
    resolver: zodResolver(parcelSchema),
    defaultValues: {
      senderAddress: 'Simpson Bay, Yacht Club',
      recipientName: '',
      recipientPhone: '',
      recipientAddress: '',
      notes: '',
    },
  });

  const onSubmit = async (data: ParcelFormData) => {
    setLoading(true);
    try {
      const orderData = {
        type: 'parcel',
        customerId: auth().currentUser?.uid,
        status: 'booked',
        senderAddress: data.senderAddress,
        recipientName: data.recipientName,
        recipientPhone: data.recipientPhone,
        recipientAddress: data.recipientAddress,
        parcelSize: parcelSize,
        pickupTime: timeSlot,
        totalAmount: sizePrices[parcelSize],
        paymentStatus: 'paid',
        notes: data.notes,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await firestore().collection('parcel_deliveries').add(orderData);
      await firestore().collection('orders').doc(docRef.id).set({
        ...orderData,
        orderId: docRef.id,
      });

      navigation.navigate('OrderConfirmation', { orderId: docRef.id });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to book delivery');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ServicePageHeader navigation={navigation} title="Booking" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(600)}>
            <Text style={styles.title}>Parcel Details</Text>
            <Text style={styles.subtitle}>Tell us about your package and destination</Text>
          </Animated.View>

          <View style={styles.section}>
            <Text style={styles.label}>Sender Information</Text>
            <Controller
              control={control}
              name="senderAddress"
              render={({ field: { onChange, value } }) => (
                <Input
                  icon="map-marker-outline"
                  placeholder="Pickup Address"
                  value={value}
                  onChangeText={onChange}
                  error={errors.senderAddress}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Recipient Information</Text>
            <Controller
              control={control}
              name="recipientName"
              render={({ field: { onChange, value } }) => (
                <Input
                  icon="account-outline"
                  placeholder="Recipient Name"
                  value={value}
                  onChangeText={onChange}
                  error={errors.recipientName}
                />
              )}
            />
            <View style={{ height: 12 }} />
            <Controller
              control={control}
              name="recipientPhone"
              render={({ field: { onChange, value } }) => (
                <Input
                  icon="phone-outline"
                  placeholder="Recipient Phone"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                  error={errors.recipientPhone}
                />
              )}
            />
            <View style={{ height: 12 }} />
            <Controller
              control={control}
              name="recipientAddress"
              render={({ field: { onChange, value } }) => (
                <Input
                  icon="map-marker-check-outline"
                  placeholder="Delivery Address"
                  value={value}
                  onChangeText={onChange}
                  error={errors.recipientAddress}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Parcel Size</Text>
            <View style={styles.selectionRow}>
              {['Small', 'Medium', 'Large'].map((size) => (
                <TouchableOpacity 
                  key={size}
                  style={[styles.selectionCard, parcelSize === size && styles.activeSelection]}
                  onPress={() => setParcelSize(size)}
                >
                  <Text style={[styles.selectionText, parcelSize === size && styles.activeSelectionText]}>{size}</Text>
                  <Text style={[styles.selectionPrice, parcelSize === size && styles.activeSelectionText]}>${sizePrices[size]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Notes</Text>
            <Controller
              control={control}
              name="notes"
              render={({ field: { onChange, value } }) => (
                <Input
                  icon="note-text-outline"
                  placeholder="Fragile, beware of dog, etc."
                  value={value}
                  onChangeText={onChange}
                  multiline
                  style={{ height: 100, alignItems: 'flex-start', paddingTop: 12 }}
                />
              )}
            />
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>

        <Card style={styles.footer}>
          <View style={styles.priceContainer}>
            <View>
              <Text style={styles.priceLabel}>Total Price</Text>
              <Text style={styles.priceValue}>${sizePrices[parcelSize].toFixed(2)}</Text>
            </View>
            <Button
              title="Book Delivery"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={loading}
              style={{ flex: 1, marginLeft: 24 }}
            />
          </View>
        </Card>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.dark,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.gray,
    marginTop: 4,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 12,
  },
  selectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectionCard: {
    flex: 1,
    height: 80,
    backgroundColor: colors.surface,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.grayLighter,
  },
  activeSelection: {
    backgroundColor: colors.dark,
    borderColor: colors.dark,
    ...shadows.medium,
  },
  selectionText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray,
  },
  selectionPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.dark,
    marginTop: 4,
  },
  activeSelectionText: {
    color: colors.white,
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 0,
    backgroundColor: colors.white,
    ...shadows.premium,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.dark,
  },
});
