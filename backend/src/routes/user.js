import { Router } from 'express'
import * as user from '../controllers/user.js'
import { isAuthUser } from '../middlewares/auth.js'

const router = Router()

router.post('/register', user.register)
router.post('/login', user.login)
router.delete('/logout', user.logout)
router.get('/status', isAuthUser, user.status)

export default router
