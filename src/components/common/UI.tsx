import React, { useEffect } from 'react';
import { 
  TouchableOpacity, 
  View, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle,
  TextInput as RNTextInput,
  Pressable
} from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  FadeIn
} from 'react-native-reanimated';
import { colors, shadows } from '../../config/theme';

interface ButtonProps {
  onPress: () => void;
  title: string;
  type?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textColor?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<ButtonProps> = ({ 
  onPress, 
  title, 
  type = 'primary', 
  size = 'medium',
  icon,
  loading,
  disabled,
  style,
  textColor
}) => {
  const isOutline = type === 'outline';
  const isGhost = type === 'ghost';
  const isSecondary = type === 'secondary';
  
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePressIn = () => { scale.value = withSpring(0.96); };
  const handlePressOut = () => { scale.value = withSpring(1); };

  return (
    <AnimatedPressable 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.buttonBase,
        size === 'small' && styles.buttonSmall,
        size === 'large' && styles.buttonLarge,
        type === 'primary' && { backgroundColor: colors.primary },
        isSecondary && { backgroundColor: colors.secondaryLight },
        isOutline && { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: textColor || colors.primary },
        isGhost && { backgroundColor: 'transparent' },
        disabled && { opacity: 0.5 },
        style,
        animatedStyle
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor || (isOutline || isGhost ? colors.primary : colors.white)} size="small" />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <MaterialCommunityIcons name={icon} size={20} color={textColor || (isOutline || isGhost ? colors.primary : colors.white)} style={{ marginRight: 8 }} />}
          <Text style={[
            styles.buttonText,
            size === 'small' && { fontSize: 12 },
            size === 'large' && { fontSize: 18 },
            (isOutline || isGhost) && { color: textColor || colors.primary },
            isSecondary && { color: colors.secondary },
            textColor ? { color: textColor } : {}
          ]}>
            {title}
          </Text>
        </View>
      )}
    </AnimatedPressable>
  );
};

export const Card: React.FC<{ children: React.ReactNode; style?: ViewStyle; onPress?: () => void }> = ({ children, style, onPress }) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePressIn = () => { if (onPress) scale.value = withSpring(0.98); };
  const handlePressOut = () => { if (onPress) scale.value = withSpring(1); };

  if (onPress) {
    return (
      <AnimatedPressable 
        onPress={onPress} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, shadows.soft, style, animatedStyle]}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <View style={[styles.card, shadows.soft, style]}>
      {children}
    </View>
  );
};

export const Badge: React.FC<{ label: string; color?: string; style?: ViewStyle }> = ({ label, color = colors.primary, style }) => (
  <View style={[styles.badge, { backgroundColor: color + '15' }, style]}>
    <Text style={[styles.badgeText, { color: color }]}>{label}</Text>
  </View>
);

export const Input: React.FC<any> = ({ icon, error, containerStyle, ...props }) => (
  <View style={[styles.inputWrapper, containerStyle]}>
    <View style={[
      styles.inputContainer, 
      error && { borderColor: colors.error, backgroundColor: colors.error + '05' },
      props.multiline && { height: 100, alignItems: 'flex-start', paddingTop: 12 }
    ]}>
      {icon && <MaterialCommunityIcons name={icon} size={20} color={error ? colors.error : colors.gray} style={{ marginRight: 12, marginTop: props.multiline ? 4 : 0 }} />}
      <RNTextInput 
        placeholderTextColor={colors.grayLight}
        style={[styles.input, props.multiline && { textAlignVertical: 'top' }]}
        {...props}
      />
    </View>
    {error?.message && (
      <Text style={styles.errorText}>{error.message}</Text>
    )}
  </View>
);

export const Skeleton: React.FC<{ width?: number | string; height?: number; style?: ViewStyle }> = ({ width = '100%', height = 20, style }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View 
      style={[
        styles.skeleton, 
        { width: width as any, height }, 
        style, 
        animatedStyle
      ]} 
    />
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  buttonSmall: {
    height: 40,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  buttonLarge: {
    height: 64,
    borderRadius: 22,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 15,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.grayLightest,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  inputWrapper: {
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayLightest,
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.dark,
    fontWeight: '500',
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    marginLeft: 4,
  },
  skeleton: {
    backgroundColor: colors.grayLighter,
    borderRadius: 12,
  },
});
