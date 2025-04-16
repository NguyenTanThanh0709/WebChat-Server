import {Request,Response} from 'express'
import {
    findUsersByPhone,
    updateUserProfileService,
    changeUserPasswordService,
    updateUserStatusByPhoneService
  } from '../services/user.service';

export const getUsersByPhoneLike = async (req: Request, res: Response): Promise<void> => {
    const { phone } = req.params;
  
    try {
      const users = await findUsersByPhone(phone);
      res.status(200).json(users);
    } catch (error: any) {
      console.error('Error fetching users by phone:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

// ✏️ Cập nhật profile user
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    const { phone } = req.params;
    const { username, email, profile_picture } = req.body;
  
    try {
      const updatedUser = await updateUserProfileService(phone, {
        username,
        email,
        profile_picture
      });
  
      res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

export const changeUserPassword = async (req: Request, res: Response): Promise<void> => {
    const { phone } = req.params;
    const { oldPassword, newPassword } = req.body;
  
    if (!oldPassword || !newPassword) {
      res.status(400).json({ error: 'Old and new passwords are required' });
      return;
    }
  
    if (newPassword.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters' });
      return;
    }
  
    try {
      const updatedUser = await changeUserPasswordService(phone, oldPassword, newPassword);
      res.status(200).json({ message: 'Password changed successfully', user: updatedUser });
    } catch (error: any) {
      console.error('Error changing password:', error);
      res.status(400).json({ error: error.message || 'Failed to change password' });
    }
};

 // 🔄 Cập nhật trạng thái user
export const updateUserStatusByPhone = async (req: Request, res: Response): Promise<void> => {
    const { phone } = req.params;
    const { status } = req.body;
  
    if (!status || (status !== 'ONLINE' && status !== 'OFFLINE')) {
      res.status(400).json({ error: 'Status must be either ONLINE or OFFLINE' });
      return;
    }
  
    try {
      const user = await updateUserStatusByPhoneService(phone, status);
      res.status(200).json({ message: 'Status updated successfully', user });
    } catch (error: any) {
      console.error('Error updating status:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}; 