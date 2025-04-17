import { prismaClient } from '..';
import { User } from '../interface/type';
import {hashSync, compareSync} from 'bcrypt';


export const getProfileByPhone = async (phone: string): Promise<User | null> => {
  const user = await prismaClient.user.findFirst({
    where: {
      phone,
    },
    select: {
      phone: true,
      name: true,
      email: true,
      password_hash: true,
      avatar: true,
      status: true,
      createdAt: true,
    },
  });

  if (!user) return null;


  return user;
};

export const findUsersByPhone = async (phone: string) => {
    return prismaClient.user.findMany({
      where: {
        phone: {
          contains: phone
        }
      }
    });
};

export const updateUserProfileService = async (
    phone: string,
    data: Partial<Omit<User, 'password_hash' | 'created_at' | 'status'>>
  ) => {
    return prismaClient.user.update({
      where: { phone },
      data
    });
};

export const changeUserPasswordService = async (phone: string,oldPassword: string, newPassword: string) => {
    try {
      const user = await prismaClient.user.findUnique({ where: { phone } });
  
      if (!user) {
        throw new Error('User not found');
      }

      
      const isPasswordValid = compareSync(oldPassword, user.password_hash);

      if (!isPasswordValid) {
        throw new Error('Invalid old password');
      }
  
      const hashedPassword = hashSync(newPassword, 10);
  
      const updatedUser = await prismaClient.user.update({
        where: { phone },
        data: {
          password_hash: hashedPassword,
        },
      });
  
      return "updatedUser";
    } catch (error: any) {
      console.error('Error in changeUserPasswordService:', error);
      throw new Error(error.message || 'Failed to change password');
    }
};

export const updateUserStatusByPhoneService = async (
    phone: string,
    status: 'ONLINE' | 'OFFLINE' | string
  ) => {
    try {
      const user = await prismaClient.user.findUnique({ where: { phone } });
  
      if (!user) {
        throw new Error('User not found');
      }
  
      const updatedUser = await prismaClient.user.update({
        where: { phone },
        data: { status },
      });
  
      return updatedUser;
    } catch (error: any) {
      console.error('Error updating user status:', error);
      throw new Error(error.message || 'Failed to update user status');
    }
};



interface PaginatedUser extends User {
  isFriend: boolean;
}

export const getUsersWithOptionalSearchAndPaginationService = async (
  phone: string,
  page: number = 0,
  pageSize: number = 5,
  searchPhone?: string
): Promise<PaginatedUser[]> => {
  // Điều kiện lọc người dùng
  const userWhereCondition = searchPhone
    ? {
        phone: {
          contains: searchPhone,
        },
      }
    : {}; // không lọc nếu không có searchPhone

  // Lấy danh sách người dùng theo phân trang và điều kiện tìm kiếm
  const users = await prismaClient.user.findMany({
    where: userWhereCondition,
    skip: page * pageSize,
    take: pageSize,
    select: {
      phone: true,
      name: true,
      email: true,
      avatar: true,
      status: true,
    },
  });

  // Lấy danh sách bạn bè của người hiện tại
  const friends = await prismaClient.friend.findMany({
    where: {
      OR: [
        { user_phone: phone },
        { friend_phone: phone },
      ],
      status: 'accepted',
    },
    select: {
      user_phone: true,
      friend_phone: true,
    },
  });

  const friendsSet = new Set(
    friends.flatMap((friend) => [friend.user_phone, friend.friend_phone])
  );

  return users.map((user) => ({
    ...user,
    isFriend: friendsSet.has(user.phone) && user.phone !== phone,
  }));
};

export const getUserFriendsService = async (phone: string) => {
    return prismaClient.$queryRaw`
      SELECT  
        u.phone,
        u.username,
        u.email,
        u.profile_picture,
        f.status,
        f.created_at
      FROM friend f
      JOIN user u ON u.phone = f.friend_phone
      WHERE f.user_phone = ${phone}
        AND f.status = 'accepted'
  
      UNION
  
      SELECT 
        u.phone,
        u.username,
        u.email,
        u.profile_picture,
        f.status,
        f.created_at
      FROM friend f
      JOIN user u ON u.phone = f.user_phone
      WHERE f.friend_phone = ${phone}
        AND f.status = 'accepted'
    `;
};
  

// getPendingFriendRequestsService: Lấy danh sách lời mời kết bạn chờ
export const getPendingFriendRequestsService = async (userPhone: string) => {
    return prismaClient.friend.findMany({
      where: {
        friend_phone: userPhone,
        status: 'pending',
      },
      include: {
        user: true,  // Đưa thông tin người gửi lời mời
      }
    });
};
  
export const getFriendDetailsService = async (userPhone: string, friendPhone: string) => {
    const friend = await prismaClient.friend.findFirst({
      where: {
        OR: [
          { user_phone: userPhone, friend_phone: friendPhone },
          { user_phone: friendPhone, friend_phone: userPhone }
        ],
        status: 'accepted'
      },
      include: {
        user: true,
        friend: true
      }
    });
  
    if (!friend) {
      throw new Error('No accepted friendship found');
    }
  
    return friend.user_phone === userPhone ? friend.friend : friend.user;
};


