export interface User {
    phone: string;
    username: string;
    email: string;
    password_hash: string;
    profile_picture?: string | null;
    status?: 'ONLINE' | 'OFFLINE' | string;
    created_at?: Date;
  }

export type FriendStatus = 'no' | 'pending' | 'accepted' | 'blocked';

export interface Friend {
  user_phone: string;
  friend_phone: string;
  status: FriendStatus;
  created_at?: Date;
}

export interface Group {
    id: number;
    name: string;
    owner_phone: string;
    created_at?: Date;
  }
  
export type GroupRole = 'member' | 'admin' | 'owner';

export interface GroupMember {
    group_id: number;
    user_phone: string;
    role?: GroupRole;
    joined_at?: Date;
}
