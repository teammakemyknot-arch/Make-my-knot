import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

// Simple screen components
const HomeScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>🏠 Home</Text>
    <Text style={styles.subtitle}>Welcome to Make My Knot!</Text>
    <Text style={styles.description}>Find your perfect life partner</Text>
  </View>
);

const DiscoverScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>❤️ Discover</Text>
    <Text style={styles.subtitle}>Find Your Match</Text>
    <Text style={styles.description}>Swipe and discover compatible profiles</Text>
  </View>
);

const MessagesScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>💬 Messages</Text>
    <Text style={styles.subtitle}>Your Conversations</Text>
    <Text style={styles.description}>Chat with your matches</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>👤 Profile</Text>
    <Text style={styles.subtitle}>Your Profile</Text>
    <Text style={styles.description}>Manage your profile information</Text>
  </View>
);

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#E91E63" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Discover') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === 'Messages') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else {
              iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#E91E63',
          tabBarInactiveTintColor: 'gray',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#E91E63',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'Make My Knot'
          }}
        />
        <Tab.Screen 
          name="Discover" 
          component={DiscoverScreen}
        />
        <Tab.Screen 
          name="Messages" 
          component={MessagesScreen}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default App;
