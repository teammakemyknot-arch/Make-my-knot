export interface Conversation {
  id: string;
  matchId: string;
  participants: [string, string]; // user IDs
  lastMessage?: Message;
  lastMessageAt?: Date;
  isActive: boolean;
  unreadCount: {
    [userId: string]: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'gif' | 'sticker' | 'location' | 'contact' | 'system';
  
  // Media attachments
  attachments?: MessageAttachment[];
  
  // Message status
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  readAt?: Date;
  deliveredAt?: Date;
  
  // Reply functionality
  replyTo?: {
    messageId: string;
    preview: string;
    senderName: string;
  };
  
  // Reactions
  reactions: MessageReaction[];
  
  // System message data
  systemData?: {
    type: 'match_created' | 'user_joined' | 'conversation_started' | 'photo_shared';
    data?: any;
  };
  
  // Safety & moderation
  isReported: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'file';
  url: string;
  thumbnailUrl?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  duration?: number; // for audio/video
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  createdAt: Date;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  isTyping: boolean;
  timestamp: Date;
}

export interface ChatSettings {
  conversationId: string;
  userId: string;
  settings: {
    notifications: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    isBlocked: boolean;
    isMuted: boolean;
    mutedUntil?: Date;
  };
}

// Pre-defined conversation starters for matches
export interface ConversationStarter {
  id: string;
  category: 'icebreaker' | 'question' | 'compliment' | 'hobby' | 'travel';
  text: string;
  isActive: boolean;
}

export const DEFAULT_CONVERSATION_STARTERS: ConversationStarter[] = [
  {
    id: '1',
    category: 'icebreaker',
    text: "Hey! I loved your photos, especially the one where you're...",
    isActive: true,
  },
  {
    id: '2',
    category: 'question',
    text: "What's the best thing that happened to you this week?",
    isActive: true,
  },
  {
    id: '3',
    category: 'hobby',
    text: "I see you're into [hobby]. What got you started with that?",
    isActive: true,
  },
  {
    id: '4',
    category: 'travel',
    text: "Your travel photos are amazing! What's been your favorite destination?",
    isActive: true,
  },
  {
    id: '5',
    category: 'compliment',
    text: "Your smile is absolutely contagious! 😊",
    isActive: true,
  },
];
