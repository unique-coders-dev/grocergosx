import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from '@react-native-firebase/firestore';
import { useAuthStore } from '../store/authStore';
import { User } from '../types';

export const useAuth = () => {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          let userDoc;
          try {
            const userRef = doc(db, 'users', firebaseUser.uid);
            userDoc = await getDoc(userRef);

            // Handle race condition: Firestore write may not be complete
            // immediately after Firebase Auth creates the account.
            if (!userDoc.exists) {
              await new Promise((resolve) => setTimeout(resolve, 2000));
              userDoc = await getDoc(userRef);
            }
          } catch (fetchError) {
            console.error('Error fetching user profile from Firestore:', fetchError);
            // Continue with fallback instead of failing
          }

          if (userDoc?.exists) {
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
              createdAt: serverTimestamp(),
            };

            // Attempt to save minimal profile, but don't block if it fails
            try {
              const userRef = doc(db, 'users', firebaseUser.uid);
              await setDoc(userRef, minimalUser, { merge: true });
            } catch (saveError) {
              console.error('Error saving minimal profile:', saveError);
            }

            setUser(minimalUser as unknown as User);
          }
        } catch (error) {
          console.error('Critical error in useAuth:', error);
          // Only set to null if we really can't determine the user status
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
