import format from 'pg-format';
import { prismaClient } from '..';
import { CreateGroupInput, Group, GroupMemberInfo  } from '../interface/type';

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
            status: true
          },
        },
      }
    });
  
    return group;
};

export const getGroupsByUserPhone = async (phone: string,name?: string) => {
  const groups = await prismaClient.groupMember.findMany({
    where: {
      user_phone: phone,
      status: true, // optional: chỉ lấy các group member đang active
      group: {
        name: name ? {
          contains: name
        } : undefined
      }
    },
    include: {
      group: {
        include: {
          owner: {
            select: {
              phone: true,
              name: true,
              avatar: true
            }
          }
        }
      }
    }
  })

  return groups.map(g => ({
    group_id: g.group_id.toString(), // tránh lỗi BigInt
    role: g.role,
    joined_at: g.joined_at,
    group_name: g.group.name,
    group_created_at: g.group.created_at,
    group_owner: g.group.owner
  }))
}

export const getGroupMembersByGroupId = async (groupId: number): Promise<GroupMemberInfo[]> => {
  if (!groupId) {
    throw new Error('Missing groupId');
  }

  const members = await prismaClient.groupMember.findMany({
    where: {
      group_id: groupId,
      status: true
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          avatar: true,
          status: true
        }
      }
    }
  });

  return members.map(m => ({
    group_id: BigInt(m.group_id).toString(),  // Chuyển BigInt thành string
    user_phone: m.user_phone,
    role: m.role || 'member',
    joined_at: m.joined_at?.toISOString() || '',
    status: m.status ? 1 : 0,
    name: m.user.name,
    email: m.user.email,
    avatar: m.user.avatar,
    user_status: m.user.status || '',
  }));
};

export const addMembersToGroup = async (groupId: number, memberPhones: string[]): Promise<string> => {
  if (!groupId || !memberPhones || memberPhones.length === 0) {
    throw new Error('Missing groupId or memberPhones');
  }

  const group = await prismaClient.group.findUnique({
    where: { id: groupId },
  });

  if (!group) {
    throw new Error('Group not found');
  }

  const values = memberPhones.map(phone => [groupId, phone, 'member', 1]);

  // 🛠 Format for MySQL (backticks ` instead of "quotes")
  const query = format(`
    INSERT INTO \`GroupMember\` (\`group_id\`, \`user_phone\`, \`role\`, \`status\`)
    VALUES %L
    ON DUPLICATE KEY UPDATE \`user_phone\` = \`user_phone\`; -- no update, just ignore duplicate
  `, values);

  await prismaClient.$executeRawUnsafe(query);

  return 'OK';
};


export const removeMemberFromGroup = async (groupId: number, userPhone: string): Promise<string> => {
  if (!groupId || !userPhone) {
    throw new Error('Missing groupId or userPhone');
  }

  const member = await prismaClient.groupMember.findFirst({
    where: {
      group_id: groupId,
      user_phone: userPhone
    }
  });

  if (!member) {
    throw new Error('Member not found in group');
  }

    // Kiểm tra xem thành viên có phải là owner không
    if (member.role === 'owner') {
      return 'Failed';
    }

  await prismaClient.groupMember.delete({
    where: {
      group_id_user_phone: {
        group_id: groupId,
        user_phone: userPhone
      }
    }
  });

  return 'Deleted';
};
