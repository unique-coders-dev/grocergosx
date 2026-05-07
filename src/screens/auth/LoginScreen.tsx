import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import auth, { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { colors } from '../../config/theme';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const getFirebaseErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a few minutes and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    default:
      return 'Login failed. Please check your credentials and try again.';
  }
};

export const LoginScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onLogin = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);
    try {
      const firebaseAuth = getAuth();
      await signInWithEmailAndPassword(firebaseAuth, data.email.trim(), data.password);
    } catch (err: any) {
      console.error('Login error detail:', err);
      const code = err?.code || err?.userInfo?.code || '';
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
            <Image 
              source={require('../../assets/logos/logo_full.png')} 
              style={styles.logo} 
              resizeMode="contain"
            />
            <Text variant="displaySmall" style={styles.title}>
              Welcome Back!
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Sign in to continue shopping
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

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              mode="contained"
              onPress={handleSubmit(onLogin)}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
              contentStyle={styles.loginButtonContent}
              labelStyle={styles.loginButtonLabel}
            >
              Login
            </Button>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialButtons}>
              <IconButton
                icon="google"
                mode="outlined"
                size={30}
                onPress={() => console.log('Google Sign-in')}
                style={styles.socialButton}
              />
              <IconButton
                icon="apple"
                mode="outlined"
                size={30}
                onPress={() => console.log('Apple Sign-in')}
                style={styles.socialButton}
              />
            </View>

            <View style={styles.registerContainer}>
              <Text variant="bodyMedium">Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerText}>Sign Up</Text>
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
    alignItems: 'center',
  },
  logo: {
    height: 60,
    width: 200,
    marginBottom: 20,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 12,
    backgroundColor: colors.primary,
    marginBottom: 24,
  },
  loginButtonContent: {
    height: 56,
  },
  loginButtonLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  socialButton: {
    marginHorizontal: 10,
    borderColor: colors.border,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingBottom: 20,
  },
  registerText: {
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
