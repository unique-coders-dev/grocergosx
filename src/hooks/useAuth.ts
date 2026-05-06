import { useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useAuthStore } from '../store/authStore';
import { User } from '../types';

export const useAuth = () => {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          let userDoc = await firestore()
            .collection('users')
            .doc(firebaseUser.uid)
            .get();

          // Handle race condition: Firestore write may not be complete
          // immediately after Firebase Auth creates the account.
          if (!userDoc.exists) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            userDoc = await firestore()
              .collection('users')
              .doc(firebaseUser.uid)
              .get();
          }

          if (userDoc.exists) {
            setUser({
              uid: firebaseUser.uid,
              ...userDoc.data(),
            } as User);
          } else {
            // Fallback: create a minimal profile from Firebase Auth data
            const minimalUser = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'Customer',
              email: firebaseUser.email || '',
              phone: '',
              role: 'customer' as const,
              loyaltyPoints: 0,
              referralCode:
                (firebaseUser.email?.substring(0, 3) ?? 'USR').toUpperCase() +
                Math.floor(1000 + Math.random() * 9000),
              createdAt: firestore.FieldValue.serverTimestamp(),
            };
            await firestore()
              .collection('users')
              .doc(firebaseUser.uid)
              .set(minimalUser);
            setUser(minimalUser as unknown as User);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Don't sign the user out on network error; keep them logged in
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [setUser, setLoading]);
};
