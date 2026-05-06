import { MD3LightTheme, configureFonts } from 'react-native-paper';

export const colors = {
  primary: '#EB1414',
  primaryDark: '#C00000',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  textPrimary: '#1A1A1A',
  textSecondary: '#555555',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  border: '#DDDDDD',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#888888',
  lightGray: '#F5F5F5',
};

const fontConfig = {
  displayLarge: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '700' as const,
  },
  displayMedium: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '700' as const,
  },
  displaySmall: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '700' as const,
  },
  headlineLarge: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '600' as const,
  },
  headlineMedium: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '600' as const,
  },
  headlineSmall: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '600' as const,
  },
  titleLarge: {
    fontFamily: 'System',
    fontSize: 20,
    fontWeight: '600' as const,
  },
  titleMedium: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  titleSmall: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  bodyLarge: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontFamily: 'System',
    fontSize: 15,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400' as const,
  },
  labelLarge: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500' as const,
  },
  labelMedium: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '500' as const,
  },
  labelSmall: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '500' as const,
  },
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    onPrimary: colors.white,
    primaryContainer: colors.primaryDark,
    onPrimaryContainer: colors.white,
    secondary: colors.primaryDark,
    onSecondary: colors.white,
    background: colors.background,
    onBackground: colors.textPrimary,
    surface: colors.surface,
    onSurface: colors.textPrimary,
    error: colors.error,
    onError: colors.white,
    outline: colors.border,
  },
  fonts: configureFonts({ config: fontConfig }),
  roundness: 12,
};
