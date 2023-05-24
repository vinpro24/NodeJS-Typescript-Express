import express from 'express'
import * as controller from '../controllers/User'
import { Schemas, ValidateJoi } from '../middlewares/Joi'
import { currentUser, requireAuth } from '@v8devs/common'

const router = express.Router()

router.get('/:id', currentUser, requireAuth, controller.getUser)
router.put('/:id', currentUser, requireAuth, ValidateJoi(Schemas.users.update), controller.updateUser)
// router.get('/get/', controller.readAll)
// router.patch('/update/:bookId', ValidateJoi(Schemas.book.update), controller.updateBook)
// router.delete('/delete/:bookId', controller.deleteBook)

export default router
