import { MD3LightTheme, configureFonts } from 'react-native-paper';

export const colors = {
  // Brand Colors
  primary: '#00D084', // Vibrant Mint/Green
  primaryDark: '#00A86B',
  primaryLight: '#E6F9F2',
  
  secondary: '#FF6B6B', // Soft Coral/Red
  secondaryLight: '#FFF0F0',
  
  accent: '#7052FF', // Electric Purple
  accentLight: '#F0EFFF',
  
  // Grayscale / Interface
  dark: '#121212',
  darkLight: '#2D2D2D',
  gray: '#6B7280',
  grayLight: '#9CA3AF',
  grayLighter: '#E5E7EB',
  grayLightest: '#F3F4F6',
  white: '#FFFFFF',
  black: '#000000',
  
  // Feedback
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  background: '#FFFFFF',
  surface: '#F9FAFB',
  border: '#F3F4F6',
};

export const shadows = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.02,
    shadowRadius: 16,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 4,
  },
  premium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.08,
    shadowRadius: 40,
    elevation: 7,
  },
};

const fontConfig = {
  displayLarge: {
    fontFamily: 'System',
    fontSize: 34,
    fontWeight: '800' as const,
    letterSpacing: -1,
  },
  displayMedium: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  headlineLarge: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  titleLarge: {
    fontFamily: 'System',
    fontSize: 20,
    fontWeight: '700' as const,
  },
  titleMedium: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  bodyLarge: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400' as const,
  },
  labelLarge: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '700' as const,
  },
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    onPrimary: colors.white,
    secondary: colors.secondary,
    onSecondary: colors.white,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    outline: colors.border,
  },
  fonts: configureFonts({ config: fontConfig }),
  roundness: 24, // More rounded for modern feel
};
