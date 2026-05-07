import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Product } from '../../types';
import { colors, shadows } from '../../config/theme';
import { useCartStore } from '../../store/cartStore';
import { Card } from '../common/UI';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      style={styles.container} 
      onPress={onPress}
    >
      <Card style={styles.card}>
        <View style={styles.imageContainer}>
          <FastImage
            source={{ uri: product.imageUrl }}
            style={styles.image}
            resizeMode={FastImage.resizeMode.cover}
          />
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              addItem(product);
            }}
          >
            <MaterialCommunityIcons name="plus" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text numberOfLines={1} style={styles.name}>
            {product.name}
          </Text>
          <Text style={styles.unit}>
            {product.unit}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
    borderWidth: 0,
    ...shadows.soft,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface,
  },
  addButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  content: {
    padding: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
  },
  unit: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 2,
  },
});
