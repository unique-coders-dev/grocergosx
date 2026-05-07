import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Text } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { useQuery } from '@tanstack/react-query';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Product } from '../../../types';
import { colors, shadows } from '../../../config/theme';
import { useCartStore } from '../../../store/cartStore';
import { Button, Badge, Skeleton, Card } from '../../../components/common/UI';

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
      <SafeAreaView style={styles.container}>
        <View style={styles.backButtonFixed}>
          <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={28} color={colors.dark} />
          </TouchableOpacity>
        </View>
        <Skeleton width="100%" height={300} />
        <View style={{ padding: 24 }}>
          <Skeleton width="60%" height={32} style={{ marginBottom: 12 }} />
          <Skeleton width="30%" height={20} style={{ marginBottom: 24 }} />
          <Skeleton width="100%" height={100} style={{ marginBottom: 24 }} />
          <Skeleton width="100%" height={56} style={{ borderRadius: 18 }} />
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.imageContainer}>
          <FastImage
            source={{ uri: product.imageUrl }}
            style={styles.image}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.backButtonFixed}>
            <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="chevron-left" size={28} color={colors.dark} />
            </TouchableOpacity>
          </View>
          <View style={styles.favoriteBtn}>
            <TouchableOpacity style={styles.circleBtn}>
              <MaterialCommunityIcons name="heart-outline" size={24} color={colors.error} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Badge label="In Stock" color={colors.primary} style={{ marginBottom: 12 }} />
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.unit}>{product.unit}</Text>
              </View>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            </View>
          </Animated.View>
          
          <Animated.View entering={FadeInDown.delay(400).duration(600)}>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Product Description</Text>
            <Text style={styles.description}>
              {product.description || 'Enjoy the freshest ingredients sourced locally for your kitchen. High quality and nutritious.'}
            </Text>
            <View style={styles.divider} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.quantitySection}>
            <View>
              <Text style={styles.sectionTitle}>Quantity</Text>
              <Text style={styles.subText}>Select items count</Text>
            </View>
            <View style={styles.quantityControl}>
              <TouchableOpacity 
                style={styles.qtyBtn}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <MaterialCommunityIcons name="minus" size={20} color={colors.dark} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity 
                style={styles.qtyBtn}
                onPress={() => setQuantity(quantity + 1)}
              >
                <MaterialCommunityIcons name="plus" size={20} color={colors.dark} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      <Animated.View entering={FadeInDown.delay(800)} style={styles.footer}>
        <Card style={styles.footerCard}>
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total Price</Text>
            <Text style={styles.totalAmount}>${(product.price * quantity).toFixed(2)}</Text>
          </View>
          <Button 
            title="Add to Cart" 
            onPress={handleAddToCart} 
            style={{ flex: 1, marginLeft: 24 }}
            icon="cart-plus"
          />
        </Card>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  imageContainer: {
    width: width,
    height: width * 0.9,
    backgroundColor: colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButtonFixed: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 20,
    left: 20,
  },
  favoriteBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 20,
    right: 20,
  },
  circleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  content: {
    padding: 24,
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.dark,
    letterSpacing: -0.5,
  },
  unit: {
    fontSize: 16,
    color: colors.gray,
    marginTop: 4,
    fontWeight: '600',
  },
  price: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.grayLighter,
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.dark,
    marginBottom: 8,
  },
  subText: {
    fontSize: 13,
    color: colors.gray,
  },
  description: {
    fontSize: 15,
    color: colors.gray,
    lineHeight: 24,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 6,
  },
  qtyBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.soft,
  },
  quantityText: {
    marginHorizontal: 20,
    fontSize: 18,
    fontWeight: '800',
    color: colors.dark,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 28,
    borderWidth: 0,
    backgroundColor: colors.white,
    ...shadows.premium,
  },
  totalBox: {
    marginLeft: 8,
  },
  totalLabel: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.dark,
  },
});
