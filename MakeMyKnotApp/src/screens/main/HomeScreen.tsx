import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';

interface RecommendedProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  profession: string;
  education: string;
  religion: string;
  image: string;
  compatibility: number;
}

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  screen: string;
}

const HomeScreen = ({ navigation }: any) => {
  const [userName, setUserName] = useState('Rahul');
  const [stats, setStats] = useState({
    profileViews: 45,
    interests: 12,
    matches: 8,
    messages: 3
  });
  
  const [recommendedProfiles, setRecommendedProfiles] = useState<RecommendedProfile[]>([
    {
      id: '1',
      name: 'Priya Sharma',
      age: 26,
      location: 'Mumbai, India',
      profession: 'Software Engineer',
      education: 'IIT Delhi',
      religion: 'Hindu',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
      compatibility: 92
    },
    {
      id: '2',
      name: 'Anjali Patel',
      age: 28,
      location: 'Ahmedabad, India',
      profession: 'Doctor',
      education: 'AIIMS Delhi',
      religion: 'Hindu',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop',
      compatibility: 89
    },
    {
      id: '3',
      name: 'Kavya Singh',
      age: 25,
      location: 'Delhi, India',
      profession: 'Teacher',
      education: 'DU',
      religion: 'Hindu',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
      compatibility: 87
    }
  ]);

  const quickActions: QuickAction[] = [
    { id: '1', title: 'Search', icon: 'search', color: theme.colors.primary, screen: 'Search' },
    { id: '2', title: 'Matches', icon: 'heart', color: theme.colors.error, screen: 'Matches' },
    { id: '3', title: 'Messages', icon: 'chatbubbles', color: theme.colors.success, screen: 'Messages' },
    { id: '4', title: 'Profile', icon: 'person', color: theme.colors.accent, screen: 'Profile' }
  ];

  const sendInterest = (profileId: string) => {
    console.log('Sending interest to:', profileId);
    // Implement interest sending logic
  };

  const renderRecommendedProfile = ({ item }: { item: RecommendedProfile }) => (
    <TouchableOpacity style={styles.profileCard}>
      <Image source={{ uri: item.image }} style={styles.profileImage} />
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{item.name}</Text>
        <Text style={styles.profileAge}>{item.age} years</Text>
        <Text style={styles.profileLocation}>{item.location}</Text>
        <Text style={styles.profileProfession}>{item.profession}</Text>
        <View style={styles.compatibilityRow}>
          <Text style={styles.compatibilityText}>{item.compatibility}% Match</Text>
          <View style={styles.compatibilityBar}>
            <View 
              style={[styles.compatibilityFill, { width: `${item.compatibility}%` }]} 
            />
          </View>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.interestButton}
        onPress={() => sendInterest(item.id)}
      >
        <Ionicons name="heart" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderQuickAction = ({ item }: { item: QuickAction }) => (
    <TouchableOpacity 
      style={[styles.quickActionCard, { backgroundColor: item.color }]}
      onPress={() => navigation.navigate(item.screen)}
    >
      <Ionicons name={item.icon as any} size={24} color="#FFFFFF" />
      <Text style={styles.quickActionText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Namaste, {userName} 🙏</Text>
            <Text style={styles.taglineText}>Find your perfect life partner</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>{stats.profileViews}</Text>
            <Text style={styles.statsLabel}>Profile Views</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>{stats.interests}</Text>
            <Text style={styles.statsLabel}>Interests</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>{stats.matches}</Text>
            <Text style={styles.statsLabel}>Matches</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>{stats.messages}</Text>
            <Text style={styles.statsLabel}>Messages</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <FlatList
            data={quickActions}
            renderItem={renderQuickAction}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsContainer}
          />
        </View>

        {/* Premium Banner */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={styles.premiumBanner}
        >
          <View style={styles.premiumContent}>
            <Ionicons name="diamond" size={32} color="#FFFFFF" />
            <View style={styles.premiumText}>
              <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
              <Text style={styles.premiumSubtitle}>Get unlimited access to premium features</Text>
            </View>
            <TouchableOpacity style={styles.premiumButton}>
              <Text style={styles.premiumButtonText}>Upgrade</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Recommended Profiles */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {recommendedProfiles.map((profile) => (
            <View key={profile.id}>
              {renderRecommendedProfile({ item: profile })}
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <Ionicons name="eye" size={20} color={theme.colors.primary} />
            <Text style={styles.activityText}>Sarah viewed your profile</Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
          <View style={styles.activityCard}>
            <Ionicons name="heart" size={20} color={theme.colors.error} />
            <Text style={styles.activityText}>You have a new match!</Text>
            <Text style={styles.activityTime}>1 day ago</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  welcomeText: {
    fontSize: theme.fonts.sizes.xlarge,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  taglineText: {
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  notificationButton: {
    position: 'relative',
    padding: theme.spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 8,
    height: 8,
    backgroundColor: theme.colors.error,
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  statsCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    ...theme.shadows.small,
  },
  statsNumber: {
    fontSize: theme.fonts.sizes.xlarge,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statsLabel: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  sectionContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fonts.sizes.large,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  viewAllText: {
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  quickActionsContainer: {
    paddingVertical: theme.spacing.sm,
  },
  quickActionCard: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    ...theme.shadows.small,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: theme.fonts.sizes.small,
    fontWeight: '500',
    marginTop: theme.spacing.xs,
  },
  premiumBanner: {
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumText: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  premiumTitle: {
    color: '#FFFFFF',
    fontSize: theme.fonts.sizes.large,
    fontWeight: 'bold',
  },
  premiumSubtitle: {
    color: '#FFFFFF',
    fontSize: theme.fonts.sizes.medium,
    opacity: 0.9,
    marginTop: theme.spacing.xs,
  },
  premiumButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  premiumButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  profileCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.large,
  },
  profileInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  profileName: {
    fontSize: theme.fonts.sizes.large,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  profileAge: {
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  profileLocation: {
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.textSecondary,
  },
  profileProfession: {
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  compatibilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  compatibilityText: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.success,
    fontWeight: '500',
    marginRight: theme.spacing.sm,
  },
  compatibilityBar: {
    flex: 1,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
  },
  compatibilityFill: {
    height: '100%',
    backgroundColor: theme.colors.success,
    borderRadius: 2,
  },
  interestButton: {
    backgroundColor: theme.colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.sm,
  },
  activityText: {
    flex: 1,
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  activityTime: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.textSecondary,
  },
});

export default HomeScreen;
