import app from './app'
import mongoose from 'mongoose'
import { config } from './constants'
import { Logging } from '@v8devs/common'
import cluster from 'cluster'
import os from 'os'
const http = require('http')
const cpus = os.cpus

/** Only Start Server if Mongoose Connects */
const StartServer = async () => {
    Logging.info('Server is checking workflow for merge...')

    /** Throw error if config variable undefine */
    if (!config.mongoUrl) {
        return Logging.error('Mongo Url not define')
    }

    try {
        await mongoose.connect(config.mongoUrl, { dbName: config.dbName })
        Logging.success('MongoDB connected successfully.')

        const server = http.createServer(app)

        server.listen(config.serverPort, () => Logging.info(`Started server on localhost:${config.serverPort}, url: http://localhost:${config.serverPort}`))
    } catch (error) {
        Logging.error(error)
    }
}

if (process.env.NODE_ENV === 'dev') {
    StartServer()
} else {
    /**
     * Shutdown the cluster workers properly
     */
    async function gracefulClusterShutdown() {
        console.log('Starting graceful cluster shutdown')
        shuttingDownServer = true
        await shutdownWorkers('SIGTERM')
        console.log('Successfully finished graceful cluster shutdown')
        process.exit(0)
    }

    /**
     * Shutdown all worker processes.
     * From https://medium.com/@gaurav.lahoti/graceful-shutdown-of-node-js-workers-dd58bbff9e30
     * @param signal Signal to send to the workers
     */
    function shutdownWorkers(signal: any) {
        return new Promise((resolve: any) => {
            if (!cluster.isPrimary) {
                return resolve()
            }
            const wIds = Object.keys(cluster.workers || {})
            if (wIds.length === 0) {
                return resolve()
            }
            // Filter all the valid workers
            const workers = wIds.map((id) => cluster.workers?.[id]).filter((v) => v)
            let workersAlive = 0
            let funcRun = 0
            // Count the number of alive workers and keep looping until the number is zero.
            const fn = () => {
                ++funcRun
                workersAlive = 0
                workers.forEach((worker) => {
                    if (!worker?.isDead()) {
                        ++workersAlive
                        if (funcRun === 1) {
                            // On the first execution of the function, send the received signal to all the workers
                            // https://github.com/nodejs/node-v0.x-archive/issues/6042#issuecomment-168677045
                            worker?.process.kill(signal)
                        }
                    }
                })
                console.log(workersAlive + ' workers alive')
                if (workersAlive === 0) {
                    // Clear the interval when all workers are dead
                    clearInterval(interval)
                    return resolve()
                }
            }
            const interval = setInterval(fn, 1000)
        })
    }

    // NodeJS is single threaded, how many CPUs/Threads do we want to use?
    const numCPUs = cpus().length
    let shuttingDownServer = false
    if (cluster.isPrimary) {
        console.log(`Primary ${process.pid} is running`)
        console.log(`Detected ${numCPUs} CPUs => same amount of threads will be started`)
        // Fork workers.
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork()
        }
        cluster.on('exit', (worker, code, signal) => {
            if (!shuttingDownServer) {
                console.log(`Worker ${worker.process.pid} died. Forking a new one...`)
                cluster.fork()
            }
        })
        // Graceful shutdown of all workers
        process.on('SIGTERM', gracefulClusterShutdown)
    } else {
        StartServer()
        console.log(`Worker ${process.pid} started`)
    }
}
