import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SwipeCard, { UserProfile } from '../../components/SwipeCard';
import { Button } from '../../components/ui';
import { theme } from '../../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function MatchesScreen({ navigation }: { navigation: any }) {
  const [profiles, setProfiles] = useState<UserProfile[]>([
    {
      id: '1',
      firstName: 'Priya',
      lastName: 'Sharma',
      age: 26,
      profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
      photos: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
      ],
      bio: 'Software engineer who loves traveling and exploring new cuisines. Looking for someone genuine and family-oriented.',
      location: 'Mumbai, Maharashtra',
      occupation: 'Software Engineer',
      education: 'IIT Bombay',
      religion: 'Hindu',
      interests: ['Travel', 'Cooking', 'Reading', 'Yoga', 'Movies'],
      compatibility: 92,
      verified: true,
      lastActiveAgo: 'Online now',
      distance: '2 km away',
    },
    {
      id: '2',
      firstName: 'Anjali',
      lastName: 'Patel',
      age: 28,
      profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop',
      photos: [
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      ],
      bio: 'Doctor passionate about helping people. Love classical music and enjoy weekend getaways.',
      location: 'Ahmedabad, Gujarat',
      occupation: 'Doctor',
      education: 'AIIMS Delhi',
      religion: 'Hindu',
      interests: ['Music', 'Travel', 'Books', 'Dancing', 'Volunteering'],
      compatibility: 89,
      verified: true,
      lastActiveAgo: '5 minutes ago',
      distance: '12 km away',
    },
    {
      id: '3',
      firstName: 'Kavya',
      lastName: 'Singh',
      age: 25,
      profilePicture: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
      photos: [
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
      ],
      bio: 'Teacher with a passion for education and making a difference. Love painting and spending time with family.',
      location: 'Delhi, India',
      occupation: 'Teacher',
      education: 'Delhi University',
      religion: 'Hindu',
      interests: ['Art', 'Teaching', 'Family Time', 'Painting', 'Nature'],
      compatibility: 87,
      verified: false,
      lastActiveAgo: '1 hour ago',
      distance: '8 km away',
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchCount, setMatchCount] = useState(8);
  const [superLikesLeft, setSuperLikesLeft] = useState(1);
  const [isOutOfProfiles, setIsOutOfProfiles] = useState(false);

  const handleSwipeLeft = (user: UserProfile) => {
    console.log('Passed on:', user.firstName);
    moveToNext();
  };

  const handleSwipeRight = (user: UserProfile) => {
    console.log('Liked:', user.firstName);
    setMatchCount(prev => prev + 1);
    
    // Simulate match (30% chance)
    if (Math.random() < 0.3) {
      Alert.alert(
        '🎉 It\'s a Match!',
        `You and ${user.firstName} liked each other! Start chatting now.`,
        [
          { text: 'Keep Swiping', style: 'cancel' },
          {
            text: 'Send Message',
            onPress: () => navigation.navigate('Messages', { matchId: user.id }),
          },
        ]
      );
    }
    
    moveToNext();
  };

  const handleSuperLike = (user: UserProfile) => {
    if (superLikesLeft <= 0) {
      Alert.alert(
        'No Super Likes Left',
        'Upgrade to Premium to get unlimited Super Likes!',
        [
          { text: 'Maybe Later', style: 'cancel' },
          {
            text: 'Upgrade Now',
            onPress: () => navigation.navigate('Subscription'),
          },
        ]
      );
      return;
    }

    console.log('Super liked:', user.firstName);
    setSuperLikesLeft(prev => prev - 1);
    setMatchCount(prev => prev + 1);
    
    // Super like has higher match chance (60%)
    if (Math.random() < 0.6) {
      Alert.alert(
        '⭐ Super Match!',
        `${user.firstName} was impressed by your Super Like! You matched!`,
        [
          { text: 'Keep Swiping', style: 'cancel' },
          {
            text: 'Send Message',
            onPress: () => navigation.navigate('Messages', { matchId: user.id }),
          },
        ]
      );
    }
    
    moveToNext();
  };

  const handleProfilePress = (user: UserProfile) => {
    navigation.navigate('UserProfile', { userId: user.id, user });
  };

  const moveToNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= profiles.length) {
      setIsOutOfProfiles(true);
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  const loadMoreProfiles = () => {
    // Simulate loading more profiles
    const newProfiles = [
      {
        id: '4',
        firstName: 'Meera',
        lastName: 'Gupta',
        age: 27,
        profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
        photos: [
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
        ],
        bio: 'Marketing professional who loves adventure sports and traveling.',
        location: 'Bangalore, Karnataka',
        occupation: 'Marketing Manager',
        education: 'IIM Bangalore',
        religion: 'Hindu',
        interests: ['Adventure Sports', 'Travel', 'Marketing'],
        compatibility: 85,
        verified: true,
        lastActiveAgo: '30 minutes ago',
        distance: '5 km away',
      },
    ];
    
    setProfiles([...profiles, ...newProfiles]);
    setIsOutOfProfiles(false);
  };

  const renderStackCards = () => {
    const stackCards = [];
    for (let i = currentIndex + 1; i < Math.min(currentIndex + 3, profiles.length); i++) {
      stackCards.push(
        <SwipeCard
          key={profiles[i].id}
          user={profiles[i]}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          onSwipeUp={handleSuperLike}
          onProfilePress={handleProfilePress}
          isStackCard
          index={i - currentIndex - 1}
        />
      );
    }
    return stackCards;
  };

  if (isOutOfProfiles) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="heart" size={80} color={theme.colors.textSecondary} />
          <Text style={styles.emptyTitle}>No More Profiles</Text>
          <Text style={styles.emptySubtitle}>
            You've seen all available profiles in your area. Check back later for new matches!
          </Text>
          
          <View style={styles.emptyActions}>
            <Button
              title="Expand Search Area"
              onPress={() => navigation.navigate('Preferences')}
              variant="outline"
              icon={<Ionicons name="location-outline" size={20} color={theme.colors.primary} />}
              style={styles.actionButton}
            />
            
            <Button
              title="Load More"
              onPress={loadMoreProfiles}
              variant="primary"
              style={styles.actionButton}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.navigate('Preferences')}
        >
          <Ionicons name="options-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.appTitle}>Discover</Text>
          <View style={styles.superLikesContainer}>
            <Ionicons name="star" size={14} color={theme.colors.gold} />
            <Text style={styles.superLikesText}>{superLikesLeft} Super Likes</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.navigate('Messages')}
        >
          <Ionicons name="chatbubbles-outline" size={24} color={theme.colors.text} />
          {matchCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{matchCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Cards Container */}
      <View style={styles.cardsContainer}>
        {/* Stack Cards */}
        {renderStackCards()}
        
        {/* Current Card */}
        {currentIndex < profiles.length && (
          <SwipeCard
            key={profiles[currentIndex].id}
            user={profiles[currentIndex]}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            onSwipeUp={handleSuperLike}
            onProfilePress={handleProfilePress}
          />
        )}
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <Text style={styles.instructionText}>
          Swipe right to like, left to pass, or up for super like
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerCenter: {
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  superLikesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  superLikesText: {
    fontSize: 12,
    color: theme.colors.gold,
    marginLeft: 4,
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing.md,
  },
  bottomActions: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  emptyActions: {
    width: '100%',
    gap: theme.spacing.md,
  },
  actionButton: {
    marginBottom: theme.spacing.sm,
  },
});
