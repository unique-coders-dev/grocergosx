import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { Text, Button, TextInput, RadioButton, Divider } from 'react-native-paper';
import { useStripe } from '@stripe/stripe-react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { colors } from '../../../config/theme';
import { useCartStore } from '../../../store/cartStore';

export const CheckoutScreen = ({ navigation }: any) => {
  const { items, getTotal, clearCart } = useCartStore();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [address, setAddress] = useState('123 Villa St, St. Maarten');
  const [timeSlot, setTimeSlot] = useState('morning');
  const [loading, setLoading] = useState(false);

  const subtotal = getTotal();
  const deliveryFee = 5.0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // 1. In a real app, you'd fetch paymentIntent from backend here
      // const { paymentIntent, ephemeralKey, customer } = await fetchPaymentParams();

      // Mock Stripe Payment (since we don't have a backend setup yet)
      // For this demo, we'll proceed directly to Firestore
      
      const orderData = {
        type: 'grocery',
        customerId: auth().currentUser?.uid,
        status: 'pending',
        items: items,
        deliveryAddress: address,
        scheduledTime: timeSlot,
        totalAmount: total,
        paymentStatus: 'paid', // Assuming success for now
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      const orderRef = await firestore().collection('orders').add(orderData);
      
      clearCart();
      navigation.navigate('OrderConfirmation', { orderId: orderRef.id });

    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineSmall" style={styles.title}>Checkout</Text>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Delivery Address</Text>
          <TextInput
            mode="outlined"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
            style={styles.addressInput}
          />
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Delivery Time Slot</Text>
          <RadioButton.Group onValueChange={value => setTimeSlot(value)} value={timeSlot}>
            <View style={styles.radioRow}>
              <RadioButton value="morning" color={colors.primary} />
              <Text>Morning (8 AM - 12 PM)</Text>
            </View>
            <View style={styles.radioRow}>
              <RadioButton value="afternoon" color={colors.primary} />
              <Text>Afternoon (12 PM - 5 PM)</Text>
            </View>
            <View style={styles.radioRow}>
              <RadioButton value="evening" color={colors.primary} />
              <Text>Evening (5 PM - 8 PM)</Text>
            </View>
          </RadioButton.Group>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text>Subtotal</Text>
            <Text>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Delivery Fee</Text>
            <Text>${deliveryFee.toFixed(2)}</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text variant="titleLarge">Total</Text>
            <Text variant="titleLarge" style={styles.totalAmount}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handlePlaceOrder}
          loading={loading}
          disabled={loading}
          style={styles.placeOrderButton}
          contentStyle={styles.placeOrderButtonContent}
        >
          Place Order
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
    padding: 20,
  },
  title: {
    fontWeight: '700',
    marginBottom: 24,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  addressInput: {
    backgroundColor: colors.surface,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  totalAmount: {
    color: colors.primary,
    fontWeight: '700',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  placeOrderButton: {
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  placeOrderButtonContent: {
    height: 56,
  },
});
