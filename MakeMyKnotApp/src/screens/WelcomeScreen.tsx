import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width, height } = Dimensions.get('window');

type WelcomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Welcome'>;
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
      {/* Background with gradient overlay */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary, theme.colors.accent]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          
          {/* Logo and App Name */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="heart" size={60} color="#FFFFFF" />
            </View>
            <Text style={styles.appName}>Make My Knot</Text>
            <Text style={styles.tagline}>Find Your Perfect Life Partner</Text>
          </View>

          {/* Features Section */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="people" size={24} color="#FFFFFF" />
              <Text style={styles.featureText}>Trusted Profiles</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark" size={24} color="#FFFFFF" />
              <Text style={styles.featureText}>Verified Members</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="heart-circle" size={24} color="#FFFFFF" />
              <Text style={styles.featureText}>Perfect Matches</Text>
            </View>
          </View>

          {/* Success Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>10K+</Text>
              <Text style={styles.statLabel}>Happy Couples</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>50K+</Text>
              <Text style={styles.statLabel}>Trusted Profiles</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>95%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Create Account</Text>
              <Ionicons name="arrow-forward" size={20} color={theme.colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Already have an account? Login</Text>
            </TouchableOpacity>
          </View>

          {/* Privacy Note */}
          <Text style={styles.privacyNote}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
            Your privacy and security are our top priority.
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  appName: {
    fontSize: theme.fonts.sizes.xxlarge,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.sm,
  },
  tagline: {
    fontSize: theme.fonts.sizes.large,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.xxl,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureText: {
    color: '#FFFFFF',
    fontSize: theme.fonts.sizes.medium,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.xxl,
    paddingVertical: theme.spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.large,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: theme.fonts.sizes.xlarge,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: theme.fonts.sizes.medium,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  buttonsContainer: {
    marginBottom: theme.spacing.xl,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  primaryButtonText: {
    color: theme.colors.primary,
    fontSize: theme.fonts.sizes.large,
    fontWeight: 'bold',
    marginRight: theme.spacing.sm,
  },
  secondaryButton: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: theme.fonts.sizes.medium,
    textDecorationLine: 'underline',
  },
  privacyNote: {
    color: '#FFFFFF',
    fontSize: theme.fonts.sizes.small,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 18,
  },
});

export default WelcomeScreen;
