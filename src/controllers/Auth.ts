import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import User from '../models/User'
import { BadRequestError, NotAuthorizedError, NotFoundError, signJwt } from '@v8devs/common'
import { config } from '../constants'
import RefreshToken from '../models/RefreshToken'

/**
 * @openapi
 * /api/v1/auth/signup:
 *   post:
 *     tags:
 *      - Authenticate
 *     description: Sign up a new user!
 *     requestBody:
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           name:
 *            type: string
 *            example: John
 *           email:
 *            type: string
 *            example: name@mail.com
 *           password:
 *            type: string
 *            example: asdafawdawd
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Error
 */
export const signup = async (req: Request, res: Response) => {
    const { name, email, password } = req.body
    const hashPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
        name,
        email,
        password: hashPassword
    })
    const payload = {
        id: user._id,
        name: user.name
    }
    const accessToken = signJwt(payload, config.accessTokenPrivateKey!, { expiresIn: config.accessTokenExpiresIn })
    const newRefreshToken = signJwt(payload, config.refreshTokenPrivateKey!, { expiresIn: config.refreshTokenExpiresIn })

    if (req.cookies?.refreshToken) {
        /*
            Scenario added here:
                1) User logs in but never uses RT and does not logout
                2) RT is stolen
                3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
        */
        const foundToken = await RefreshToken.findOne({ token: req.cookies.refreshToken })

        // Detected refresh token reuse!
        if (!foundToken) {
            console.log('attempted refresh token reuse at login!')
            // clear out ALL previous refresh tokens
            await RefreshToken.deleteMany({ userId: user._id })
        } else {
            // Delete old refresh token
            await RefreshToken.findOneAndDelete({ token: req.cookies?.refreshToken })
        }

        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: true })
    }
    // Saving refreshToken with current user
    await RefreshToken.create({ userId: user._id, token: newRefreshToken })

    // Creates Secure Cookie with refresh token
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: config.refreshTokenMaxAge })

    res.status(201).json({ accessToken, user: { ...user.toJSON(), password: undefined } })
}

/**
 * @openapi
 * /api/v1/auth/signin:
 *   post:
 *     tags:
 *      - Authenticate
 *     description: Sign in with email/password!
 *     requestBody:
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           email:
 *            type: string
 *            example: name@mail.com
 *           password:
 *            type: string
 *            example: asdafawdawd
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Error
 */
export const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) throw new BadRequestError('Not Found User') //Not Found User

    const match = await bcrypt.compare(password, `${user.password}`)
    if (!match) throw new BadRequestError('Invalid credentials') //Unauthorized
    const payload = {
        id: user._id,
        name: user.name
    }
    const accessToken = signJwt(payload, config.accessTokenPrivateKey!, { expiresIn: config.accessTokenExpiresIn })
    const newRefreshToken = signJwt(payload, config.refreshTokenPrivateKey!, { expiresIn: config.refreshTokenExpiresIn })

    if (req.cookies?.refreshToken) {
        /*
            Scenario added here:
                1) User logs in but never uses RT and does not logout
                2) RT is stolen
                3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
        */
        const foundToken = await RefreshToken.findOne({ token: req.cookies.refreshToken })

        // Detected refresh token reuse!
        if (!foundToken) {
            console.log('attempted refresh token reuse at login!')
            // clear out ALL previous refresh tokens
            await RefreshToken.deleteMany({ userId: user._id })
        } else {
            // Delete old refresh token
            await RefreshToken.findOneAndDelete({ token: req.cookies?.refreshToken })
        }

        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: true })
    }
    // Saving refreshToken with current user
    await RefreshToken.create({ userId: user._id, token: newRefreshToken })

    // Creates Secure Cookie with refresh token
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: config.refreshTokenMaxAge })
    // Send authorization roles and access token to user

    return res.status(200).json({ accessToken, user: { ...user.toJSON(), password: undefined } })
}

/**
 * @openapi
 * /api/v1/auth/reset-password:
 *   post:
 *     tags:
 *      - Authenticate
 *     description: Reset Password!
 *     requestBody:
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           oldPassword:
 *            type: string
 *            example: password
 *           password:
 *            type: string
 *            example: asdafawdawd
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Error
 */
export const resetPassword = async (req: Request, res: Response) => {
    const { oldPassword, password } = req.body
    const user = await User.findById(req.user?.id)

    if (!user) throw new BadRequestError('Not Found User') //Not Found User

    let passwordMatch: Boolean = bcrypt.compareSync(oldPassword, user.password)
    if (!passwordMatch) {
        throw new BadRequestError('Password not match')
    }

    const newPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    await User.findByIdAndUpdate(req.user?.id, { password: newPassword })

    return res.status(201).json({ status: 'success' })
}
