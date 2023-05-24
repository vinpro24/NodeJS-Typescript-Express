import express from 'express'
import * as controller from '../controllers/Auth'
import { Schemas, ValidateJoi } from '../middlewares/Joi'
import { currentUser, requireAuth } from '@v8devs/common'

const router = express.Router()

router.post('/signup', ValidateJoi(Schemas.auth.signup), controller.signup)
router.post('/signin', ValidateJoi(Schemas.auth.signin), controller.signin)
router.put('/reset-password', currentUser, requireAuth, ValidateJoi(Schemas.auth.resetpassword), controller.resetPassword)

export default router
