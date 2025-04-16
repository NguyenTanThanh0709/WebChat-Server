import { prismaClient } from '..';
import { User } from '../interface/type';
import {hashSync, compareSync} from 'bcrypt';

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
  
      return updatedUser;
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