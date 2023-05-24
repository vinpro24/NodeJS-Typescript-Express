import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import app from '../app'

declare global {
    var signin: () => Promise<string[]>
}

// jest.setTimeout(60000)

let mongo: any

beforeAll(async () => {
    process.env.PORT = '3000'
    process.env.JWT_KEY = 'asdfasdf'
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

    mongo = await MongoMemoryServer.create()
    const mongoUri = mongo.getUri()

    await mongoose.connect(mongoUri)
})

beforeEach(async () => {
    // const collections = await mongoose.connection.db.collections()
    // for (let collection of collections) {
    //     await collection.deleteMany({})
    // }
    await mongoose.connection.db.dropDatabase()
})

afterAll(async () => {
    await mongo.stop()
    await mongoose.connection.close()
})

global.signin = async () => {
    const name = 'tester'
    const email = 'test@test.com'
    const password = 'password'

    const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({
            name,
            email,
            password
        })
        .expect(201)
    // console.log(response, 'responseresponseresponse')
    return response.body.accessToken
    // const cookie = response.get('Set-Cookie')
    // return cookie
}
