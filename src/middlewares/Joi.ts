import Joi, { ObjectSchema } from 'joi'
import { NextFunction, Request, Response } from 'express'
import { IUser } from '../models/User'
import { Logging } from '@v8devs/common'

export const ValidateJoi = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body)

            next()
        } catch (error) {
            Logging.error(error)

            return res.status(422).json({ error })
        }
    }
}

export const Schemas = {
    auth: {
        signup: Joi.object<IUser>({
            name: Joi.string().required(),
            email: Joi.string().email(),
            password: Joi.string().required()
        }),
        signin: Joi.object<IUser>({
            email: Joi.string().required(),
            password: Joi.string().required()
        }),
        resetpassword: Joi.object<any>({
            oldPassword: Joi.string().required(),
            password: Joi.string().required()
        })
    },
    users: {
        update: Joi.object<IUser>({
            name: Joi.string(),
            email: Joi.string().email()
        })
    }
    // book: {
    //     create: Joi.object<IBook>({
    //         author: Joi.string()
    //             .regex(/^[0-9a-fA-F]{24}$/)
    //             .required(),
    //         title: Joi.string().required()
    //     }),
    //     update: Joi.object<IBook>({
    //         author: Joi.string()
    //             .regex(/^[0-9a-fA-F]{24}$/)
    //             .required(),
    //         title: Joi.string().required()
    //     })
    // }
}
