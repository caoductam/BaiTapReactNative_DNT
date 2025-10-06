// src/styles/styles.js
import { StyleSheet, Platform } from 'react-native';

/**
 * Common colors used throughout the app
 */
export const colors = {
  // Primary
  primary: '#007AFF',
  primaryDark: '#0051D5',
  primaryLight: '#4DA6FF',
  
  // Background
  background: '#F8F9FA',
  backgroundDark: '#1A1A1A',
  surface: '#FFFFFF',
  surfaceDark: '#2A2A2A',
  
  // Text
  text: '#212529',
  textDark: '#FFFFFF',
  textSecondary: '#6C757D',
  textSecondaryDark: '#AAAAAA',
  textTertiary: '#ADB5BD',
  
  // Border
  border: '#E9ECEF',
  borderDark: '#3A3A3A',
  
  // Status
  success: '#28A745',
  danger: '#DC3545',
  warning: '#FFC107',
  info: '#17A2B8',
  
  // Other
  overlay: 'rgba(0, 0, 0, 0.6)',
  shadow: '#000000',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

/**
 * Common spacing values
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

/**
 * Common font sizes
 */
export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 32,
};

/**
 * Common border radius values
 */
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 999,
};

/**
 * Common shadow styles
 */
export const shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    android: {
      elevation: 2,
    },
    web: {
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
    },
  }),
  
  md: Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
    web: {
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)',
    },
  }),
  
  lg: Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 16,
    },
    android: {
      elevation: 8,
    },
    web: {
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.16)',
    },
  }),
};

/**
 * Common text styles
 */
export const typography = StyleSheet.create({
  h1: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    color: colors.text,
  },
  h2: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
  },
  h3: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.text,
  },
  h4: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  body: {
    fontSize: fontSize.md,
    fontWeight: '400',
    color: colors.text,
  },
  bodyBold: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  caption: {
    fontSize: fontSize.sm,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  small: {
    fontSize: fontSize.xs,
    fontWeight: '400',
    color: colors.textTertiary,
  },
});

/**
 * Common button styles
 */
export const buttons = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/**
 * Common container styles
 */
export const containers = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenDark: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  section: {
    padding: spacing.lg,
  },
});

/**
 * Common input styles
 */
export const inputs = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
  },
  input: {
    padding: spacing.lg,
    fontSize: fontSize.md,
    color: colors.text,
  },
  multiline: {
    padding: spacing.lg,
    fontSize: fontSize.md,
    color: colors.text,
    minHeight: 120,
    textAlignVertical: 'top',
  },
});

/**
 * Export all styles as default
 */
export default {
  colors,
  spacing,
  fontSize,
  borderRadius,
  shadows,
  typography,
  buttons,
  containers,
  inputs,
};