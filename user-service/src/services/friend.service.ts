import { prismaClient } from '..';
import { Friend, FriendStatus, User } from '../interface/type';

export const sendFriendRequestService = async (
    senderPhone: string,
    receiverPhone: string
  ): Promise<Friend> => {
    // Kiểm tra xem người dùng có phải là chính mình không
    if (senderPhone === receiverPhone) {
      throw new Error("You can't send a friend request to yourself");
    }

      // Kiểm tra nếu đã có mối quan hệ kết bạn
    const existingRequest = await prismaClient.friend.findFirst({
        where: {
        OR: [
            { user_phone: senderPhone, friend_phone: receiverPhone },
            { user_phone: receiverPhone, friend_phone: senderPhone },
        ],
        },
    });

    if (existingRequest) {
        throw new Error('A friend request already exists or they are already friends');
    }

    const newRequest = await prismaClient.friend.create({
        data: {
          user_phone: senderPhone,
          friend_phone: receiverPhone,
          status: 'pending' as FriendStatus,
        },
      });
    
      return newRequest;

}

export const respondToFriendRequest = async (phone: string, friendPhone: string, action: 'accept' | 'reject') => {
    const friendRelation = await prismaClient.friend.findFirst({
      where: {
        user_phone: friendPhone,
        friend_phone: phone,
        status: 'pending', // Chỉ xử lý với lời kết bạn đang chờ
      },
    });
  
    if (!friendRelation) {
      throw new Error('Friend request not found or already responded');
    }
  
    if (action === 'accept') {
      await prismaClient.friend.update({
        where: {
          user_phone_friend_phone: {
            user_phone: friendPhone,
            friend_phone: phone,
          },
        },
        data: {
          status: 'accepted',
        },
      });
    } else {
      await prismaClient.friend.delete({
        where: {
          user_phone_friend_phone: {
            user_phone: friendPhone,
            friend_phone: phone,
          },
        },
      });
    }
  
    return 'Friend request processed';
};

export const blockUserService = async (
    blockerPhone: string,
    blockedPhone: string
  ): Promise<Friend> => {
    // Kiểm tra nếu đã có mối quan hệ kết bạn
    const existingRequest = await prismaClient.friend.findFirst({
      where: {
        OR: [
          { user_phone: blockerPhone, friend_phone: blockedPhone },
          { user_phone: blockedPhone, friend_phone: blockerPhone },
        ],
      },
    });
  
    if (!existingRequest) {
      throw new Error('No existing friend relationship found to block');
    }
  
    // Cập nhật trạng thái mối quan hệ thành 'blocked'
    const updatedFriendship = await prismaClient.friend.update({
      where: {
        user_phone_friend_phone: {
          user_phone: blockerPhone,
          friend_phone: blockedPhone,
        },
      },
      data: {
        status: 'blocked' as FriendStatus,
      },
    });
  
    return updatedFriendship;
};

export const unfriendUserService = async (
    userPhone: string,
    friendPhone: string
  ): Promise<void> => {
    // Kiểm tra nếu mối quan hệ kết bạn đã tồn tại
    const existingFriendship = await prismaClient.friend.findFirst({
      where: {
        OR: [
          { user_phone: userPhone, friend_phone: friendPhone },
          { user_phone: friendPhone, friend_phone: userPhone },
        ],
      },
    });
  
    if (!existingFriendship) {
      throw new Error('No existing friend relationship found to unfriend');
    }
  
    // Xóa mối quan hệ kết bạn
    await prismaClient.friend.delete({
      where: {
        user_phone_friend_phone: {
          user_phone: userPhone,
          friend_phone: friendPhone,
        },
      },
    });
};

export const getUserListByPhoneService = async (
    phone: string,
    searchPhone: string
  ): Promise<User[]> => {
    // Truy vấn danh sách người dùng có phone chứa searchPhone
    const users = await prismaClient.user.findMany({
      where: {
        phone: {
          contains: searchPhone, // Tìm kiếm theo phone
        },
      },
      // Chỉ cần lấy thông tin cơ bản của người dùng, tránh lấy quá nhiều dữ liệu không cần thiết
      select: {
        phone: true,
        username: true,
        email: true,
        profile_picture: true,
        status: true,
      },
    });
  
    // Truy vấn tất cả các mối quan hệ bạn bè của người dùng hiện tại trong một lần
    const friends = await prismaClient.friend.findMany({
      where: {
        OR: [
          { user_phone: phone },
          { friend_phone: phone },
        ],
        status: 'accepted', // Chỉ lấy mối quan hệ đã chấp nhận
      },
      select: {
        user_phone: true,
        friend_phone: true,
      },
    });
  
    // Tạo một Set chứa danh sách các số điện thoại bạn bè của người dùng
    const friendsSet = new Set(
      friends.flatMap((friend) => [friend.user_phone, friend.friend_phone])
    );
  
    // Duyệt qua danh sách người dùng và đánh dấu xem họ có phải là bạn bè hay không
    return users.map((user) => ({
      ...user,
      isFriend: friendsSet.has(user.phone), // Kiểm tra xem số điện thoại người dùng có trong friendsSet không
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