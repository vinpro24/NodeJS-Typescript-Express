import app from './app'
import mongoose from 'mongoose'
import { config } from './constants'
import { Logging } from '@v8devs/common'

/** Only Start Server if Mongoose Connects */
const StartServer = async () => {
    Logging.info('Server is checking workflow for merge...')

    /** Throw error if config variable undefine */
    if (!config.mongoUrl) {
    }

    try {
        await mongoose.connect(config.mongoUrl, { dbName: config.dbName })
        Logging.success('MongoDB connected successfully.')

        app.listen(config.serverPort, () => Logging.info(`Started server on 0.0.0.0:${config.serverPort}, url: http://localhost:${config.serverPort}`))
    } catch (error) {
        Logging.error(error)
    }
}

StartServer()
