import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationData {
  type: 'match' | 'message' | 'like' | 'super_like' | 'profile_view' | 'reminder';
  userId?: string;
  matchId?: string;
  messageId?: string;
  title: string;
  body: string;
  data?: any;
}

class NotificationService {
  private expoPushToken: string | null = null;

  // Initialize push notifications
  async initialize() {
    if (!Device.isDevice) {
      console.log('Push notifications only work on physical devices');
      return null;
    }

    // Get existing permission status
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permission if not already granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Push notification permission denied');
      return null;
    }

    // Get push token
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: 'makemyknot-app-2024', // Use the same ID as in app.json
    });

    this.expoPushToken = token.data;
    
    // Store token locally
    await AsyncStorage.setItem('pushToken', token.data);
    
    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#E91E63',
      });

      // Create specific channels for different notification types
      await this.createNotificationChannels();
    }

    console.log('Push notification initialized with token:', token.data);
    return token.data;
  }

  // Create notification channels for Android
  private async createNotificationChannels() {
    const channels = [
      {
        id: 'matches',
        name: 'New Matches',
        importance: Notifications.AndroidImportance.HIGH,
        description: 'Notifications for new matches',
        sound: 'match_sound.wav',
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#E91E63',
      },
      {
        id: 'messages',
        name: 'Messages',
        importance: Notifications.AndroidImportance.HIGH,
        description: 'Notifications for new messages',
        sound: 'message_sound.wav',
        vibrationPattern: [0, 100, 100, 100],
        lightColor: '#2196F3',
      },
      {
        id: 'likes',
        name: 'Likes & Super Likes',
        importance: Notifications.AndroidImportance.DEFAULT,
        description: 'Notifications for likes and super likes',
        vibrationPattern: [0, 150, 150, 150],
        lightColor: '#FF6B9D',
      },
      {
        id: 'reminders',
        name: 'App Reminders',
        importance: Notifications.AndroidImportance.LOW,
        description: 'Reminders to stay active on the app',
        vibrationPattern: [0, 100],
        lightColor: '#FFC107',
      },
    ];

    for (const channel of channels) {
      await Notifications.setNotificationChannelAsync(channel.id, channel);
    }
  }

  // Send local notification
  async sendLocalNotification(data: NotificationData) {
    const channelId = this.getChannelId(data.type);
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: data.title,
        body: data.body,
        data: data.data || {},
        sound: this.getNotificationSound(data.type),
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // Show immediately
      identifier: `${data.type}_${Date.now()}`,
    });
  }

  // Schedule notification for later
  async scheduleNotification(data: NotificationData, trigger: Date) {
    const channelId = this.getChannelId(data.type);
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: data.title,
        body: data.body,
        data: data.data || {},
        sound: this.getNotificationSound(data.type),
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        date: trigger,
      },
      identifier: `scheduled_${data.type}_${Date.now()}`,
    });
  }

  // Get notification sound based on type
  private getNotificationSound(type: string): string {
    switch (type) {
      case 'match':
      case 'super_like':
        return 'match_sound.wav';
      case 'message':
        return 'message_sound.wav';
      case 'like':
        return 'like_sound.wav';
      default:
        return 'default';
    }
  }

  // Get channel ID for notification type
  private getChannelId(type: string): string {
    switch (type) {
      case 'match':
      case 'super_like':
        return 'matches';
      case 'message':
        return 'messages';
      case 'like':
        return 'likes';
      case 'reminder':
        return 'reminders';
      default:
        return 'default';
    }
  }

  // Handle notification received while app is in foreground
  addNotificationReceivedListener(handler: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(handler);
  }

  // Handle notification response (when user taps notification)
  addNotificationResponseReceivedListener(
    handler: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(handler);
  }

  // Send push notification to specific user (server-side implementation would be needed)
  async sendPushNotification(targetToken: string, data: NotificationData) {
    const message = {
      to: targetToken,
      sound: 'default',
      title: data.title,
      body: data.body,
      data: data.data || {},
      channelId: this.getChannelId(data.type),
      priority: 'high',
    };

    // This would typically be sent to your server to handle via Expo's push service
    console.log('Would send push notification:', message);
    
    // For demo purposes, we'll simulate with a local notification
    await this.sendLocalNotification(data);
  }

  // Engagement notifications
  async sendMatchNotification(matchName: string, compatibility: number) {
    await this.sendLocalNotification({
      type: 'match',
      title: '🎉 It\'s a Match!',
      body: `You and ${matchName} liked each other! ${compatibility}% compatibility`,
      data: { type: 'match', matchName, compatibility },
    });
  }

  async sendMessageNotification(senderName: string, message: string) {
    await this.sendLocalNotification({
      type: 'message',
      title: `💬 Message from ${senderName}`,
      body: message.length > 50 ? message.substring(0, 50) + '...' : message,
      data: { type: 'message', senderName },
    });
  }

  async sendLikeNotification(userName: string, isSuper: boolean = false) {
    await this.sendLocalNotification({
      type: isSuper ? 'super_like' : 'like',
      title: isSuper ? '⭐ Super Like!' : '❤️ New Like!',
      body: isSuper 
        ? `${userName} sent you a Super Like! They're really interested!`
        : `${userName} liked your profile!`,
      data: { type: isSuper ? 'super_like' : 'like', userName },
    });
  }

  async sendProfileViewNotification(count: number) {
    if (count > 0) {
      await this.sendLocalNotification({
        type: 'profile_view',
        title: '👀 Profile Views',
        body: `${count} ${count === 1 ? 'person has' : 'people have'} viewed your profile today!`,
        data: { type: 'profile_view', count },
      });
    }
  }

  // Engagement reminders
  async scheduleEngagementReminders() {
    // Clear existing reminders
    await Notifications.cancelAllScheduledNotificationsAsync();

    const now = new Date();
    const reminders = [
      {
        title: '💕 Someone special is waiting',
        body: 'New matches are available! Come back and find your perfect partner.',
        hours: 24,
      },
      {
        title: '🔥 Your profile is getting attention!',
        body: 'Check out who liked your profile and start chatting!',
        hours: 48,
      },
      {
        title: '✨ Don\'t miss out on love',
        body: 'Great matches are waiting for you. Open the app to connect!',
        hours: 72,
      },
    ];

    for (const reminder of reminders) {
      const triggerDate = new Date(now.getTime() + reminder.hours * 60 * 60 * 1000);
      
      await this.scheduleNotification({
        type: 'reminder',
        title: reminder.title,
        body: reminder.body,
        data: { type: 'reminder' },
      }, triggerDate);
    }
  }

  // Get notification settings
  async getNotificationSettings() {
    try {
      const settings = await AsyncStorage.getItem('notificationSettings');
      return settings ? JSON.parse(settings) : {
        matches: true,
        messages: true,
        likes: true,
        reminders: true,
        sound: true,
        vibration: true,
      };
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return {
        matches: true,
        messages: true,
        likes: true,
        reminders: true,
        sound: true,
        vibration: true,
      };
    }
  }

  // Update notification settings
  async updateNotificationSettings(settings: any) {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(settings));
      console.log('Notification settings updated:', settings);
    } catch (error) {
      console.error('Error updating notification settings:', error);
    }
  }

  // Cancel all notifications
  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.dismissAllNotificationsAsync();
  }

  // Get push token
  getPushToken(): string | null {
    return this.expoPushToken;
  }

  // Badge management
  async setBadgeCount(count: number) {
    await Notifications.setBadgeCountAsync(count);
  }

  async clearBadge() {
    await Notifications.setBadgeCountAsync(0);
  }
}

export default new NotificationService();
