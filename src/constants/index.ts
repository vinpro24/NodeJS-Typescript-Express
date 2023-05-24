import dotenv from 'dotenv'

dotenv.config()

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000

const allowedOrigins = ['http://localhost:3000']

export const config = {
    mongoUrl: process.env.MONGODB_URL || '',
    dbName: process.env.MONGODB_NAME || '',
    serverPort: SERVER_PORT,
    accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
    accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY,
    refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
    refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY,
    accessTokenExpiresIn: '10s',
    refreshTokenExpiresIn: '365d',
    refreshTokenMaxAge: 365 * 24 * 60 * 60 * 1000,
    corsOptions: {
        origin: (origin: any, callback: any) => {
            if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        },
        optionsSuccessStatus: 200
    }
}
