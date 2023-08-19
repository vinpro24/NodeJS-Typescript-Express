import { RateLimiterCluster, RateLimiterMemory } from 'rate-limiter-flexible'
import slowDown from 'express-slow-down'
import { NextFunction, Request, Response } from 'express'

let rateLimiterFlexible: any = null
if (process.env.NODE_ENV === 'prod') {
    rateLimiterFlexible = new RateLimiterCluster({
        keyPrefix: 'middleware', // Must be unique for each limiter
        timeoutMs: 30000, // Promise is rejected, if master doesn't answer for 30 secs
        points: 30, // Limit each IP to 30 requests
        duration: 10 // 10 seconds
    })
} else {
    rateLimiterFlexible = new RateLimiterMemory({
        points: 30, // Limit each IP to 30 requests
        duration: 10 // 10 seconds
    })
}
const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
    rateLimiterFlexible
        .consume(req.ip)
        .then(() => {
            next()
        })
        .catch(() => {
            res.status(429).send('Too Many Requests')
        })
}

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
