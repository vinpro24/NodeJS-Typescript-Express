import request from 'supertest'
import app from '../app'

describe('Reset Password Test Case', () => {
    it('reset password fails when an invalid password', async () => {
        const token = await global.signin()
        await request(app)
            .put('/api/v1/auth/reset-password')
            .set('Authorization', `Bearer ${token}`)
            .send({
                oldPassword: 'acb',
                password: 'def'
            })
            .expect(400)
    })

    it('reset password and signin success when got a new password', async () => {
        const token = await global.signin()

        await request(app)
            .put('/api/v1/auth/reset-password')
            .set('Authorization', `Bearer ${token}`)
            .send({
                oldPassword: 'password',
                password: 'newpassword'
            })
            .expect(201)

        const response = await request(app)
            .post('/api/v1/auth/signin')
            .send({
                email: 'test@test.com',
                password: 'newpassword'
            })
            .expect(200)

        expect(response.get('Set-Cookie')).toBeDefined()
    })
})
