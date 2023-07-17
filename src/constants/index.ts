import dotenv from 'dotenv'

dotenv.config()

const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 3000

export const config = {
    baseUrl: process.env.NODE_ENV === 'dev' ? 'http://localhost:3001' : process.env.BASE_URL || '',
    mongoUrl: process.env.MONGODB_URL || '',
    dbName: process.env.MONGODB_NAME || '',
    serverPort: SERVER_PORT,
    accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
    accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY,
    refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
    refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY,
    accessTokenExpiresIn: process.env.NODE_ENV === 'dev' ? '10s' : '60m',
    refreshTokenExpiresIn: '365d',
    refreshTokenMaxAge: 365 * 24 * 60 * 60 * 1000
}
