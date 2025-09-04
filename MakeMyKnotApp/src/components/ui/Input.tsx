import React, { useState, forwardRef } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  containerStyle?: ViewStyle;
  required?: boolean;
  showCharacterCount?: boolean;
  maxLength?: number;
}

const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = 'outlined',
  size = 'medium',
  containerStyle,
  required = false,
  showCharacterCount = false,
  maxLength,
  style,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState(props.value || props.defaultValue || '');

  const handleChangeText = (text: string) => {
    setValue(text);
    if (props.onChangeText) {
      props.onChangeText(text);
    }
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  const inputContainerStyle = [
    styles.inputContainer,
    styles[`${variant}Container`],
    styles[`${size}Container`],
    isFocused && styles[`${variant}Focused`],
    error && styles.errorContainer,
    props.editable === false && styles.disabledContainer,
  ];

  const inputStyle = [
    styles.input,
    styles[`${size}Input`],
    leftIcon && styles.inputWithLeftIcon,
    rightIcon && styles.inputWithRightIcon,
    style,
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, error && styles.errorLabel]}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}
      
      <View style={inputContainerStyle}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Ionicons 
              name={leftIcon as any} 
              size={20} 
              color={isFocused ? theme.colors.primary : theme.colors.textSecondary} 
            />
          </View>
        )}
        
        <TextInput
          ref={ref}
          style={inputStyle}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={theme.colors.textSecondary}
          selectionColor={theme.colors.primary}
          maxLength={maxLength}
          {...props}
        />
        
        {rightIcon && (
          <TouchableOpacity 
            style={styles.rightIconContainer}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            <Ionicons 
              name={rightIcon as any} 
              size={20} 
              color={isFocused ? theme.colors.primary : theme.colors.textSecondary} 
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.messageContainer}>
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          {!error && hint && (
            <Text style={styles.hintText}>{hint}</Text>
          )}
        </View>
        
        {showCharacterCount && maxLength && (
          <Text style={styles.characterCount}>
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.sm,
  },
  labelContainer: {
    marginBottom: theme.spacing.xs,
  },
  label: {
    fontSize: theme.fonts.sizes.medium,
    fontWeight: '500',
    color: theme.colors.text,
  },
  errorLabel: {
    color: theme.colors.error,
  },
  required: {
    color: theme.colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  outlinedContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.background,
  },
  filledContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
  },
  smallContainer: {
    minHeight: 36,
  },
  mediumContainer: {
    minHeight: 44,
  },
  largeContainer: {
    minHeight: 52,
  },
  defaultFocused: {
    borderBottomColor: theme.colors.primary,
    borderBottomWidth: 2,
  },
  outlinedFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  filledFocused: {
    borderBottomColor: theme.colors.primary,
  },
  errorContainer: {
    borderColor: theme.colors.error,
  },
  disabledContainer: {
    backgroundColor: theme.colors.surface,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.sm,
    ...Platform.select({
      ios: {
        paddingVertical: theme.spacing.sm,
      },
      android: {
        paddingVertical: theme.spacing.xs,
        textAlignVertical: 'center',
      },
    }),
  },
  smallInput: {
    fontSize: theme.fonts.sizes.small,
  },
  mediumInput: {
    fontSize: theme.fonts.sizes.medium,
  },
  largeInput: {
    fontSize: theme.fonts.sizes.large,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  leftIconContainer: {
    paddingLeft: theme.spacing.sm,
    paddingRight: theme.spacing.xs,
  },
  rightIconContainer: {
    paddingRight: theme.spacing.sm,
    paddingLeft: theme.spacing.xs,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  messageContainer: {
    flex: 1,
  },
  errorText: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.error,
  },
  hintText: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.textSecondary,
  },
  characterCount: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
});

Input.displayName = 'Input';

export default Input;
