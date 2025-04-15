// src/middleware/verifyToken.ts
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../helpers/authHelper';

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(403).json({ message: 'Access denied, token required' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token) as { userId: string };

    if (!decoded || !decoded.userId) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    next();
  } catch (err) {
    next(err);
  }
};

export default verifyToken;
