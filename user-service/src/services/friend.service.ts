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
