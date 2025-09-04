import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface CacheItem {
  data: any;
  timestamp: number;
  expiry?: number;
}

interface QueuedAction {
  id: string;
  action: string;
  data: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

class OfflineStorageService {
  private cachePrefix = 'cache_';
  private queuePrefix = 'queue_';
  private maxCacheAge = 24 * 60 * 60 * 1000; // 24 hours
  private syncInProgress = false;

  // Cache management
  async setCache(key: string, data: any, customExpiry?: number): Promise<void> {
    try {
      const cacheItem: CacheItem = {
        data,
        timestamp: Date.now(),
        expiry: customExpiry || this.maxCacheAge,
      };
      
      await AsyncStorage.setItem(
        `${this.cachePrefix}${key}`,
        JSON.stringify(cacheItem)
      );
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  async getCache(key: string): Promise<any | null> {
    try {
      const cached = await AsyncStorage.getItem(`${this.cachePrefix}${key}`);
      if (!cached) return null;

      const cacheItem: CacheItem = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is expired
      if (now - cacheItem.timestamp > (cacheItem.expiry || this.maxCacheAge)) {
        await this.removeCache(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  }

  async removeCache(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${this.cachePrefix}${key}`);
    } catch (error) {
      console.error('Error removing cache:', error);
    }
  }

  async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.cachePrefix));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // User data persistence
  async saveUserProfile(profile: any): Promise<void> {
    await this.setCache('user_profile', profile, 7 * 24 * 60 * 60 * 1000); // 7 days
  }

  async getUserProfile(): Promise<any | null> {
    return await this.getCache('user_profile');
  }

  async saveMatches(matches: any[]): Promise<void> {
    await this.setCache('matches', matches, 60 * 60 * 1000); // 1 hour
  }

  async getMatches(): Promise<any[] | null> {
    return await this.getCache('matches');
  }

  async saveMessages(chatId: string, messages: any[]): Promise<void> {
    await this.setCache(`messages_${chatId}`, messages, 30 * 24 * 60 * 60 * 1000); // 30 days
  }

  async getMessages(chatId: string): Promise<any[] | null> {
    return await this.getCache(`messages_${chatId}`);
  }

  async savePreferences(preferences: any): Promise<void> {
    await this.setCache('user_preferences', preferences, 30 * 24 * 60 * 60 * 1000); // 30 days
  }

  async getPreferences(): Promise<any | null> {
    return await this.getCache('user_preferences');
  }

  // Action queue for offline operations
  async queueAction(action: string, data: any, maxRetries: number = 3): Promise<void> {
    try {
      const queuedAction: QueuedAction = {
        id: `${action}_${Date.now()}_${Math.random()}`,
        action,
        data,
        timestamp: Date.now(),
        retryCount: 0,
        maxRetries,
      };

      await AsyncStorage.setItem(
        `${this.queuePrefix}${queuedAction.id}`,
        JSON.stringify(queuedAction)
      );

      console.log('Action queued for offline sync:', action);
    } catch (error) {
      console.error('Error queuing action:', error);
    }
  }

  async getQueuedActions(): Promise<QueuedAction[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const queueKeys = keys.filter(key => key.startsWith(this.queuePrefix));
      
      const queueItems = await AsyncStorage.multiGet(queueKeys);
      const actions: QueuedAction[] = [];

      for (const [key, value] of queueItems) {
        if (value) {
          try {
            actions.push(JSON.parse(value));
          } catch (error) {
            console.error('Error parsing queued action:', error);
            // Remove corrupted queue item
            await AsyncStorage.removeItem(key);
          }
        }
      }

      return actions.sort((a, b) => a.timestamp - b.timestamp);
    } catch (error) {
      console.error('Error getting queued actions:', error);
      return [];
    }
  }

  async removeQueuedAction(actionId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${this.queuePrefix}${actionId}`);
    } catch (error) {
      console.error('Error removing queued action:', error);
    }
  }

  async updateQueuedAction(action: QueuedAction): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `${this.queuePrefix}${action.id}`,
        JSON.stringify(action)
      );
    } catch (error) {
      console.error('Error updating queued action:', error);
    }
  }

  // Offline sync functionality
  async syncWhenOnline(): Promise<void> {
    if (this.syncInProgress) {
      console.log('Sync already in progress');
      return;
    }

    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      console.log('No internet connection, skipping sync');
      return;
    }

    this.syncInProgress = true;
    
