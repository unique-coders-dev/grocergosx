import React, { useState } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { Text, Searchbar, List, Avatar, Divider, ActivityIndicator } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import firestore from '@react-native-firebase/firestore';
import { User } from '../../types';
import { colors } from '../../config/theme';

export const CustomerListScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: customers, isLoading, refetch } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      const snapshot = await firestore().collection('users').get();
      return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
    },
  });

  const filteredCustomers = customers?.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search customers..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          elevation={0}
        />
      </View>

      <FlatList
        data={filteredCustomers}
        keyExtractor={item => item.uid}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={`${item.email} • ${item.phone || 'No phone'}`}
            left={props => (
              <Avatar.Text 
                {...props} 
                size={40} 
                label={item.name.substring(0, 2).toUpperCase()} 
                style={styles.avatar}
              />
            )}
            right={props => (
              <View style={styles.right}>
                <Text style={styles.points}>{item.loyaltyPoints} pts</Text>
                <List.Icon {...props} icon="chevron-right" />
              </View>
            )}
            onPress={() => navigation.navigate('CustomerDetail', { uid: item.uid })}
          />
        )}
        ItemSeparatorComponent={() => <Divider />}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            {isLoading ? <ActivityIndicator color={colors.primary} /> : <Text>No customers found.</Text>}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    paddingBottom: 20,
  },
  avatar: {
    backgroundColor: colors.primary + '20',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  points: {
    color: colors.primary,
    fontWeight: '600',
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50,
  },
});
