import React, { useState } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { Text, Searchbar, Card, IconButton, FAB, ActivityIndicator } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import firestore from '@react-native-firebase/firestore';
import FastImage from 'react-native-fast-image';
import { Product } from '../../types';
import { colors } from '../../config/theme';

export const ProductListScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const snapshot = await firestore().collection('grocery_products').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    },
  });

  const ProductItem = ({ item }: { item: Product }) => (
    <Card 
      style={styles.card} 
      onPress={() => navigation.navigate('EditProduct', { productId: item.id })}
    >
      <View style={styles.cardContent}>
        <FastImage
          source={{ uri: item.imageUrl }}
          style={styles.productImage}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.info}>
          <Text variant="titleMedium">{item.name}</Text>
          <Text variant="bodySmall" style={styles.category}>{item.category}</Text>
          <Text variant="titleMedium" style={styles.price}>${item.price.toFixed(2)} / {item.unit}</Text>
        </View>
        <View style={styles.actions}>
          <IconButton 
            icon={item.inStock ? 'check-circle' : 'close-circle'} 
            iconColor={item.inStock ? colors.success : colors.error} 
            size={20}
          />
          <IconButton icon="pencil-outline" size={20} onPress={() => navigation.navigate('EditProduct', { productId: item.id })} />
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search products..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          elevation={0}
        />
      </View>

      <FlatList
        data={products?.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ProductItem item={item} />}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            {isLoading ? <ActivityIndicator color={colors.primary} /> : <Text>No products found.</Text>}
          </View>
        )}
      />

      <FAB
        icon="plus"
        label="Add Product"
        style={styles.fab}
        onPress={() => navigation.navigate('AddProduct')}
        color="white"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  category: {
    color: colors.textSecondary,
    marginBottom: 4,
  },
  price: {
    color: colors.primary,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50,
  },
});
