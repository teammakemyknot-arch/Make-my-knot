import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { GiftedChat, IMessage, Send, Bubble, InputToolbar, Composer } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Match {
  id: string;
  name: string;
  profilePicture: string;
  compatibility: number;
  isOnline: boolean;
}

export default function ChatDetailScreen({ route, navigation }: { route: any; navigation: any }) {
  const { match }: { match: Match } = route.params;
  
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  useEffect(() => {
    // Initialize with some sample messages
    setMessages([
      {
        _id: Math.random(),
        text: 'Hi! Thanks for the super like 😊',
        createdAt: new Date(Date.now() - 2 * 60 * 1000),
        user: {
          _id: 2,
          name: match.name,
          avatar: match.profilePicture,
        },
      },
      {
        _id: Math.random(),
        text: 'Hey! I loved your profile, especially your travel photos! 📸',
        createdAt: new Date(Date.now() - 5 * 60 * 1000),
        user: {
          _id: 1,
          name: 'You',
        },
      },
      {
        _id: Math.random(),
        text: 'Thank you! I see we both love traveling. Have you been to any exciting places recently?',
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
        user: {
          _id: 2,
          name: match.name,
          avatar: match.profilePicture,
        },
      },
    ]);

    // Set up navigation header
    navigation.setOptions({
      headerShown: false,
    });

    // Simulate typing indicator
    const typingTimeout = setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Add a new message after typing
        const newMessage: IMessage = {
          _id: Math.random(),
          text: "That's amazing! I'd love to hear more about your adventures 🌍",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: match.name,
            avatar: match.profilePicture,
          },
        };
        setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage]));
      }, 3000);
    }, 5000);

    return () => clearTimeout(typingTimeout);
  }, [match, navigation]);

  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    
    // Simulate response after a delay
    setTimeout(() => {
      const responses = [
        "That sounds wonderful! 😊",
        "I'd love to know more about that!",
        "Really? That's so interesting!",
        "Wow, tell me more! 🤔",
        "That's exactly what I was thinking too!",
        "I completely agree with you on that 👍",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const responseMessage: IMessage = {
        _id: Math.random(),
        text: randomResponse,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: match.name,
          avatar: match.profilePicture,
        },
      };
      
      setMessages(previousMessages => GiftedChat.append(previousMessages, [responseMessage]));
    }, 1000 + Math.random() * 2000);
  }, [match]);

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to send images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      const imageMessage: IMessage = {
        _id: Math.random(),
        text: '',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'You',
        },
        image: result.assets[0].uri,
      };
      
      setMessages(previousMessages => GiftedChat.append(previousMessages, [imageMessage]));
    }
  };

  const handleVideoCall = () => {
    Alert.alert(
      'Start Video Call?',
      `Would you like to start a video call with ${match.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            // Implement video call functionality
            Alert.alert('Video Call', 'Video calling feature will be available soon!');
          },
        },
      ]
    );
  };

  const handleVoiceCall = () => {
    Alert.alert(
      'Start Voice Call?',
      `Would you like to start a voice call with ${match.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            // Implement voice call functionality
            Alert.alert('Voice Call', 'Voice calling feature will be available soon!');
          },
        },
      ]
    );
  };

  const handleMoreOptions = () => {
    Alert.alert(
      'More Options',
      'Choose an action',
      [
        { text: 'View Profile', onPress: () => navigation.navigate('UserProfile', { user: match }) },
        { text: 'Block User', style: 'destructive' },
        { text: 'Report User', style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: theme.colors.primary,
          marginRight: 4,
          marginVertical: 2,
        },
        left: {
          backgroundColor: theme.colors.surface,
          marginLeft: 4,
          marginVertical: 2,
        },
      }}
      textStyle={{
        right: {
          color: 'white',
        },
        left: {
          color: theme.colors.text,
        },
      }}
      timeTextStyle={{
        right: {
          color: 'rgba(255,255,255,0.8)',
        },
        left: {
          color: theme.colors.textSecondary,
        },
      }}
    />
  );

  const renderSend = (props: any) => (
    <Send {...props}>
      <View style={styles.sendButton}>
        <Ionicons name="send" size={20} color={theme.colors.primary} />
      </View>
    </Send>
  );

  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbar}
      primaryStyle={styles.inputPrimary}
    />
  );

  const renderComposer = (props: any) => (
    <Composer
      {...props}
      textInputStyle={styles.composer}
      placeholderTextColor={theme.colors.textSecondary}
    />
  );

  const renderAccessory = () => (
    <View style={styles.accessoryContainer}>
      <TouchableOpacity style={styles.accessoryButton} onPress={handleImagePicker}>
        <Ionicons name="camera" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.profileSection}
          onPress={() => navigation.navigate('UserProfile', { user: match })}
        >
          <View style={styles.avatarContainer}>
            <Image source={{ uri: match.profilePicture }} style={styles.avatar} />
            {match.isOnline && <View style={styles.onlineIndicator} />}
          </View>
          
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{match.name}</Text>
            <View style={styles.statusContainer}>
              <Ionicons name="heart" size={12} color={theme.colors.primary} />
              <Text style={styles.compatibilityText}>{match.compatibility}% match</Text>
              <Text style={styles.statusText}>
                {match.isOnline ? ' • Online now' : ' • Last seen recently'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleVoiceCall}>
            <Ionicons name="call" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerButton} onPress={handleVideoCall}>
            <Ionicons name="videocam" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerButton} onPress={handleMoreOptions}>
            <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Area */}
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: 1,
          name: 'You',
        }}
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        renderComposer={renderComposer}
        renderAccessory={renderAccessory}
        isTyping={isTyping}
        showUserAvatar
        showAvatarForEveryMessage={false}
        renderAvatar={null}
        messagesContainerStyle={styles.messagesContainer}
        bottomOffset={0}
        minInputToolbarHeight={60}
        placeholder="Type a message..."
        alwaysShowSend
        scrollToBottom
        infiniteScroll
      />

      {/* Premium Feature Hint */}
      <View style={styles.premiumHint}>
        <LinearGradient
          colors={[theme.colors.gold + '20', theme.colors.gold + '10']}
          style={styles.premiumBanner}
        >
          <Ionicons name="diamond" size={16} color={theme.colors.gold} />
          <Text style={styles.premiumText}>
            Upgrade to Premium for read receipts and priority messaging
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Subscription')}>
            <Text style={styles.upgradeText}>Upgrade</Text>
          </TouchableOpacity>
        </LinearGradient>
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
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.shadows.small,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  profileSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: theme.spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.success,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compatibilityText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  statusText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: {
    backgroundColor: theme.colors.background,
  },
  inputToolbar: {
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    minHeight: 60,
  },
  inputPrimary: {
    alignItems: 'center',
  },
  composer: {
    fontSize: 16,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    color: theme.colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  accessoryContainer: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: theme.spacing.sm,
  },
  accessoryButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumHint: {
    position: 'absolute',
    bottom: 70,
    left: theme.spacing.md,
    right: theme.spacing.md,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.gold + '30',
  },
  premiumText: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  upgradeText: {
    fontSize: 12,
    color: theme.colors.gold,
    fontWeight: '600',
  },
});
