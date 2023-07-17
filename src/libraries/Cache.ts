import { NextFunction, Request, Response, Send } from 'express'
import NodeCache from 'node-cache'

export const nodeCache = new NodeCache()
declare global {
    namespace Express {
        interface Response {
            sendResponse: any
        }
    }
}

interface CacheParams {
    group?: string
    duration: string | number
}
export const cache =
    ({ group, duration }: CacheParams) =>
    (req: Request, res: Response, next: NextFunction) => {
        const key = group || req.originalUrl
        if (req.method !== 'GET') {
            // Clear cache on POST, PUT, DELETE of the same route
            if (nodeCache.has(key)) {
                console.log('Cache cleared')
                nodeCache.del(key)
            }
            return next()
        }
        const cachedBody: any = nodeCache.get(key)
        if (cachedBody) {
            console.log('Cache hit')
            res.json(JSON.parse(cachedBody))
        } else {
            console.log('Cache miss')
            res.sendResponse = res.json
            res.json = (body): any => {
                nodeCache.set(key, body, duration)
                res.sendResponse(body)
            }
            next()
        }
    }
