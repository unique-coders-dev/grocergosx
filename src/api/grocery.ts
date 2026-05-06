import firestore from '@react-native-firebase/firestore';
import { Category, Product } from '../types';

export const getCategories = async (): Promise<Category[]> => {
  const snapshot = await firestore()
    .collection('grocery_categories')
    .orderBy('sortOrder', 'asc')
    .get();
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Category));
};

export const getProducts = async (categoryId?: string): Promise<Product[]> => {
  let query = firestore().collection('grocery_products');
  
  if (categoryId) {
    query = query.where('category', '==', categoryId);
  }
  
  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Product));
};
