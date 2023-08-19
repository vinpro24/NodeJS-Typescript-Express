import express from 'express'
import 'express-async-errors'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { NotFoundError, errorHandler } from '@v8devs/common'

import Morgan from './middlewares/Morgan'
import { rateLimiter, speedLimiter } from './middlewares/Limiter'

import swagger from './libraries/Swagger'

import authRoutes from './routes/Auth'
import userRoutes from './routes/User'

const app = express()

app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(express.urlencoded({ extended: true, limit: '100mb' }))
app.use(express.json({ limit: '100mb' }))
app.use(cookieParser())
app.use(cors({ origin: '*' }))
app.use(Morgan)
swagger(app)
// app.use(rateLimiter)
app.use(speedLimiter)

app.use('/public', express.static('public'))

/** Routes */
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)

/** Healthcheck */
app.get('/health', (req, res, next) => {
    res.status(200).json({ pid: process.pid, uptime: process.uptime(), responseTime: process.hrtime(), timestamp: Date.now(), message: 'OK' })
})

// UnKnown Routes
app.all('*', () => {
    throw new NotFoundError()
})
/** Error handling */
app.use(errorHandler)

export default app
