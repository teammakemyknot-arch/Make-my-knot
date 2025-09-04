import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Button, Card } from '../../components/ui';
import { theme } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phone: string;
  profilePicture: string;
  photos: string[];
  bio: string;
  location: string;
  occupation: string;
  education: string;
  religion: string;
  height: string;
  interests: string[];
  verified: boolean;
  profileViews: number;
  profileCompleteness: number;
}

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const [user, setUser] = useState<UserProfile>({
    id: '1',
    firstName: 'Rahul',
    lastName: 'Sharma',
    age: 28,
    email: 'rahul.sharma@example.com',
    phone: '+91 9876543210',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    ],
    bio: 'Software engineer passionate about technology and travel. Looking for someone who shares similar interests and values.',
    location: 'Mumbai, Maharashtra',
    occupation: 'Software Engineer',
    education: 'IIT Delhi - Computer Science',
    religion: 'Hindu',
    height: '5\'9"',
    interests: ['Travel', 'Technology', 'Music', 'Reading', 'Cooking', 'Photography'],
    verified: true,
    profileViews: 245,
    profileCompleteness: 85,
  });

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const menuItems = [
    {
      id: 'edit-profile',
      title: 'Edit Profile',
      icon: 'person-outline',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      id: 'preferences',
      title: 'Preferences',
      icon: 'options-outline',
      onPress: () => navigation.navigate('Preferences'),
    },
    {
      id: 'privacy',
      title: 'Privacy & Safety',
      icon: 'shield-checkmark-outline',
      onPress: () => navigation.navigate('Privacy'),
    },
    {
      id: 'subscription',
      title: 'Premium Subscription',
      icon: 'diamond-outline',
      onPress: () => navigation.navigate('Subscription'),
      isPremium: true,
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings-outline',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => navigation.navigate('Help'),
    },
  ];

  const handleAddPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to add photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhotos = [...user.photos, result.assets[0].uri];
        setUser({ ...user, photos: newPhotos });
      }
    } catch (error) {
      console.error('Error adding photo:', error);
      Alert.alert('Error', 'Failed to add photo. Please try again.');
    }
  };

  const handleRemovePhoto = (index: number) => {
    if (user.photos.length <= 1) {
      Alert.alert('Cannot Remove', 'You must have at least one photo.');
      return;
    }

    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const newPhotos = user.photos.filter((_, i) => i !== index);
            setUser({ ...user, photos: newPhotos });
            if (selectedPhotoIndex >= newPhotos.length) {
              setSelectedPhotoIndex(Math.max(0, newPhotos.length - 1));
            }
          },
        },
      ]
    );
  };

  const renderPhoto = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      style={styles.photoItem}
      onPress={() => setSelectedPhotoIndex(index)}
      onLongPress={() => handleRemovePhoto(index)}
    >
      <Image source={{ uri: item }} style={styles.photoThumbnail} />
      {selectedPhotoIndex === index && <View style={styles.selectedPhotoOverlay} />}
      {index === 0 && (
        <View style={styles.primaryBadge}>
          <Text style={styles.primaryBadgeText}>Primary</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderMenuItem = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuItemIcon, item.isPremium && styles.premiumIcon]}>
          <Ionicons
            name={item.icon}
            size={24}
            color={item.isPremium ? theme.colors.gold : theme.colors.primary}
          />
        </View>
        <Text style={[styles.menuItemText, item.isPremium && styles.premiumText]}>
          {item.title}
        </Text>
        {item.isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>PRO</Text>
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with main photo */}
        <View style={styles.header}>
          <Image source={{ uri: user.photos[selectedPhotoIndex] }} style={styles.mainPhoto} />
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.photoOverlay}
          >
            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>
                  {user.firstName} {user.lastName}, {user.age}
                </Text>
                {user.verified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  </View>
                )}
              </View>
              <Text style={styles.userLocation}>{user.location}</Text>
              <Text style={styles.userOccupation}>{user.occupation}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Profile Stats */}
        <Card variant="elevated" padding="medium" margin="medium">
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.profileViews}</Text>
              <Text style={styles.statLabel}>Profile Views</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                {user.profileCompleteness}%
              </Text>
              <Text style={styles.statLabel}>Complete</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>Edit</Text>
                <Text style={styles.statLabel}>Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Photo Management */}
        <Card variant="elevated" padding="medium" margin="medium">
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Photos</Text>
            <TouchableOpacity onPress={handleAddPhoto} style={styles.addPhotoButton}>
              <Ionicons name="add" size={20} color={theme.colors.primary} />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={[...user.photos, 'add']}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              if (item === 'add') {
                return (
                  <TouchableOpacity style={styles.addPhotoItem} onPress={handleAddPhoto}>
                    <Ionicons name="add" size={40} color={theme.colors.textSecondary} />
                    <Text style={styles.addPhotoItemText}>Add Photo</Text>
                  </TouchableOpacity>
                );
              }
              return renderPhoto({ item, index });
            }}
            keyExtractor={(item, index) => `photo-${index}`}
            contentContainerStyle={styles.photosList}
          />
        </Card>

        {/* Bio Section */}
        <Card variant="elevated" padding="medium" margin="medium">
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>About Me</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
              <Ionicons name="pencil" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.bioText}>{user.bio}</Text>
        </Card>

        {/* Interests */}
        <Card variant="elevated" padding="medium" margin="medium">
          <Text style={styles.sectionTitle}>My Interests</Text>
          <View style={styles.interestsContainer}>
            {user.interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Menu Items */}
        <Card variant="elevated" padding="none" margin="medium">
          {menuItems.map(renderMenuItem)}
        </Card>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            title="Sign Out"
            onPress={() => {
              Alert.alert(
                'Sign Out',
                'Are you sure you want to sign out?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: () => navigation.replace('Auth'),
                  },
                ]
              );
            }}
            variant="outline"
            fullWidth
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    height: 300,
    position: 'relative',
  },
  mainPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    justifyContent: 'flex-end',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  userInfo: {
    alignItems: 'flex-start',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginRight: theme.spacing.sm,
  },
  verifiedBadge: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userLocation: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  userOccupation: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
  },
  addPhotoText: {
    fontSize: 14,
    color: theme.colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  photosList: {
    paddingVertical: theme.spacing.sm,
  },
  photoItem: {
    width: 80,
    height: 100,
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    position: 'relative',
  },
  photoThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selectedPhotoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(233, 30, 99, 0.3)',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  primaryBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  primaryBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  addPhotoItem: {
    width: 80,
    height: 100,
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoItemText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  bioText: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm,
  },
  interestTag: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  interestText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  premiumIcon: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  menuItemText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
    flex: 1,
  },
  premiumText: {
    color: theme.colors.gold,
  },
  premiumBadge: {
    backgroundColor: theme.colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: theme.spacing.sm,
  },
  premiumBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  logoutContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  bottomSpacer: {
    height: theme.spacing.xl,
  },
});
