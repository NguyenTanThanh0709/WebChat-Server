import {Request,Response} from 'express'
import {hashSync, compare } from 'bcrypt';
import { prismaClient } from '..';
import {User} from '../interface/type'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken  } from '../helpers/authHelper';

export const login = async (req: Request, res: Response): Promise<Response> => {
    const { phone, password_hash }: { phone: string; password_hash: string } = req.body;
    if(!phone || !password_hash){
        return res.status(400).json({message:'All fields are required'})
    }
    try {
        const user = await prismaClient.user.findUnique({
            where: { phone }
          });
        if(!user){
            return res.status(400).json({message:'User not found'})
        }
        const isPasswordValid = compare (password_hash, user.password_hash);
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
          
          return res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
              phone: user.phone,
              username: user.username,
              email: user.email,
              status: user.status,
              created_at: user.created_at
            }
          });          

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
};

export const register = async (req:Request, res:Response): Promise<Response> => {
    const {phone,username,email,password_hash} : User = req.body
    if(!phone || !username || !email || !password_hash){
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
        if(existingUser){
            return res.status(400).json({message:'User already exists'})
        }
        const hashedPassword = await hashSync(password_hash,10)
        const newUser = await prismaClient.user.create({
            data:{
                phone,
                username,
                email,
                password_hash:hashedPassword
            },
            select:{
                phone: true,
                username: true,
                email: true,
                created_at: true,
                status: true
            }
        })

        return res.status(201).json({
            message: 'User registered successfully',
            user: newUser
          });
        
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
          username: user.username,
          email: user.email,
          status: user.status,
          created_at: user.created_at
        }
      });
      
    } catch (error) {
      console.error('Refresh token error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };