export interface INotification {
    type: 'friend_request' | 'friend_accept' | 'friend_remove' | 'message';
    sender: string;
    receiver: string;
    timestamp: Date;
    status: 'unread' | 'read';
  }
  