import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text, Button, IconButton } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { Product } from '../../types';
import { colors } from '../../config/theme';
import { useCartStore } from '../../store/cartStore';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Card style={styles.card} onPress={onPress}>
      <FastImage
        source={{ uri: product.imageUrl }}
        style={styles.image}
        resizeMode={FastImage.resizeMode.cover}
      />
      <Card.Content style={styles.content}>
        <Text variant="titleMedium" numberOfLines={1} style={styles.name}>
          {product.name}
        </Text>
        <Text variant="bodySmall" style={styles.unit}>
          {product.unit}
        </Text>
        <View style={styles.footer}>
          <Text variant="titleLarge" style={styles.price}>
            ${product.price.toFixed(2)}
          </Text>
          <IconButton
            icon="plus"
            mode="contained"
            containerColor={colors.primary}
            iconColor="white"
            size={20}
            onPress={() => addItem(product)}
            style={styles.addButton}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: 8,
  },
  name: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  unit: {
    color: colors.textSecondary,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontWeight: '700',
    color: colors.primary,
  },
  addButton: {
    margin: 0,
  },
});
