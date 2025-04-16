import { prismaClient } from '..';
import { CreateGroupInput, Group } from '../interface/type';

export const createGroupService = async (input: CreateGroupInput): Promise<Group> => {
    const { name, ownerPhone } = input;
  
    if (!name || !ownerPhone) {
      throw new Error('Missing name or ownerPhone');
    }
  
    const owner = await prismaClient.user.findUnique({
      where: { phone: ownerPhone },
    });
  
    if (!owner) {
      throw new Error('Owner not found');
    }
  
    const group = await prismaClient.group.create({
      data: {
        name,
        owner_phone: ownerPhone,
        members: {
          create: {
            user_phone: ownerPhone,
            role: 'owner',
          },
        },
      },
      include: {
        members: true,
      },
    });
  
    return group;
};


export const inviteUserToGroupService = async (groupId: number, userPhone: string) => {
    // Kiểm tra xem user đã trong group chưa
    const existingMember = await prismaClient.groupMember.findUnique({
      where: {
        group_id_user_phone: {
          group_id: groupId,
          user_phone: userPhone,
        },
      },
    });
  
    if (existingMember) {
      throw new Error('User is already invited or a member of the group');
    }
  
    // Gửi lời mời với status = false
    const invitation = await prismaClient.groupMember.create({
      data: {
        group_id: groupId,
        user_phone: userPhone,
        role: 'member',
        status: false,
      },
    });
  
    return invitation;
};
  
export const acceptGroupInvitationService = async (groupId: number, userPhone: string) => {
    const updated = await prismaClient.groupMember.update({
      where: {
        group_id_user_phone: {
          group_id: groupId,
          user_phone: userPhone,
        },
      },
      data: {
        status: true,
      },
    });
  
    return updated;
};