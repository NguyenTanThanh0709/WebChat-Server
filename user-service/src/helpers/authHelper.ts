import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';

interface TokenPayload extends JwtPayload {
    userId: string;
}

// Tạo Access Token
export const generateAccessToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_ACCESS_TOKEN_SECRET as string, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION as string | number
    } as SignOptions);
};

// Tạo Refresh Token
export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_TOKEN_SECRET as string, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION as string | number
    } as SignOptions);
};

// Xác thực Access Token
export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET as string);
};

// Xác thực Refresh Token
export const verifyRefreshToken = (token: string): TokenPayload => {
    return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET as string) as TokenPayload;
};
