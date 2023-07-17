import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import User from '../models/User'
import RefreshToken from '../models/RefreshToken'
import { BadRequestError, signJwt, verifyJwt } from '@v8devs/common'
import { config } from '../constants'
import UserProvider from '../models/UserProvider'

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
    const user = await User.create({ name, email, avatar: `https://ui-avatars.com/api/?background=random&name=${name.replace(/ /g, '+')}` })
    await UserProvider.create({
        user: user.id,
        kind: 'credential',
        uid: email,
        password: hashPassword
    })
    const payload = {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        role: user.role
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
    const provider = await UserProvider.findOne({ uid: email })
    if (!provider) throw new BadRequestError('Not Found User') //Not Found User

    const match = await bcrypt.compare(password, `${provider.password}`)
    if (!match) throw new BadRequestError('Invalid credentials') //Unauthorized
    const user = await User.findOne({ id: provider.user })

    if (!user) throw new BadRequestError('Not Found User') //Not Found User
    const payload = {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        role: user.role
    }
    const accessToken = signJwt(payload, config.accessTokenPrivateKey!, { expiresIn: config.accessTokenExpiresIn })
    const refreshToken = signJwt(payload, config.refreshTokenPrivateKey!, { expiresIn: config.refreshTokenExpiresIn })

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
            // await RefreshToken.deleteMany({ userId: user.id })
        } else {
            // Delete old refresh token
            await RefreshToken.findOneAndDelete({ token: req.cookies?.refreshToken })
        }

        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: true })
    }
    // Saving refreshToken with current user
    await RefreshToken.create({ userId: user.id, token: refreshToken })

    // Creates Secure Cookie with refresh token
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: config.refreshTokenMaxAge })
    // Send authorization roles and access token to user

    return res.status(200).json({ accessToken, refreshToken, user: payload })
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

    const provider = await UserProvider.findOne({ user: req.user?.id })
    if (!provider) throw new BadRequestError('Not Found User') //Not Found User
    if (provider.password) {
        let passwordMatch: Boolean = bcrypt.compareSync(oldPassword, provider.password)
        if (!passwordMatch) {
            throw new BadRequestError('Password not match')
        }
    }

    const newPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    await UserProvider.findOneAndUpdate({ user: req.user?.id }, { password: newPassword })

    return res.status(201).json({ status: 'success' })
}

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const token = req.query.token || req.cookies?.refreshToken
        if (!token) return res.sendStatus(401)

        res.clearCookie('accessToken', { httpOnly: true, sameSite: 'none', secure: true })
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: true })

        const rfToken = await RefreshToken.findOne({ token })

        // Detected refresh token reuse!
        if (!rfToken) {
            const decoded: any = verifyJwt(token, config.refreshTokenPublicKey!)
            if (!decoded) return res.sendStatus(403) //Forbidden
            console.log('attempted refresh token reuse!')
            const hackedUser = await User.findOne({ id: decoded.id })
            if (hackedUser) {
                await RefreshToken.deleteMany({ userId: hackedUser.id }).exec()
            }

            return res.sendStatus(403) //Forbidden
        }

        // evaluate jwt
        const decoded: any = verifyJwt(token, config.refreshTokenPublicKey!)
        if (!decoded || rfToken.userId !== decoded.id) return res.sendStatus(403)
        // Refresh token was still valid
        const user = await User.findOne({ id: decoded.id })
        if (!user) return res.sendStatus(403)
        const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            role: user.role
        }
        // const accessTokenExpires = Date.now() + 10000
        const accessToken = signJwt(payload, config.accessTokenPrivateKey!, { expiresIn: config.accessTokenExpiresIn })

        const newRefreshToken = signJwt(payload, config.refreshTokenPrivateKey!, { expiresIn: config.refreshTokenExpiresIn })
        // Saving refreshToken with current user
        await RefreshToken.create({ userId: decoded.id, token: newRefreshToken })

        // Delete old refresh token
        const expireAt = new Date(new Date().getTime() + 5000)
        await RefreshToken.findOneAndUpdate({ token, expireAt })
        // await RefreshToken.findOneAndDelete({ token })

        // Creates Secure Cookie with refresh token
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: config.refreshTokenMaxAge })
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: config.refreshTokenMaxAge })
        res.json({ user: payload, accessToken, refreshToken: newRefreshToken })
    } catch (error) {
        console.log('Refresh err::')
        res.status(500).json({ error })
    }
}
