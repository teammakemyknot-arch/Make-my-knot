import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
  borderRadius?: 'small' | 'medium' | 'large' | 'full';
  onPress?: () => void;
  style?: ViewStyle;
  gradientColors?: string[];
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  margin = 'none',
  borderRadius = 'medium',
  onPress,
  style,
  gradientColors = [theme.colors.primary, theme.colors.secondary],
}) => {
  const cardStyle = [
    styles.base,
    styles[`${variant}Variant`],
    styles[`${padding}Padding`],
    styles[`${margin}Margin`],
    styles[`${borderRadius}BorderRadius`],
    style,
  ];

  const CardContent = () => (
    <View style={cardStyle}>
      {children}
    </View>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={onPress ? 0.8 : 1}
        style={[styles[`${margin}Margin`], style]}
      >
        <LinearGradient
          colors={gradientColors}
          style={[
            styles.base,
            styles.gradientContainer,
            styles[`${padding}Padding`],
            styles[`${borderRadius}BorderRadius`],
          ]}
        >
          {children}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[styles[`${margin}Margin`], style]}
      >
        <View style={[cardStyle, { margin: 0 }]}>
          {children}
        </View>
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.background,
  },
  defaultVariant: {
    backgroundColor: theme.colors.background,
  },
  elevatedVariant: {
    backgroundColor: theme.colors.background,
    ...theme.shadows.medium,
  },
  outlinedVariant: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  gradientContainer: {
    backgroundColor: 'transparent',
  },
  nonePadding: {
    padding: 0,
  },
  smallPadding: {
    padding: theme.spacing.sm,
  },
  mediumPadding: {
    padding: theme.spacing.md,
  },
  largePadding: {
    padding: theme.spacing.lg,
  },
  noneMargin: {
    margin: 0,
  },
  smallMargin: {
    margin: theme.spacing.sm,
  },
  mediumMargin: {
    margin: theme.spacing.md,
  },
  largeMargin: {
    margin: theme.spacing.lg,
  },
  smallBorderRadius: {
    borderRadius: theme.borderRadius.small,
  },
  mediumBorderRadius: {
    borderRadius: theme.borderRadius.medium,
  },
  largeBorderRadius: {
    borderRadius: theme.borderRadius.large,
  },
  fullBorderRadius: {
    borderRadius: theme.borderRadius.full,
  },
});

export default Card;
