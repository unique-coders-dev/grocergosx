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
import { Text, Button, TextInput, SegmentedButtons } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { colors } from '../../../config/theme';

const laundrySchema = z.object({
  address: z.string().min(5, 'Please enter a valid pickup address'),
  estimatedWeight: z.string().transform(val => parseFloat(val)).pipe(z.number().min(10, 'Minimum order is 10 lbs')),
  notes: z.string().optional(),
});

type LaundryFormData = z.infer<typeof laundrySchema>;

export const LaundryScheduleScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [timeSlot, setTimeSlot] = useState('morning');

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LaundryFormData>({
    resolver: zodResolver(laundrySchema),
    defaultValues: {
      address: '',
      estimatedWeight: '10' as any,
      notes: '',
    },
  });

  const weight = watch('estimatedWeight');
  const pricePerLb = 2.5;
  const estimatedPrice = (parseFloat(weight as any) || 0) * pricePerLb;

  const onSubmit = async (data: LaundryFormData) => {
    setLoading(true);
    try {
      const orderData = {
        type: 'laundry',
        customerId: auth().currentUser?.uid,
        status: 'scheduled',
        pickupAddress: data.address,
        pickupTime: timeSlot,
        estimatedWeight: data.estimatedWeight,
        estimatedPrice: estimatedPrice,
        notes: data.notes,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await firestore().collection('laundry_orders').add(orderData);
      
      // Also add to general orders collection for unified tracking
      await firestore().collection('orders').doc(docRef.id).set({
        ...orderData,
        orderId: docRef.id,
      });

      navigation.navigate('OrderConfirmation', { orderId: docRef.id });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to schedule pickup');
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
          <Text variant="headlineSmall" style={styles.title}>Schedule Pickup</Text>

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.label}>Pickup Address</Text>
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Enter pickup address"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.address}
                  style={styles.input}
                />
              )}
            />
            {errors.address && (
              <Text style={styles.errorText}>{errors.address.message as string}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.label}>Preferred Time Slot</Text>
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
            <Text variant="titleMedium" style={styles.label}>Estimated Weight (lbs)</Text>
            <Controller
              control={control}
              name="estimatedWeight"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  mode="outlined"
                  keyboardType="numeric"
                  value={value?.toString()}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.estimatedWeight}
                  style={styles.input}
                  right={<TextInput.Affix text="lbs" />}
                />
              )}
            />
            <Text variant="bodySmall" style={styles.hint}>Minimum: 10 lbs</Text>
            {errors.estimatedWeight && (
              <Text style={styles.errorText}>{errors.estimatedWeight.message as string}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.label}>Special Instructions</Text>
            <Controller
              control={control}
              name="notes"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="e.g. delicate items, use specific detergent"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={4}
                  style={styles.input}
                />
              )}
            />
          </View>

          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text variant="titleMedium">Estimated Total</Text>
              <Text variant="headlineSmall" style={styles.totalPrice}>
                ${estimatedPrice.toFixed(2)}
              </Text>
            </View>
            <Text variant="bodySmall" style={styles.priceNote}>
              * Final price determined after weighing.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
          >
            Confirm Booking
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
    paddingBottom: 100,
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
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
  },
  segmented: {
    marginTop: 8,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  hint: {
    color: colors.textSecondary,
    marginTop: 4,
  },
  priceCard: {
    marginTop: 10,
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalPrice: {
    fontWeight: '700',
    color: colors.primary,
  },
  priceNote: {
    marginTop: 8,
    color: colors.textSecondary,
    fontStyle: 'italic',
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
  submitButton: {
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  submitButtonContent: {
    height: 56,
  },
});
