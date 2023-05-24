import request from 'supertest'
import app from '../app'

describe('Current User Test Case', () => {
    it('responds with details about the current user', async () => {
        const token = await global.signin()

        const response = await request(app).get('/api/v1/users/me').set('Authorization', `Bearer ${token}`).send().expect(200)
        expect(response.body.name).toEqual('tester')
    })

    it('responds with null if not authenticated', async () => {
        await request(app).get('/api/v1/users/me').send().expect(401)
    })
})
