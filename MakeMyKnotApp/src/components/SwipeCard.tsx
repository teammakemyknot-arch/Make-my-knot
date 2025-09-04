import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.9;
const CARD_HEIGHT = screenHeight * 0.7;
const SWIPE_THRESHOLD = screenWidth * 0.3;

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  profilePicture: string;
  bio?: string;
  location?: string;
  interests?: string[];
  occupation?: string;
  education?: string;
  photos?: string[];
  religion?: string;
  compatibility?: number;
  verified?: boolean;
  lastActiveAgo?: string;
  distance?: string;
}

interface SwipeCardProps {
  user: UserProfile;
  onSwipeLeft: (user: UserProfile) => void;
  onSwipeRight: (user: UserProfile) => void;
  onSwipeUp?: (user: UserProfile) => void;
  onProfilePress?: (user: UserProfile) => void;
  isStackCard?: boolean;
  index?: number;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  user,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  isStackCard = false,
  index = 0,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotateZ = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const [currentPhotoIndex, setCurrentPhotoIndex] = React.useState(0);
  const photos = user.photos && user.photos.length > 0 ? user.photos : [user.profilePicture];

  useEffect(() => {
    if (isStackCard) {
      const scaleValue = 1 - index * 0.05;
      const yOffset = index * 10;
      scale.setValue(scaleValue);
      translateY.setValue(yOffset);
      opacity.setValue(1 - index * 0.2);
    }
  }, [index, isStackCard]);

