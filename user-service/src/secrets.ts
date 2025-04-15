import dotenv from 'dotenv'

dotenv.config({path:'.env'})

export const PORT  = process.env.PORT
export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET
if (!JWT_ACCESS_TOKEN_SECRET) {
    throw new Error("JWT_ACCESS_TOKEN_SECRET is not defined");
}
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET
if (!JWT_REFRESH_TOKEN_SECRET) {
    throw new Error("JWT_REFRESH_TOKEN_SECRET is not defined");
}
export const JWT_ACCESS_TOKEN_EXPIRATION = process.env.JWT_ACCESS_TOKEN_EXPIRATION
if (!JWT_ACCESS_TOKEN_EXPIRATION) {
    throw new Error("JWT_ACCESS_TOKEN_EXPIRATION is not defined");
}
export const JWT_REFRESH_TOKEN_EXPIRATION = process.env.JWT_REFRESH_TOKEN_EXPIRATION
if (!JWT_REFRESH_TOKEN_EXPIRATION) {
    throw new Error("JWT_REFRESH_TOKEN_EXPIRATION is not defined");
}

