import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Text, Button, TextInput, SegmentedButtons, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { colors } from '../../../config/theme';

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
      senderAddress: 'My Villa, St. Maarten', // Mocking auto-fill
      recipientName: '',
      recipientPhone: '',
      recipientAddress: '',
      notes: '',
    },
  });

  const onSubmit = async (data: ParcelFormData) => {
    setLoading(true);
    try {
      // In a real app, Stripe payment happens here
      
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
      
      // Also add to unified orders
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text variant="headlineSmall" style={styles.title}>Parcel Details</Text>

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.label}>Sender Info</Text>
            <Controller
              control={control}
              name="senderAddress"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  label="Pickup Address"
                  mode="outlined"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  style={styles.input}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.label}>Recipient Info</Text>
            <Controller
              control={control}
              name="recipientName"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  label="Name"
                  mode="outlined"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.recipientName}
                  style={styles.input}
                />
              )}
            />
            <Controller
              control={control}
              name="recipientPhone"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  label="Phone"
                  mode="outlined"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="phone-pad"
                  error={!!errors.recipientPhone}
                  style={styles.input}
                />
              )}
            />
            <Controller
              control={control}
              name="recipientAddress"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  label="Delivery Address"
                  mode="outlined"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.recipientAddress}
                  style={styles.input}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.label}>Parcel Size</Text>
            <SegmentedButtons
              value={parcelSize}
              onValueChange={setParcelSize}
              buttons={[
                { value: 'Small', label: 'Small' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Large', label: 'Large' },
              ]}
              style={styles.segmented}
            />
          </View>

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.label}>Pickup Time Slot</Text>
            <SegmentedButtons
              value={timeSlot}
              onValueChange={setTimeSlot}
              buttons={[
                { value: 'morning', label: '8-12' },
                { value: 'afternoon', label: '12-5' },
                { value: 'evening', label: '5-8' },
              ]}
              style={styles.segmented}
            />
          </View>

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.label}>Notes / Special Handling</Text>
            <Controller
              control={control}
              name="notes"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="e.g. fragile, beware of dog"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={3}
                  style={styles.input}
                />
              )}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.priceRow}>
            <Text variant="titleLarge">Total: ${sizePrices[parcelSize].toFixed(2)}</Text>
          </View>
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Pay & Book Now
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 150,
  },
  title: {
    fontWeight: '700',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
    backgroundColor: colors.surface,
  },
  segmented: {
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
  priceRow: {
    marginBottom: 15,
    alignItems: 'center',
  },
  button: {
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  buttonContent: {
    height: 56,
  },
});
