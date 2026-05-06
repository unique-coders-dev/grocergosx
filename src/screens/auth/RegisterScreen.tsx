import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { colors } from '../../config/theme';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  referralCode: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const getFirebaseErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please log in.';
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-up is not enabled. Please contact support.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few minutes and try again.';
    default:
      return `Registration failed (${code || 'unknown'}). Please try again.`;
  }
};

export const RegisterScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      referralCode: '',
    },
  });

  const onRegister = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);
    try {
      // Step 1: Create Firebase Auth user
      const userCredential = await auth().createUserWithEmailAndPassword(
        data.email.trim(),
        data.password
      );
      const uid = userCredential.user.uid;

      // Step 2: Update display name (non-blocking)
      try {
        await userCredential.user.updateProfile({ displayName: data.name });
      } catch (profileErr) {
        console.warn('Could not set display name:', profileErr);
      }

      // Step 3: Write Firestore profile (non-blocking - useAuth handles fallback)
      const referralCode =
        data.name.substring(0, 3).toUpperCase() +
        Math.floor(1000 + Math.random() * 9000);

      try {
        await firestore().collection('users').doc(uid).set({
          uid,
          name: data.name,
          email: data.email.trim(),
          phone: data.phone,
          role: 'customer',
          loyaltyPoints: 0,
          referralCode,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      } catch (firestoreErr: any) {
        // Log Firestore error but don't block login — useAuth will create fallback profile
        console.error('Firestore write error code:', firestoreErr?.code);
        console.error('Firestore write error msg:', firestoreErr?.message);
      }

      // Auth succeeded — onAuthStateChanged in useAuth.ts will handle navigation
    } catch (authErr: any) {
      // Auth failed — show error to user
      console.error('Auth error code:', authErr?.code);
      console.error('Auth error message:', authErr?.message);
      console.error('Auth error userInfo:', JSON.stringify(authErr?.userInfo));
      const code = authErr?.code || authErr?.userInfo?.code || '';
      setError(getFirebaseErrorMessage(code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text variant="displaySmall" style={styles.title}>
              Create Account
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Join GrocerGo SXM and start ordering
            </Text>
          </View>

          <View style={styles.form}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  label="Full Name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                  style={styles.input}
                  error={!!errors.name}
                />
              )}
            />
            {errors.name && (
              <Text style={styles.helperText}>{errors.name.message}</Text>
            )}

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  error={!!errors.email}
                />
              )}
            />
            {errors.email && (
              <Text style={styles.helperText}>{errors.email.message}</Text>
            )}

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  label="Phone Number"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                  keyboardType="phone-pad"
                  style={styles.input}
                  error={!!errors.phone}
                />
              )}
            />
            {errors.phone && (
              <Text style={styles.helperText}>{errors.phone.message}</Text>
            )}

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  label="Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  error={!!errors.password}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off' : 'eye'}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />
              )}
            />
            {errors.password && (
              <Text style={styles.helperText}>{errors.password.message}</Text>
            )}

            <Controller
              control={control}
              name="referralCode"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  label="Referral Code (Optional)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                  style={styles.input}
                  autoCapitalize="characters"
                />
              )}
            />

            <Button
              mode="contained"
              onPress={handleSubmit(onRegister)}
              loading={loading}
              disabled={loading}
              style={styles.registerButton}
              contentStyle={styles.registerButtonContent}
              labelStyle={styles.registerButtonLabel}
            >
              Sign Up
            </Button>

            <View style={styles.loginContainer}>
              <Text variant="bodyMedium">Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 24,
    flexGrow: 1,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSecondary,
  },
  form: {
    flex: 1,
  },
  input: {
    marginBottom: 4,
    backgroundColor: '#FFFFFF',
  },
  helperText: {
    color: colors.error,
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  registerButton: {
    borderRadius: 12,
    backgroundColor: colors.primary,
    marginTop: 20,
    marginBottom: 24,
  },
  registerButtonContent: {
    height: 56,
  },
  registerButtonLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingBottom: 20,
  },
  loginText: {
    color: colors.primary,
    fontWeight: '700',
  },
  errorContainer: {
    backgroundColor: '#FFEEF0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
  },
});
