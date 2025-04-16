import {Request,Response} from 'express'
import {hashSync, compare } from 'bcrypt';
import { prismaClient } from '..';
import {User, AuthResponse, RegisterFormData } from '../interface/type'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken  } from '../helpers/authHelper';

export const login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password }: { email: string; password: string } = req.body;
    if(!email || !password){
        return res.status(400).json({message:'All fields are required'})
    }
    try {
        const user = await prismaClient.user.findUnique({
            where: { email }
          });
        if(!user){
            return res.status(400).json({message:'User not found'})
        }
        const isPasswordValid = compare (password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const accessToken = generateAccessToken(user.phone);
        const refreshToken = generateRefreshToken(user.phone);
        
        const existingToken = await prismaClient.token.findFirst({
            where: { userPhone: user.phone }
        });

        if (existingToken) {
            await prismaClient.token.update({
                where: { id: existingToken.id },
                data: {
                    refreshToken,
                    accessToken,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }
            });
        } else {
            await prismaClient.token.create({
                data: {
                    userPhone: user.phone,
                    refreshToken,
                    accessToken,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }
            });
        }

        const authResponse: AuthResponse = {
          message: 'User Login successfully',
          data: {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 giờ sau
            expires_refresh_token: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 ngày sau
            user: user
          }
        };

        return res.status(200).json(authResponse);
        

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
};

export const register = async (req:Request, res:Response): Promise<Response> => {
    const {email,phone,password,confirm_password,term_of_use} : RegisterFormData = req.body
    if(!phone ||  !email || !password){
        return res.status(400).json({message:'All fields are required'})
    }
    try {
        let  existingUser = await prismaClient.user.findFirst({
            where:{
                OR:[
                    {phone},
                    {email}
                ]
            }
        })
        if (existingUser) {
          const reason = 
            existingUser.phone === phone ? 'Phone already exists' :
            existingUser.email === email ? 'Email already exists' :
            'User already exists';
        
          return res.status(400).json({ message: reason });
        }
        const hashedPassword = await hashSync(password,10)
        const newUser = await prismaClient.user.create({
            data:{
                phone,
                name : "",
                email,
                password_hash:hashedPassword
            },
            select:{
                phone: true,
                name: true,
                email: true,
                avatar: true,
                status: true
            }
        })

        const accessToken = generateAccessToken(phone);
        const refreshToken = generateRefreshToken(phone);
        
        const existingToken = await prismaClient.token.findFirst({
            where: { userPhone: phone }
        });

        if (existingToken) {
            await prismaClient.token.update({
                where: { id: existingToken.id },
                data: {
                    refreshToken,
                    accessToken,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }
            });
        } else {
            await prismaClient.token.create({
                data: {
                    userPhone: phone,
                    refreshToken,
                    accessToken,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }
            });
        }

        const authResponse: AuthResponse = {
          message: 'User registered successfully',
          data: {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires: Date.now() + 60 * 60 * 1000, // 1 giờ sau
            expires_refresh_token: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 ngày sau
            user: newUser
          }
        };
        
        return res.status(201).json(authResponse);
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }  
}

export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
    const { refreshToken }: { refreshToken: string } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }
  
    try {
      // Verify the refresh token
      const decoded = verifyRefreshToken(refreshToken); // This function verifies the refresh token and returns the decoded data
      
      if (!decoded || !decoded.userId) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
  
      const user = await prismaClient.user.findUnique({
        where: { phone: decoded.userId }
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Generate new tokens
      const newAccessToken = generateAccessToken(user.phone);
      const newRefreshToken = generateRefreshToken(user.phone);
  
      // Update the refresh token in the database
      const existingToken = await prismaClient.token.findFirst({
        where: { userPhone: user.phone }
      });
  
      if (existingToken) {
        await prismaClient.token.update({
          where: { id: existingToken.id },
          data: {
            refreshToken: newRefreshToken,
            accessToken: newAccessToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expires in 7 days
          }
        });
      } else {
        await prismaClient.token.create({
          data: {
            userPhone: user.phone,
            refreshToken: newRefreshToken,
            accessToken: newAccessToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expires in 7 days
          }
        });
      }
  
      return res.status(200).json({
        message: 'Token refreshed successfully',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          phone: user.phone,
          username: user.name,
          email: user.email,
          status: user.status,
          created_at: user.createdAt
        }
      });
      
    } catch (error) {
      console.error('Refresh token error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const logout = async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).json({ message: 'User logged out successfully' });
};