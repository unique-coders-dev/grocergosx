import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Text, TextInput, Button, Switch, IconButton, Portal, Modal } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import firestore from '@react-native-firebase/firestore';
import FastImage from 'react-native-fast-image';
import { colors } from '../../config/theme';

const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.string().transform(val => parseFloat(val)).pipe(z.number().min(0)),
  unit: z.string().min(1, 'Unit is required (e.g. lb, kg, pack)'),
  imageUrl: z.string().url('Invalid image URL'),
  description: z.string().optional(),
  inStock: z.boolean().default(true),
});

type ProductFormData = z.infer<typeof productSchema>;

export const AddEditProductScreen = ({ route, navigation }: any) => {
  const productId = route.params?.productId;
  const isEditing = !!productId;
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      category: 'Vegetables',
      price: '0' as any,
      unit: 'lb',
      imageUrl: '',
      description: '',
      inStock: true,
    },
  });

  const imageUrl = watch('imageUrl');

  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        const doc = await firestore().collection('grocery_products').doc(productId).get();
        if (doc.exists) {
          const data = doc.data();
          setValue('name', data?.name);
          setValue('category', data?.category);
          setValue('price', data?.price.toString() as any);
          setValue('unit', data?.unit);
          setValue('imageUrl', data?.imageUrl);
          setValue('description', data?.description);
          setValue('inStock', data?.inStock);
        }
      };
      fetchProduct();
    }
  }, [productId, isEditing, setValue]);

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      if (isEditing) {
        await firestore().collection('grocery_products').doc(productId).update({
          ...data,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      } else {
        await firestore().collection('grocery_products').add({
          ...data,
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = () => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await firestore().collection('grocery_products').doc(productId).delete();
              navigation.goBack();
            } catch (err: any) {
              Alert.alert('Error', err.message);
            }
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="chevron-left" onPress={() => navigation.goBack()} />
        <Text variant="titleLarge">{isEditing ? 'Edit Product' : 'Add New Product'}</Text>
        {isEditing ? (
          <IconButton icon="delete-outline" iconColor={colors.error} onPress={deleteProduct} />
        ) : <View style={{ width: 48 }} />}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.imagePreviewContainer}>
            {imageUrl ? (
              <FastImage
                source={{ uri: imageUrl }}
                style={styles.previewImage}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <IconButton icon="image-outline" size={40} />
                <Text>No image preview</Text>
              </View>
            )}
          </View>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput label="Product Name" mode="outlined" value={value} onChangeText={onChange} error={!!errors.name} style={styles.input} />
            )}
          />
          <Controller
            control={control}
            name="imageUrl"
            render={({ field: { onChange, value } }) => (
              <TextInput label="Image URL" mode="outlined" value={value} onChangeText={onChange} error={!!errors.imageUrl} style={styles.input} />
            )}
          />

          <View style={styles.row}>
            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, value } }) => (
                <TextInput label="Price" mode="outlined" value={value?.toString()} onChangeText={onChange} keyboardType="numeric" error={!!errors.price} style={[styles.input, { flex: 1, marginRight: 8 }]} />
              )}
            />
            <Controller
              control={control}
              name="unit"
              render={({ field: { onChange, value } }) => (
                <TextInput label="Unit" mode="outlined" value={value} onChangeText={onChange} error={!!errors.unit} style={[styles.input, { flex: 1 }]} />
              )}
            />
          </View>

          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <TextInput label="Category" mode="outlined" value={value} onChangeText={onChange} error={!!errors.category} style={styles.input} />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput label="Description" mode="outlined" value={value} onChangeText={onChange} multiline numberOfLines={4} style={styles.input} />
            )}
          />

          <View style={styles.switchRow}>
            <Text variant="bodyLarge">In Stock</Text>
            <Controller
              control={control}
              name="inStock"
              render={({ field: { onChange, value } }) => (
                <Switch value={value} onValueChange={onChange} color={colors.primary} />
              )}
            />
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.submitButton}
            contentStyle={styles.buttonContent}
          >
            {isEditing ? 'Save Changes' : 'Add Product'}
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
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
    padding: 20,
  },
  imagePreviewContainer: {
    width: '100%',
    height: 200,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 4,
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  buttonContent: {
    height: 56,
  },
});
