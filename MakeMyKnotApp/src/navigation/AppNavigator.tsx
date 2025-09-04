import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Simple test screen components
const HomeScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Home Screen</Text>
    <Text style={styles.subtitle}>Welcome to Make My Knot!</Text>
  </View>
);

const MatchesScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Discover</Text>
    <Text style={styles.subtitle}>Find your perfect match</Text>
  </View>
);

const ChatScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Messages</Text>
    <Text style={styles.subtitle}>Your conversations</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Profile</Text>
    <Text style={styles.subtitle}>Your profile information</Text>
  </View>
);

const WelcomeScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Welcome</Text>
    <Text style={styles.subtitle}>Welcome to Make My Knot</Text>
  </View>
);

const LoginScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Login</Text>
    <Text style={styles.subtitle}>Sign in to your account</Text>
  </View>
);

const SignupScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Sign Up</Text>
    <Text style={styles.subtitle}>Create new account</Text>
  </View>
);

const ProfileSetupScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Profile Setup</Text>
    <Text style={styles.subtitle}>Complete your profile</Text>
  </View>
);

const ChatDetailScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Chat Detail</Text>
    <Text style={styles.subtitle}>Chat conversation</Text>
  </View>
);

const SubscriptionScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Subscription</Text>
    <Text style={styles.subtitle}>Premium features</Text>
  </View>
);

const QuestionnaireScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Questionnaire</Text>
    <Text style={styles.subtitle}>Compatibility quiz</Text>
  </View>
);

const SettingsScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Settings</Text>
    <Text style={styles.subtitle}>App settings</Text>
  </View>
);

// Main Tab Navigator
function MainTabNavigator() {
  return (
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
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Discover" component={MatchesScreen} />
      <Tab.Screen name="Messages" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Auth Stack Navigator
function AuthStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </Stack.Navigator>
  );
}

// Main App Navigator
export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(true); // Set to true for testing
  const [showSplash, setShowSplash] = React.useState(false); // Set to false to skip splash

  const handleSplashFinish = () => {
    console.log('Splash screen finished!');
    setShowSplash(false);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStackNavigator} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            
            {/* Chat Detail Screen */}
            <Stack.Screen 
              name="ChatDetail" 
              component={ChatDetailScreen}
              options={{ 
                headerShown: false,
                presentation: 'card',
              }} 
            />
            
            {/* Subscription Screen */}
            <Stack.Screen 
              name="Subscription" 
              component={SubscriptionScreen}
              options={{ 
                headerShown: false,
                presentation: 'modal',
              }} 
            />
            
            {/* Matches Screen (for navigation from other screens) */}
            <Stack.Screen 
              name="Matches" 
              component={MatchesScreen}
              options={{ 
                headerShown: true,
                title: 'Discover',
                headerStyle: { backgroundColor: '#E91E63' },
                headerTintColor: 'white',
              }} 
            />
            
            <Stack.Screen 
              name="Questionnaire" 
              component={QuestionnaireScreen}
              options={{ 
                headerShown: true,
                title: 'Compatibility Quiz',
                headerStyle: { backgroundColor: '#E91E63' },
                headerTintColor: 'white',
              }} 
            />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{ 
                headerShown: true,
                title: 'Settings',
                headerStyle: { backgroundColor: '#E91E63' },
                headerTintColor: 'white',
              }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
  },
});