    try {
      const queuedActions = await this.getQueuedActions();
      console.log(`Syncing ${queuedActions.length} queued actions`);

      for (const action of queuedActions) {
        try {
          await this.processQueuedAction(action);
          await this.removeQueuedAction(action.id);
        } catch (error) {
          console.error(`Error processing queued action ${action.id}:`, error);
          
          action.retryCount++;
          if (action.retryCount >= action.maxRetries) {
            console.log(`Max retries reached for action ${action.id}, removing from queue`);
            await this.removeQueuedAction(action.id);
          } else {
            console.log(`Retry ${action.retryCount}/${action.maxRetries} for action ${action.id}`);
            await this.updateQueuedAction(action);
          }
        }
      }
    } catch (error) {
      console.error('Error during sync:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private async processQueuedAction(action: QueuedAction): Promise<void> {
    // This is where you would implement the actual API calls
    // based on the action type and data
    
    switch (action.action) {
      case 'update_profile':
        // await apiCall to update profile
        console.log('Processing update_profile action:', action.data);
        break;
      
      case 'send_message':
        // await apiCall to send message
        console.log('Processing send_message action:', action.data);
        break;
      
      case 'like_profile':
        // await apiCall to like profile
        console.log('Processing like_profile action:', action.data);
        break;
      
      case 'super_like_profile':
        // await apiCall to super like profile
        console.log('Processing super_like_profile action:', action.data);
        break;
      
      default:
        console.log('Unknown action type:', action.action);
        break;
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Network state monitoring
  setupNetworkListener(onConnectionChange?: (isConnected: boolean) => void): () => void {
    const unsubscribe = NetInfo.addEventListener(state => {
      const isConnected = state.isConnected ?? false;
      console.log('Network state changed:', isConnected ? 'Connected' : 'Disconnected');
      
      if (isConnected) {
        // Auto-sync when connection is restored
        this.syncWhenOnline();
      }

      if (onConnectionChange) {
        onConnectionChange(isConnected);
      }
    });

    return unsubscribe;
  }

  // Application state persistence
  async saveAppState(state: any): Promise<void> {
    try {
      await AsyncStorage.setItem('app_state', JSON.stringify({
        ...state,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Error saving app state:', error);
    }
  }

  async getAppState(): Promise<any | null> {
    try {
      const state = await AsyncStorage.getItem('app_state');
      return state ? JSON.parse(state) : null;
    } catch (error) {
      console.error('Error getting app state:', error);
      return null;
    }
  }

  // Storage cleanup
  async cleanupExpiredCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.cachePrefix));
      
      for (const key of cacheKeys) {
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
          try {
            const cacheItem: CacheItem = JSON.parse(cached);
            const now = Date.now();
            
            if (now - cacheItem.timestamp > (cacheItem.expiry || this.maxCacheAge)) {
              await AsyncStorage.removeItem(key);
            }
          } catch (error) {
            // Remove corrupted cache items
            await AsyncStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.error('Error cleaning up expired cache:', error);
    }
  }

  // Storage size management
  async getStorageSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;
      
      const items = await AsyncStorage.multiGet(keys);
      for (const [key, value] of items) {
        if (value) {
          totalSize += new Blob([value]).size;
        }
      }
      
      return totalSize;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
      console.log('All offline data cleared');
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }

  // Batch operations for better performance
  async batchSetCache(items: Array<{ key: string; data: any; customExpiry?: number }>): Promise<void> {
    try {
      const cacheItems: Array<[string, string]> = [];
      
      for (const item of items) {
        const cacheItem: CacheItem = {
          data: item.data,
          timestamp: Date.now(),
          expiry: item.customExpiry || this.maxCacheAge,
        };
        
        cacheItems.push([
          `${this.cachePrefix}${item.key}`,
          JSON.stringify(cacheItem),
        ]);
      }
      
      await AsyncStorage.multiSet(cacheItems);
    } catch (error) {
      console.error('Error batch setting cache:', error);
    }
  }

  async batchGetCache(keys: string[]): Promise<Record<string, any>> {
    try {
      const cacheKeys = keys.map(key => `${this.cachePrefix}${key}`);
      const items = await AsyncStorage.multiGet(cacheKeys);
      const result: Record<string, any> = {};
      const now = Date.now();
      
      for (let i = 0; i < items.length; i++) {
        const [cacheKey, value] = items[i];
        const originalKey = keys[i];
        
        if (value) {
          try {
            const cacheItem: CacheItem = JSON.parse(value);
            
            // Check if cache is expired
            if (now - cacheItem.timestamp <= (cacheItem.expiry || this.maxCacheAge)) {
              result[originalKey] = cacheItem.data;
            }
          } catch (error) {
            console.error('Error parsing cached item:', error);
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error batch getting cache:', error);
      return {};
    }
  }
}

export default new OfflineStorageService();
