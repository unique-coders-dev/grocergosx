import { 
  getFirestore, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy 
} from '@react-native-firebase/firestore';
import { Category, Product } from '../types';

export const getCategories = async (): Promise<Category[]> => {
  const db = getFirestore();
  const categoriesRef = collection(db, 'grocery_categories');
  const q = query(categoriesRef, orderBy('sortOrder', 'asc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Category));
};

export const getProducts = async (categoryId?: string): Promise<Product[]> => {
  const db = getFirestore();
  const productsRef = collection(db, 'grocery_products');
  
  let q;
  if (categoryId) {
    q = query(productsRef, where('category', '==', categoryId));
  } else {
    q = query(productsRef);
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Product));
};
