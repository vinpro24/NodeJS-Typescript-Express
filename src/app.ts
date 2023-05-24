import express from 'express'
import 'express-async-errors'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from './constants'

import authRoutes from './routes/Auth'
import userRoutes from './routes/User'
import { NotFoundError, errorHandler } from '@v8devs/common'
import swagger from './libraries/Swagger'
import Morgan from './middlewares/Morgan'
import { rateLimiter, speedLimiter } from './middlewares/Limiter'

const app = express()

app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(Morgan)
app.use(express.urlencoded({ extended: true, limit: '100mb' }))
app.use(express.json({ limit: '100mb' }))
app.use(cookieParser())
app.use(cors(config.corsOptions))
swagger(app)
app.use(rateLimiter)
app.use(speedLimiter)

/** Routes */
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)

/** Healthcheck */
app.get('/ping', (req, res, next) => res.status(200).json({ hello: 'world' }))

// UnKnown Routes
app.all('*', () => {
    throw new NotFoundError()
})
/** Error handling */
app.use(errorHandler)

export default app
