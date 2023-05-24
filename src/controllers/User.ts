import { Request, Response } from 'express'

import { BadRequestError, NotFoundError } from '@v8devs/common'
import User from '../models/User'

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
    const data = await User.findById(id === 'me' ? req.user.id : id)
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
    const { name, email } = req.body
    const data = await User.findByIdAndUpdate(id, { name, email }, { new: true })
    if (!data) throw new NotFoundError()
    res.status(201).json(data)
}
