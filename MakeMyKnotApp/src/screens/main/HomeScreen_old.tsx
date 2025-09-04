import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';

const { width: screenWidth } = Dimensions.get('window');

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

const HomeScreen = ({ navigation }: any) => {
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

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(sampleUsers);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSwipeLeft = () => {
    console.log('Passed on:', users[currentIndex].firstName);
    nextUser();
  };

  const handleSwipeRight = () => {
    console.log('Liked:', users[currentIndex].firstName);
    // Simulate match (30% chance)
    if (Math.random() < 0.3) {
      setMatchedUser(users[currentIndex]);
      setShowMatchModal(true);
    }
    nextUser();
  };

  const handleSwipeUp = () => {
    console.log('Super liked:', users[currentIndex].firstName);
    // Simulate match (80% chance for super like)
    if (Math.random() < 0.8) {
      setMatchedUser(users[currentIndex]);
      setShowMatchModal(true);
    }
    nextUser();
  };

  const nextUser = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const handleMatchModalClose = () => {
    setShowMatchModal(false);
    setMatchedUser(null);
  };

  const goToChat = () => {
    setShowMatchModal(false);
    setMatchedUser(null);
    navigation.navigate('Chat');
  };

  const rewindLastAction = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E91E63" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
          Finding amazing people near you...
        </Text>
      </View>
    );
  }

  if (currentIndex >= users.length) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="heart-outline" size={80} color="#E91E63" />
        <Text style={styles.noMoreTitle}>You're all caught up!</Text>
        <Text style={styles.noMoreText}>
          Check back later for new people to connect with.
        </Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => {
            setCurrentIndex(0);
            setUsers([...sampleUsers]);
          }}
        >
          <LinearGradient
            colors={['#E91E63', '#C2185B']}
            style={styles.refreshButtonGradient}
          >
            <Ionicons name="refresh" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.refreshButtonText}>Show Again</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: 50 }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person-circle-outline" size={32} color="#666" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Discover</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate('Matches')} style={styles.headerButton}>
            <Ionicons name="chatbubbles-outline" size={28} color="#ff4458" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Card Stack */}
      <View style={styles.cardContainer}>
        {users.slice(currentIndex, currentIndex + 3).map((user, index) => (
          <SwipeCard
            key={user.id}
            user={user}
            onSwipeLeft={index === 0 ? handleSwipeLeft : () => {}}
            onSwipeRight={index === 0 ? handleSwipeRight : () => {}}
            onSwipeUp={index === 0 ? handleSwipeUp : () => {}}
            isStackCard={index > 0}
            index={index}
          />
        ))}
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.bottomActionButton} onPress={rewindLastAction}>
          <Ionicons name="arrow-undo" size={24} color="#ff9800" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomActionButton} onPress={handleSwipeLeft}>
          <Ionicons name="close" size={32} color="#ff4458" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.bottomActionButton, styles.superLikeButton]} onPress={handleSwipeUp}>
          <Ionicons name="star" size={24} color="#00bcd4" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomActionButton} onPress={handleSwipeRight}>
          <Ionicons name="heart" size={28} color="#4caf50" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomActionButton}>
          <Ionicons name="flash" size={24} color="#9c27b0" />
        </TouchableOpacity>
      </View>

      {/* Match Modal */}
      {showMatchModal && matchedUser && (
        <View style={styles.matchModal}>
          <LinearGradient
            colors={['#ff4458', '#ff6b7a', '#ff8a95']}
            style={styles.matchModalContent}
          >
            <Text style={styles.matchTitle}>It's a Match!</Text>
            <Text style={styles.matchText}>
              You and {matchedUser.firstName} liked each other
            </Text>
            <View style={styles.matchButtons}>
              <TouchableOpacity style={styles.matchButton} onPress={handleMatchModalClose}>
                <Text style={styles.matchButtonText}>Keep Playing</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.matchButton, styles.chatButton]} onPress={goToChat}>
                <Text style={[styles.matchButtonText, styles.chatButtonText]}>Say Hello</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerLeft: {
    width: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  headerButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ff4458',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
    paddingTop: 20,
    backgroundColor: 'white',
  },
  bottomActionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  superLikeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  noMoreTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  noMoreText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    marginHorizontal: 40,
    lineHeight: 24,
  },
  refreshButton: {
    marginTop: 30,
    borderRadius: 25,
    overflow: 'hidden',
  },
  refreshButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  matchModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  matchModalContent: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 20,
    marginHorizontal: 40,
  },
  matchTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  matchText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.9,
  },
  matchButtons: {
    flexDirection: 'row',
  },
  matchButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
  chatButton: {
    backgroundColor: 'white',
  },
  matchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  chatButtonText: {
    color: '#ff4458',
  },
});

export default HomeScreen;
