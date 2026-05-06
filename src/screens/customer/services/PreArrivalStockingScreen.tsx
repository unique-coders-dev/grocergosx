import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Text, TextInput, Button, IconButton, Card } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { colors } from '../../../config/theme';

export const PreArrivalStockingScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      villaName: '',
      arrivalDate: '',
      groceryList: '',
      specialRequests: '',
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await firestore().collection('pre_arrival_inquiries').add({
        ...data,
        customerId: auth().currentUser?.uid,
        status: 'pending',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      
      Alert.alert(
        'Inquiry Sent!',
        'Our team will contact you shortly to confirm your list and provide a quote.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="chevron-left" onPress={() => navigation.goBack()} />
        <Text variant="titleLarge">Pre-Arrival Stocking</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineSmall" style={styles.title}>Welcome to Paradise!</Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Have your fridge full and drinks cold before you even land. Tell us what you need.
        </Text>

        <Card style={styles.formCard}>
          <Card.Content>
            <Controller
              control={control}
              name="villaName"
              render={({ field: { onChange, value } }) => (
                <TextInput label="Villa or Hotel Name" mode="outlined" value={value} onChangeText={onChange} style={styles.input} />
              )}
            />
            <Controller
              control={control}
              name="arrivalDate"
              render={({ field: { onChange, value } }) => (
                <TextInput label="Arrival Date" placeholder="DD/MM/YYYY" mode="outlined" value={value} onChangeText={onChange} style={styles.input} />
              )}
            />
            <Controller
              control={control}
              name="groceryList"
              render={({ field: { onChange, value } }) => (
                <TextInput 
                  label="What items do you need?" 
                  placeholder="e.g. Milk, Eggs, Heineken (6-pack), Local Rum..." 
                  mode="outlined" 
                  value={value} 
                  onChangeText={onChange} 
                  multiline 
                  numberOfLines={6} 
                  style={styles.input} 
                />
              )}
            />
            <Controller
              control={control}
              name="specialRequests"
              render={({ field: { onChange, value } }) => (
                <TextInput label="Special Requests" mode="outlined" value={value} onChangeText={onChange} multiline numberOfLines={3} style={styles.input} />
              )}
            />
          </Card.Content>
        </Card>

        <Button 
          mode="contained" 
          onPress={handleSubmit(onSubmit)} 
          loading={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Send Inquiry
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  scrollContent: {
    padding: 24,
  },
  title: {
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSecondary,
    marginBottom: 24,
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 2,
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  button: {
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  buttonContent: {
    height: 56,
  },
});
