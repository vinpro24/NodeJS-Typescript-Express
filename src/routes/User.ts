import express from 'express'
import * as controller from '../controllers/User'
import { Schemas, ValidateJoi } from '../middlewares/Joi'
import { currentUser, requireAuth } from '@v8devs/common'

const router = express.Router()

router.get('/', currentUser, requireAuth, controller.getAll)
router.post('/', currentUser, requireAuth, controller.create)
router.get('/:id', currentUser, requireAuth, controller.getUser)
router.put('/:id', currentUser, requireAuth, controller.updateUser)
router.delete('/:id', currentUser, requireAuth, controller.deleteUser)

export default router
