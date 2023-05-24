import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'

const rateLimiter = rateLimit({
    windowMs: 30 * 1000, // 15 seconds
    max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false // Disable the `X-RateLimit-*` headers
})

const speedLimiter = slowDown({
    windowMs: 30 * 1000, // 30 seconds
    delayAfter: 1, // allow 100 requests per 15 minutes, then...
    delayMs: 500 // begin adding 500ms of delay per request above 100:
    // request # 101 is delayed by  500ms
    // request # 102 is delayed by 1000ms
    // request # 103 is delayed by 1500ms
    // etc.
})

export { rateLimiter, speedLimiter }
