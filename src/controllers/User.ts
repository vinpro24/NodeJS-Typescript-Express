import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import { BadRequestError, NotFoundError } from '@v8devs/common'
import User from '../models/User'
import { config } from '../constants'

/**
 * @openapi
 * /api/v1/users/:id:
 *   get:
 *     tags:
 *      - Users
 *     description: Get User!
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not found
 */
export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params
    const data = await User.findOne({ id: id === 'me' ? req.user.id : id })
    if (!data) throw new BadRequestError('Not found')

    res.status(200).json(data)
}

/**
 * @openapi
 * /api/v1/users/:id:
 *   put:
 *     tags:
 *      - Users
 *     description: Update user!
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
 *     responses:
 *       201:
 *         description: Success
 *       404:
 *         description: Error
 */
export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params
    const data = await User.findOne({ id })
    if (!data) throw new NotFoundError()
    if (!data) return res.status(404).json({ message: 'not found' })
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10)
    } else {
        delete req.body.password
    }

    data.set(req.body)
    data.save()
    res.status(201).json(data)
}

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params
    const data = await User.findOneAndRemove({ id })
    if (!data) throw new NotFoundError()

    res.status(201).json({ status: 'success' })
}
export const create = async (req: Request, res: Response) => {
    const { name, avatar, birthday, phone, password, email, nationalId } = req.body
    const hashPassword = password ? await bcrypt.hash(password, 10) : password
    const data = await User.create({
        name,
        avatar: avatar || `https://ui-avatars.com/api/?background=random&name=${name.replace(/ /g, '+')}`,
        birthday,
        phone,
        email,
        nationalId,
        password: hashPassword
    })
    res.status(201).json(data)
}

export const getAll = async (req: Request, res: Response) => {
    const { filter, q } = req.query
    const page = parseInt(req?.query?.page ? `${req.query.page}` : '1', 10)
    const perPage = parseInt(req?.query?.perPage ? `${req.query.perPage}` : '10', 10)

    let _filter = {}
    if (q) {
        _filter = { $text: { $search: q } }
    }
    const data = await User.find(_filter)
        .sort({ createdAt: -1 })
        .skip(page * perPage - perPage)
        .limit(perPage)
        .lean()
    const total = await User.countDocuments({})
    for (const i of data) {
        i.password = null
    }
    res.status(200).json({ data, page, perPage, total })
}
