import React from 'react';
import { Circle, Smartphone, Monitor } from 'lucide-react';
import { useOnlineStatus } from '@/lib/OnlineStatusContext';

interface OnlineStatusIndicatorProps {
  userId: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  showLastSeen?: boolean;
  showDevice?: boolean;
  className?: string;
}

interface StatusDotProps {
  status: 'online' | 'offline' | 'away';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({ 
  status, 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const statusClasses = {
    online: 'bg-green-500 border-green-600',
    away: 'bg-yellow-500 border-yellow-600',
    offline: 'bg-gray-400 border-gray-500'
  };

  return (
    <div className={`relative ${className}`}>
      <Circle
        className={`
          ${sizeClasses[size]} 
          ${statusClasses[status]} 
          border-2 border-white 
          rounded-full 
          ${status === 'online' ? 'animate-pulse' : ''}
        `}
        fill="currentColor"
      />
    </div>
  );
};

export const OnlineStatusIndicator: React.FC<OnlineStatusIndicatorProps> = ({
  userId,
  size = 'md',
  showText = false,
  showLastSeen = false,
  showDevice = false,
  className = ''
}) => {
  const { getUserStatus, getLastSeenText } = useOnlineStatus();
  const userStatus = getUserStatus(userId);

  if (!userStatus) {
    return null;
  }

  const statusText = {
    online: 'Online',
    away: 'Away',
    offline: 'Offline'
  };

  const statusColors = {
    online: 'text-green-600',
    away: 'text-yellow-600',
    offline: 'text-gray-500'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <StatusDot status={userStatus.status} size={size} />
      
      {showText && (
        <span className={`ml-2 text-sm font-medium ${statusColors[userStatus.status]}`}>
          {statusText[userStatus.status]}
        </span>
      )}

      {showLastSeen && (
        <span className="ml-2 text-xs text-gray-500">
          {getLastSeenText(userId)}
        </span>
      )}

      {showDevice && userStatus.location && (
        <div className="ml-2 flex items-center text-xs text-gray-400">
          {userStatus.location === 'Mobile' ? (
            <Smartphone className="w-3 h-3 mr-1" />
          ) : (
            <Monitor className="w-3 h-3 mr-1" />
          )}
          {userStatus.location}
        </div>
      )}

      {userStatus.isTyping && (
        <div className="ml-2 flex items-center">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-1 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1 h-1 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="ml-1 text-xs text-primary-600">typing...</span>
        </div>
      )}
    </div>
  );
};

interface OnlineUsersListProps {
  maxUsers?: number;
  showAvatars?: boolean;
  className?: string;
}

export const OnlineUsersList: React.FC<OnlineUsersListProps> = ({
  maxUsers = 10,
  showAvatars = true,
  className = ''
}) => {
  const { getOnlineUsersList, getTotalOnlineUsers } = useOnlineStatus();
  const onlineUsers = getOnlineUsersList();
  const totalOnline = getTotalOnlineUsers();
  const displayUsers = onlineUsers.slice(0, maxUsers);
  const hasMore = totalOnline > maxUsers;

  if (totalOnline === 0) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <div className="text-gray-400 text-sm">No users online</div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">
          Online Now ({totalOnline})
        </h3>
        {hasMore && (
          <span className="text-xs text-gray-500">
            +{totalOnline - maxUsers} more
          </span>
        )}
      </div>
      
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {displayUsers.map((userStatus) => (
          <div key={userStatus.userId} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            {showAvatars && (
              <div className="relative">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-700">
                    {userStatus.userId.slice(-2).toUpperCase()}
                  </span>
                </div>
                <StatusDot 
                  status={userStatus.status} 
                  size="sm" 
                  className="absolute -bottom-0.5 -right-0.5" 
                />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900 truncate">
                  User {userStatus.userId.slice(-4)}
                </span>
                {!showAvatars && (
                  <StatusDot status={userStatus.status} size="sm" />
                )}
              </div>
              
              {userStatus.location && (
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  {userStatus.location === 'Mobile' ? (
                    <Smartphone className="w-3 h-3 mr-1" />
                  ) : (
                    <Monitor className="w-3 h-3 mr-1" />
                  )}
                  {userStatus.location}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface OnlineStatusBadgeProps {
  className?: string;
}

export const OnlineStatusBadge: React.FC<OnlineStatusBadgeProps> = ({ className = '' }) => {
  const { getTotalOnlineUsers } = useOnlineStatus();
  const totalOnline = getTotalOnlineUsers();

  if (totalOnline === 0) return null;

  return (
    <div className={`inline-flex items-center px-2.5 py-1 rounded-full bg-green-100 text-green-800 ${className}`}>
      <StatusDot status="online" size="sm" className="mr-2" />
      <span className="text-xs font-medium">
        {totalOnline} online
      </span>
    </div>
  );
};

interface UserProfileStatusProps {
  userId: string;
  userName?: string;
  className?: string;
}

export const UserProfileStatus: React.FC<UserProfileStatusProps> = ({
  userId,
  userName,
  className = ''
}) => {
  const { getUserStatus, getLastSeenText } = useOnlineStatus();
  const userStatus = getUserStatus(userId);

  if (!userStatus) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <StatusDot status={userStatus.status} size="md" />
      <div className="flex flex-col">
        {userName && (
          <span className="text-sm font-medium text-gray-900">{userName}</span>
        )}
        <span className="text-xs text-gray-500">
          {getLastSeenText(userId)}
        </span>
      </div>
    </div>
  );
};
