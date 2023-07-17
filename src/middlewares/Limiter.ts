import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'

const rateLimiter = rateLimit({
    windowMs: 30 * 1000, // 30 seconds
    max: 30, // Limit each IP to 30 requests per `window` (here, per 30 seconds)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false // Disable the `X-RateLimit-*` headers
})

const speedLimiter = slowDown({
    windowMs: 30 * 1000, // 30 seconds
    delayAfter: 5, // allow 5 requests per 3 seconds, then...
    delayMs: 500 // begin adding 500ms of delay per request above 100:
    // request # 101 is delayed by  500ms
    // request # 102 is delayed by 1000ms
    // request # 103 is delayed by 1500ms
    // etc.
})

export { rateLimiter, speedLimiter }
