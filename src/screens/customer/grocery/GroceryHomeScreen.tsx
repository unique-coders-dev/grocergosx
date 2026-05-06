import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import {
  Searchbar,
  Chip,
  Text,
  ActivityIndicator,
  FAB,
  Badge,
} from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { getCategories, getProducts } from '../../../api/grocery';
import { ProductCard } from '../../../components/grocery/ProductCard';
import { colors } from '../../../config/theme';
import { useCartStore } from '../../../store/cartStore';

export const GroceryHomeScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const cartItemsCount = useCartStore((state) => state.items.length);

  const {
    data: categories,
    isLoading: categoriesLoading,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const {
    data: products,
    isLoading: productsLoading,
    refetch: refetchProducts,
    isRefetching: productsRefetching,
  } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => getProducts(selectedCategory || undefined),
  });

  const onRefresh = () => {
    refetchCategories();
    refetchProducts();
  };

  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Searchbar
        placeholder="Search groceries..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        iconColor={colors.primary}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        <Chip
          selected={selectedCategory === null}
          onPress={() => setSelectedCategory(null)}
          style={styles.chip}
          showSelectedOverlay
          selectedColor="white"
          buttonColor={selectedCategory === null ? colors.primary : 'white'}
        >
          All
        </Chip>
        {categories?.map((category) => (
          <Chip
            key={category.id}
            selected={selectedCategory === category.id}
            onPress={() => setSelectedCategory(category.id)}
            style={styles.chip}
            showSelectedOverlay
            selectedColor="white"
            buttonColor={selectedCategory === category.id ? colors.primary : 'white'}
          >
            {category.name}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={productsRefetching}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            {productsLoading || categoriesLoading ? (
              <ActivityIndicator color={colors.primary} size="large" />
            ) : (
              <Text variant="bodyLarge">No products found</Text>
            )}
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.fabContainer}>
        <FAB
          icon="cart"
          style={styles.fab}
          color="white"
          onPress={() => navigation.navigate('Cart')}
        />
        {cartItemsCount > 0 && (
          <Badge style={styles.badge} size={24}>
            {cartItemsCount}
          </Badge>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    marginBottom: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    elevation: 0,
  },
  categoriesContainer: {
    paddingBottom: 4,
  },
  chip: {
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listContent: {
    padding: 8,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  fab: {
    backgroundColor: colors.primary,
    borderRadius: 28,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.primaryDark,
  },
});
