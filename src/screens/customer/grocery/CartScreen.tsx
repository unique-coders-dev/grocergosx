import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Text, Button, IconButton, Divider } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { colors } from '../../../config/theme';
import { useCartStore } from '../../../store/cartStore';

export const CartScreen = ({ navigation }: any) => {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();

  const CartItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      <FastImage
        source={{ uri: item.imageUrl }}
        style={styles.itemImage}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.itemInfo}>
        <Text variant="titleMedium" numberOfLines={1}>{item.name}</Text>
        <Text variant="bodySmall" style={styles.itemUnit}>{item.unit}</Text>
        <Text variant="titleMedium" style={styles.itemPrice}>
          ${(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
      <View style={styles.quantityControl}>
        <IconButton
          icon="minus"
          size={20}
          onPress={() => updateQuantity(item.productId, item.quantity - 1)}
        />
        <Text variant="bodyLarge">{item.quantity}</Text>
        <IconButton
          icon="plus"
          size={20}
          onPress={() => updateQuantity(item.productId, item.quantity + 1)}
        />
      </View>
      <IconButton
        icon="delete-outline"
        iconColor={colors.error}
        onPress={() => removeItem(item.productId)}
      />
    </View>
  );

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <IconButton icon="cart-outline" size={80} iconColor={colors.border} />
        <Text variant="headlineSmall" style={styles.emptyTitle}>Your cart is empty</Text>
        <Text variant="bodyMedium" style={styles.emptySubtitle}>
          Add some items to your cart to see them here.
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Home')}
          style={styles.browseButton}
        >
          Browse Products
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="chevron-left" onPress={() => navigation.goBack()} />
        <Text variant="titleLarge">Your Cart</Text>
        <View style={{ width: 48 }} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.productId}
        renderItem={({ item }) => <CartItem item={item} />}
        ItemSeparatorComponent={() => <Divider />}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <View style={styles.summaryRow}>
          <Text variant="bodyLarge">Subtotal</Text>
          <Text variant="titleLarge">${getTotal().toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text variant="bodyLarge">Delivery Fee</Text>
          <Text variant="titleMedium">$5.00</Text>
        </View>
        <Divider style={styles.footerDivider} />
        <View style={styles.summaryRow}>
          <Text variant="titleLarge" style={styles.totalLabel}>Total</Text>
          <Text variant="headlineSmall" style={styles.totalAmount}>
            ${(getTotal() + 5).toFixed(2)}
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Checkout')}
          style={styles.checkoutButton}
          contentStyle={styles.checkoutButtonContent}
        >
          Proceed to Checkout
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemUnit: {
    color: colors.textSecondary,
  },
  itemPrice: {
    color: colors.primary,
    fontWeight: '600',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  emptyTitle: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 20,
  },
  emptySubtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  browseButton: {
    borderRadius: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  footerDivider: {
    marginVertical: 12,
  },
  totalLabel: {
    fontWeight: '700',
  },
  totalAmount: {
    fontWeight: '700',
    color: colors.primary,
  },
  checkoutButton: {
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  checkoutButtonContent: {
    height: 56,
  },
});
