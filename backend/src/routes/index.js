import { Router } from 'express'
import user from './user.js'
import * as instance from '../controllers/instance.js'
import { isAuthUser, isValidUser } from '../middlewares/auth.js'

const router = Router()

router.use('/user', user)

router.use('/instance', isAuthUser)
router.post('/instance', instance.init)
router.get('/instance', isValidUser, instance.restore)
router.delete('/instance', isValidUser, instance.remove)

export default router