  // Create PanResponder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to pan gestures if this is not a stack card
        return !isStackCard && (Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5);
      },
      onPanResponderGrant: (evt, gestureState) => {
        // Set the initial value to the current position
        translateX.setOffset(translateX._value);
        translateY.setOffset(translateY._value);
      },
      onPanResponderMove: (evt, gestureState) => {
        // Update the animated values based on gesture
        translateX.setValue(gestureState.dx);
        translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Flatten the offset to avoid issues with multiple gestures
        translateX.flattenOffset();
        translateY.flattenOffset();

        const { dx, dy, vx } = gestureState;
        const swipeThreshold = screenWidth * 0.25;

        // Super like (swipe up)
        if (dy < -150 && onSwipeUp) {
          animateSwipeUp();
          return;
        }

        // Like (swipe right)
        if (dx > swipeThreshold || vx > 0.5) {
          animateSwipeRight();
          return;
        }

        // Pass (swipe left)
        if (dx < -swipeThreshold || vx < -0.5) {
          animateSwipeLeft();
          return;
        }

        // Return to center
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.spring(translateY, {
            toValue: isStackCard ? index * 10 : 0,
            useNativeDriver: true,
          }),
          Animated.spring(rotateZ, {
            toValue: 0,
            useNativeDriver: true,
          }),
        ]).start();
      },
    })
  ).current;

  const animateSwipeRight = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: screenWidth * 1.5,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onSwipeRight();
    });
  };

  const animateSwipeLeft = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -screenWidth * 1.5,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onSwipeLeft();
    });
  };

  const animateSwipeUp = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -screenHeight,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onSwipeUp?.();
    });
  };

  // Update rotation based on translation
  useEffect(() => {
    const listener = translateX.addListener(({ value }) => {
      const rotation = (value / screenWidth) * 30; // Max 30 degrees
      rotateZ.setValue(rotation);
    });

    return () => {
      translateX.removeListener(listener);
    };
  }, [translateX, rotateZ]);

  const nextPhoto = () => {
    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const previousPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const cardStyle = {
    transform: [
      { translateX },
      { translateY },
      { rotateZ: rotateZ.interpolate({ inputRange: [-30, 30], outputRange: ['-30deg', '30deg'] }) },
      { scale },
    ],
    opacity,
  };

  const likeOpacity = translateX.interpolate({
    inputRange: [0, screenWidth * 0.25],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = translateX.interpolate({
    inputRange: [-screenWidth * 0.25, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const superLikeOpacity = translateY.interpolate({
    inputRange: [-150, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View 
      style={[styles.card, cardStyle]}
      {...panResponder.panHandlers}
    >
        {/* Photo Container */}
        <View style={styles.photoContainer}>
          <TouchableOpacity
            style={styles.photoTouchLeft}
            onPress={previousPhoto}
            activeOpacity={1}
          />
          <TouchableOpacity
            style={styles.photoTouchRight}
            onPress={nextPhoto}
            activeOpacity={1}
          />

          <Image source={{ uri: photos[currentPhotoIndex] }} style={styles.photo} />

          {/* Photo Indicators */}
          {photos.length > 1 && (
            <View style={styles.photoIndicators}>
              {photos.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.photoIndicator,
                    idx === currentPhotoIndex && styles.activePhotoIndicator,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Overlay Labels */}
          <Animated.View style={[styles.likeLabel, { opacity: likeOpacity }]}>
            <Text style={styles.likeLabelText}>LIKE</Text>
          </Animated.View>

          <Animated.View style={[styles.nopeLabel, { opacity: nopeOpacity }]}>
            <Text style={styles.nopeLabelText}>NOPE</Text>
          </Animated.View>

          <Animated.View style={[styles.superLikeLabel, { opacity: superLikeOpacity }]}>
            <Text style={styles.superLikeLabelText}>SUPER LIKE</Text>
          </Animated.View>

          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
            locations={[0.3, 1]}
          >
            {/* User Info */}
            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>
                  {user.firstName} {user.lastName}
                </Text>
                <Text style={styles.age}>{user.age}</Text>
              </View>

              {user.occupation && (
                <View style={styles.infoRow}>
                  <Ionicons name="briefcase-outline" size={16} color="white" />
                  <Text style={styles.infoText}>{user.occupation}</Text>
                </View>
              )}

              {user.education && (
                <View style={styles.infoRow}>
                  <Ionicons name="school-outline" size={16} color="white" />
                  <Text style={styles.infoText}>{user.education}</Text>
                </View>
              )}

              {user.location && (
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={16} color="white" />
                  <Text style={styles.infoText}>{user.location}</Text>
                </View>
              )}

              {user.bio && (
                <Text style={styles.bio} numberOfLines={2}>
                  {user.bio}
                </Text>
              )}

              {/* Interests */}
              {user.interests && user.interests.length > 0 && (
                <View style={styles.interestsContainer}>
                  {user.interests.slice(0, 3).map((interest, idx) => (
                    <View key={idx} style={styles.interestTag}>
                      <Text style={styles.interestText}>{interest}</Text>
                    </View>
                  ))}
                  {user.interests.length > 3 && (
                    <View style={styles.interestTag}>
                      <Text style={styles.interestText}>+{user.interests.length - 3}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </LinearGradient>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionButton, styles.passButton]} onPress={animateSwipeLeft}>
            <Ionicons name="close" size={32} color="#ff4458" />
          </TouchableOpacity>

          {onSwipeUp && (
            <TouchableOpacity style={[styles.actionButton, styles.superLikeButton]} onPress={animateSwipeUp}>
              <Ionicons name="star" size={24} color="#00bcd4" />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={animateSwipeRight}>
            <Ionicons name="heart" size={28} color="#4caf50" />
          </TouchableOpacity>
        </View>
    </Animated.View>
  );
};

const styles = {
  card: {
    width: screenWidth - 40,
    height: screenHeight * 0.75,
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 20,
    position: 'absolute' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  photoContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden' as const,
    position: 'relative' as const,
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover' as const,
  },
  photoTouchLeft: {
    position: 'absolute' as const,
    left: 0,
    top: 0,
    width: '50%',
    height: '70%',
    zIndex: 10,
  },
  photoTouchRight: {
    position: 'absolute' as const,
    right: 0,
    top: 0,
    width: '50%',
    height: '70%',
    zIndex: 10,
  },
  photoIndicators: {
    position: 'absolute' as const,
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row' as const,
    zIndex: 5,
  },
  photoIndicator: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  activePhotoIndicator: {
    backgroundColor: 'white',
  },
  gradient: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end' as const,
    padding: 20,
  },
  userInfo: {
    marginBottom: 80,
  },
  nameRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: 'white',
    marginRight: 8,
  },
  age: {
    fontSize: 24,
    color: 'white',
    fontWeight: '300' as const,
  },
  infoRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
    opacity: 0.9,
  },
  bio: {
    fontSize: 16,
    color: 'white',
    lineHeight: 22,
    marginTop: 8,
    opacity: 0.9,
  },
  interestsContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginTop: 12,
  },
  interestTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  interestText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500' as const,
  },
  actionButtons: {
    position: 'absolute' as const,
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  passButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#ff4458',
  },
  likeButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#4caf50',
  },
  superLikeButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#00bcd4',
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  likeLabel: {
    position: 'absolute' as const,
    top: 100,
    right: 20,
    backgroundColor: '#4caf50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    transform: [{ rotate: '15deg' }],
    zIndex: 5,
  },
  likeLabelText: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: 'white',
    letterSpacing: 2,
  },
  nopeLabel: {
    position: 'absolute' as const,
    top: 100,
    left: 20,
    backgroundColor: '#ff4458',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    transform: [{ rotate: '-15deg' }],
    zIndex: 5,
  },
  nopeLabelText: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: 'white',
    letterSpacing: 2,
  },
  superLikeLabel: {
    position: 'absolute' as const,
    top: 80,
    left: '50%',
    marginLeft: -60,
    backgroundColor: '#00bcd4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 5,
  },
  superLikeLabelText: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: 'white',
    textAlign: 'center' as const,
    letterSpacing: 1,
  },
};

export default SwipeCard;
