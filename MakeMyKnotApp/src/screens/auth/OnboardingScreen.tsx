import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity as GHTouchableOpacity } from 'react-native-gesture-handler';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: string[];
}

const onboardingData: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Find Your Perfect Match',
    description: 'Discover meaningful connections based on compatibility, values, and shared interests.',
    icon: 'heart',
    gradient: ['#E91E63', '#F48FB1'],
  },
  {
    id: '2',
    title: 'Smart Compatibility',
    description: 'Our advanced algorithm matches you with people who truly understand you.',
    icon: 'analytics',
    gradient: ['#673AB7', '#9C27B0'],
  },
  {
    id: '3',
    title: 'Safe & Secure',
    description: 'Your privacy and safety are our top priority. Connect with confidence.',
    icon: 'shield-checkmark',
    gradient: ['#2196F3', '#03A9F4'],
  },
  {
    id: '4',
    title: 'Start Your Journey',
    description: 'Join thousands of couples who found love through Make My Knot.',
    icon: 'star',
    gradient: ['#FF5722', '#FF9800'],
  },
];

interface OnboardingScreenProps {
  navigation: {
    navigate: (screen: string) => void;
    goBack?: () => void;
  };
}

export default function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const [testCount, setTestCount] = useState(0);
  
  const handleTestButton = () => {
    console.log('🔥🔥🔥 TEST BUTTON PRESSED! Count:', testCount + 1);
    setTestCount(prev => prev + 1);
    Alert.alert('SUCCESS!', `Button pressed ${testCount + 1} times!`);
  };

  const handleSkip = () => {
    console.log('⏭️ SKIP PRESSED!');
    Alert.alert('Skip', 'Skip button works!');
    // Remove navigation dependency for now
    // navigation.navigate('Login');
  };
  
  useEffect(() => {
    console.log('🚀 OnboardingScreen mounted and ready');
    console.log('Navigation prop:', navigation);
  }, []);
  
  useEffect(() => {
    console.log('🔄 Test count changed:', testCount);
  }, [testCount]);

  return (
    <View style={styles.minimalContainer}>
      <Text style={styles.minimalTitle}>Make My Knot</Text>
      <Text style={styles.minimalSubtitle}>Onboarding Screen - Touch Test</Text>
      
      {/* Test 1: Regular TouchableOpacity */}
      <TouchableOpacity
        onPress={handleTestButton}
        style={styles.minimalTestButton}
      >
        <Text style={styles.minimalButtonText}>1. TOUCHABLE OPACITY</Text>
      </TouchableOpacity>
      
      {/* Test 2: Pressable */}
      <Pressable
        onPress={handleTestButton}
        style={styles.minimalTestButton}
      >
        <Text style={styles.minimalButtonText}>2. PRESSABLE</Text>
      </Pressable>
      
      {/* Test 3: Gesture Handler TouchableOpacity */}
      <GHTouchableOpacity
        onPress={handleTestButton}
        style={styles.minimalTestButton}
      >
        <Text style={styles.minimalButtonText}>3. GH TOUCHABLE</Text>
      </GHTouchableOpacity>
      
      {/* Test 4: View with onTouchStart */}
      <View
        onTouchStart={handleTestButton}
        style={[styles.minimalTestButton, { backgroundColor: '#00FF00' }]}
      >
        <Text style={styles.minimalButtonText}>4. VIEW TOUCH START</Text>
      </View>
      
      <TouchableOpacity
        onPress={handleSkip}
        style={styles.minimalSkipButton}
      >
        <Text style={styles.minimalButtonText}>GO TO LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  skipButtonAbsolute: {
    position: 'absolute',
    top: 60,
    right: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: screenWidth,
    height: screenHeight,
  },
  slideGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  slideContent: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
  },
  slideDescription: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  dotsContainerAbsolute: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'white',
    width: 24,
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  footerAbsolute: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  nextButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  scrollContent: {
    flexDirection: 'row',
  },
  testButton: {
    position: 'absolute',
    top: 150,
    left: 24,
    right: 24,
    backgroundColor: '#FF0000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 100,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  // Minimal styles for debugging
  minimalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  minimalTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 16,
  },
  minimalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 50,
    textAlign: 'center',
  },
  minimalTestButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 30,
    width: '80%',
    alignItems: 'center',
  },
  minimalSkipButton: {
    backgroundColor: '#E91E63',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  minimalButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
