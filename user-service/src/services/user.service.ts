import { Prisma } from '@prisma/client'
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

interface PaginatedResponse {
  users: PaginatedUser[];
  pagination: {
    page: number;
    limit: number;
    page_size: number;
  };
}

export const getUsersWithOptionalSearchAndPaginationService = async (
  phone: string,
  page: number = 0,
  pageSize: number = 5,
  searchPhone?: string,
  sortBy?: string // Add the sortBy parameter
): Promise<PaginatedResponse> => {
  // Điều kiện lọc người dùng
  const userWhereCondition = {
    AND: [
      {
        phone: {
          not: phone, // Loại trừ người đang đăng nhập
        },
      },
      ...(searchPhone
        ? [
            {
              phone: {
                contains: searchPhone,
              },
            },
          ]
        : []),
    ],
  };

    // Determine sorting order based on sortBy parameter
    const orderBy = sortBy === 'createdAt' ? { createdAt: 'desc' as const } : undefined;

  // Lấy danh sách người dùng theo phân trang và điều kiện tìm kiếm
  const users = await prismaClient.user.findMany({
    where: userWhereCondition,
    skip: page * pageSize,
    take: pageSize,
    orderBy,
    select: {
      phone: true,
      name: true,
      email: true,
      avatar: true,
      status: true,
      createdAt: true,
    },
  });

  // Lấy danh sách bạn bè của người hiện tại
  const friends = await getUserFriendsService(phone);
  // Tạo Set để dễ kiểm tra user có phải là bạn bè không
  const friendPhoneSet = new Set(friends.map((f: any) => f.phone));



// Thêm isFriend cho từng user (loại trừ bản thân)
const usersWithFriendStatus = users.map((user) => ({
  ...user,
  isFriend: friendPhoneSet.has(user.phone)
}));

// Đếm tổng số user thỏa điều kiện
const totalUsers = await prismaClient.user.count({
  where: userWhereCondition,
});

return {
  users: usersWithFriendStatus,
  pagination: {
    page,
    limit: pageSize,
    page_size: totalUsers,
  },
};
};

export const getUserFriendsService = async (phone: string, name?: string): Promise<User[]> => {
  const nameFilter = name ? `%${name}%` : null

  const query1 = `
    SELECT  
      u.phone,
      u.name,
      u.email,
      u.avatar,
      f.status,
      f.created_at AS createdAt
    FROM friend f
    JOIN \`user\` u ON u.phone = f.friend_phone
    WHERE f.user_phone = ? AND f.status = 'accepted'
    ${nameFilter ? 'AND u.name LIKE ?' : ''}
  `

  const query2 = `
    SELECT  
      u.phone,
      u.name,
      u.email,
      u.avatar,
      f.status,
      f.created_at AS createdAt
    FROM friend f
    JOIN \`user\` u ON u.phone = f.user_phone
    WHERE f.friend_phone = ? AND f.status = 'accepted'
    ${nameFilter ? 'AND u.name LIKE ?' : ''}
  `

  const params1 = nameFilter ? [phone, nameFilter] : [phone]
  const params2 = nameFilter ? [phone, nameFilter] : [phone]

  const [friends1, friends2] = await Promise.all([
    prismaClient.$queryRawUnsafe<User[]>(query1, ...params1),
    prismaClient.$queryRawUnsafe<User[]>(query2, ...params2)
  ])

  return [...friends1, ...friends2]
}

  

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


