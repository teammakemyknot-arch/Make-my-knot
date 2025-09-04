import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  showCloseButton?: boolean;
  closeOnBackdropPress?: boolean;
  scrollable?: boolean;
  animationType?: 'slide' | 'fade' | 'none';
  position?: 'center' | 'bottom';
}

const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnBackdropPress = true,
  scrollable = false,
  animationType = 'slide',
  position = 'center',
}) => {
  const getModalStyle = () => {
    const baseStyle = {
      backgroundColor: theme.colors.background,
      borderRadius: position === 'bottom' ? 20 : theme.borderRadius.large,
      ...theme.shadows.medium,
    };

    switch (size) {
      case 'small':
        return {
          ...baseStyle,
          width: SCREEN_WIDTH * 0.8,
          maxHeight: SCREEN_HEIGHT * 0.4,
        };
      case 'medium':
        return {
          ...baseStyle,
          width: SCREEN_WIDTH * 0.9,
          maxHeight: SCREEN_HEIGHT * 0.6,
        };
      case 'large':
        return {
          ...baseStyle,
          width: SCREEN_WIDTH * 0.95,
          maxHeight: SCREEN_HEIGHT * 0.8,
        };
      case 'fullscreen':
        return {
          ...baseStyle,
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          borderRadius: 0,
        };
      default:
        return baseStyle;
    }
  };

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  const Content = () => (
    <View style={[styles.modalContent, getModalStyle()]}>
      {(title || showCloseButton) && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {showCloseButton && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          )}
        </View>
      )}
      
      <View style={styles.body}>
        {scrollable ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </View>
    </View>
  );

  return (
    <RNModal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleBackdropPress}
        >
          <SafeAreaView style={styles.safeArea}>
            <View
              style={[
                styles.modalContainer,
                position === 'bottom' ? styles.bottomModal : styles.centerModal,
              ]}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {}} // Prevent backdrop press propagation
              >
                <Content />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  safeArea: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
  },
  centerModal: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  bottomModal: {
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fonts.sizes.large,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
  },
  closeButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  body: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default Modal;
