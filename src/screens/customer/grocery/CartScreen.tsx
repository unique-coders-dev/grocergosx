import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Text } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown, FadeOutRight, Layout } from 'react-native-reanimated';
import { colors, shadows } from '../../../config/theme';
import { useCartStore } from '../../../store/cartStore';
import { Card, Button, Badge } from '../../../components/common/UI';
import { ServicePageHeader } from '../../../components/common/ServiceComponents';

export const CartScreen = ({ navigation }: any) => {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();

  const CartItem = ({ item, index }: { item: any; index: number }) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 100)} 
      exiting={FadeOutRight}
      layout={Layout.springify()}
    >
      <Card style={styles.itemCard}>
        <FastImage
          source={{ uri: item.imageUrl }}
          style={styles.itemImage}
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.itemUnit}>{item.unit}</Text>
          <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        </View>
        
        <View style={styles.rightSection}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              onPress={() => updateQuantity(item.productId, item.quantity - 1)}
              style={styles.qtyBtn}
            >
              <MaterialCommunityIcons name="minus" size={16} color={colors.dark} />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <TouchableOpacity 
              onPress={() => updateQuantity(item.productId, item.quantity + 1)}
              style={styles.qtyBtn}
            >
              <MaterialCommunityIcons name="plus" size={16} color={colors.dark} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => removeItem(item.productId)} style={styles.removeBtn}>
            <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </Card>
    </Animated.View>
  );

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <ServicePageHeader navigation={navigation} title="Your Cart" />
        <View style={styles.emptyContent}>
          <View style={styles.emptyIconCircle}>
            <MaterialCommunityIcons name="cart-off" size={64} color={colors.grayLighter} />
          </View>
          <Text style={styles.emptyTitle}>Cart is Empty</Text>
          <Text style={styles.emptySubtitle}>Looks like you haven't added anything yet.</Text>
          <Button
            title="Start Shopping"
            onPress={() => navigation.navigate('HomeTab')}
            style={{ marginTop: 24, paddingHorizontal: 32 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ServicePageHeader navigation={navigation} title="Your Cart" />

      <FlatList
        data={items}
        keyExtractor={(item) => item.productId}
        renderItem={({ item, index }) => <CartItem item={item} index={index} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <Card style={styles.footer}>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${getTotal().toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Badge label="FREE" color={colors.primary} />
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>${getTotal().toFixed(2)}</Text>
          </View>
        </View>
        
        <Button
          title="Checkout Now"
          onPress={() => navigation.navigate('Checkout')}
          style={styles.checkoutBtn}
          icon="credit-card-outline"
        />
      </Card>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContent: {
    padding: 24,
    paddingTop: 8,
    paddingBottom: 120,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 0,
    ...shadows.soft,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
  },
  itemUnit: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 6,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.soft,
  },
  qtyText: {
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '800',
    color: colors.dark,
  },
  removeBtn: {
    marginTop: 12,
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.dark,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 0,
    backgroundColor: colors.white,
    ...shadows.premium,
  },
  summaryBox: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
  },
  divider: {
    height: 1,
    backgroundColor: colors.grayLighter,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.dark,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primary,
  },
  checkoutBtn: {
    width: '100%',
  },
});
