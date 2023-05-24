import request from 'supertest'
import app from '../app'

describe('SignIn Test Case', () => {
    it('fails when a email that does not exist is supplied', async () => {
        await request(app)
            .post('/api/v1/auth/signin')
            .send({
                email: 'test@test.com',
                password: 'password'
            })
            .expect(400)
    })

    it('fails when an incorrect password is supplied', async () => {
        await request(app)
            .post('/api/v1/auth/signup')
            .send({
                name: 'tester',
                email: 'test@test.com',
                password: 'password'
            })
            .expect(201)

        await request(app)
            .post('/api/v1/auth/signin')
            .send({
                email: 'test@test.com',
                password: 'aslkdfjalskdfj'
            })
            .expect(400)
    })

    it('responds with a cookie when given valid credentials', async () => {
        await request(app)
            .post('/api/v1/auth/signup')
            .send({
                name: 'tester',
                email: 'test@test.com',
                password: 'password'
            })
            .expect(201)

        const response = await request(app)
            .post('/api/v1/auth/signin')
            .send({
                email: 'test@test.com',
                password: 'password'
            })
            .expect(200)

        expect(response.get('Set-Cookie')).toBeDefined()
    })
})
