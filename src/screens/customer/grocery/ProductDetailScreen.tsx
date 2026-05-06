import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import { Text, Button, IconButton, Divider } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { useQuery } from '@tanstack/react-query';
import firestore from '@react-native-firebase/firestore';
import { Product } from '../../../types';
import { colors } from '../../../config/theme';
import { useCartStore } from '../../../store/cartStore';

const { width } = Dimensions.get('window');

export const ProductDetailScreen = ({ route, navigation }: any) => {
  const { productId } = route.params;
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const doc = await firestore().collection('grocery_products').doc(productId).get();
      return { id: doc.id, ...doc.data() } as Product;
    },
  });

  if (isLoading || !product) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading product...</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <FastImage
            source={{ uri: product.imageUrl }}
            style={styles.image}
            resizeMode={FastImage.resizeMode.cover}
          />
          <IconButton
            icon="chevron-left"
            mode="contained"
            containerColor="rgba(255,255,255,0.8)"
            iconColor="black"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        </View>

        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.name}>
            {product.name}
          </Text>
          <Text variant="titleMedium" style={styles.price}>
            ${product.price.toFixed(2)} / {product.unit}
          </Text>
          
          <Divider style={styles.divider} />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Description
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            {product.description || 'No description available for this product.'}
          </Text>

          <Divider style={styles.divider} />

          <View style={styles.quantitySection}>
            <Text variant="titleMedium">Quantity</Text>
            <View style={styles.quantityControl}>
              <IconButton
                icon="minus"
                mode="outlined"
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              />
              <Text variant="titleLarge" style={styles.quantityText}>
                {quantity}
              </Text>
              <IconButton
                icon="plus"
                mode="outlined"
                onPress={() => setQuantity(quantity + 1)}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text variant="bodySmall" style={styles.totalLabel}>
            Total Price
          </Text>
          <Text variant="headlineSmall" style={styles.totalAmount}>
            ${(product.price * quantity).toFixed(2)}
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={handleAddToCart}
          style={styles.addButton}
          contentStyle={styles.addButtonContent}
        >
          Add to Cart
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: width,
    height: width,
    backgroundColor: colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  content: {
    padding: 20,
  },
  name: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  price: {
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 10,
  },
  description: {
    color: colors.textSecondary,
    lineHeight: 22,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 15,
    minWidth: 20,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    color: colors.textSecondary,
  },
  totalAmount: {
    fontWeight: '700',
    color: colors.primary,
  },
  addButton: {
    flex: 1.5,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  addButtonContent: {
    height: 56,
  },
});
