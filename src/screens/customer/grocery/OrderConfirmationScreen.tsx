import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import { colors } from '../../../config/theme';

export const OrderConfirmationScreen = ({ route, navigation }: any) => {
  const { orderId } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <IconButton
          icon="check-circle"
          size={100}
          iconColor={colors.success}
        />
        <Text variant="headlineMedium" style={styles.title}>Order Placed!</Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Your order #{orderId.substring(0, 8)} has been successfully placed.
        </Text>
        <Text variant="bodyMedium" style={styles.info}>
          You will receive a notification once the admin confirms your order.
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Orders')}
            style={styles.button}
          >
            Track Order
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Home')}
            style={[styles.button, styles.outlineButton]}
            textColor={colors.primary}
          >
            Back to Home
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 10,
    color: colors.textPrimary,
  },
  info: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    marginBottom: 15,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
  },
  outlineButton: {
    borderColor: colors.primary,
  },
});
