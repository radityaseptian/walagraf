import user from './user.js'
import { Router } from 'express'

const router = Router()

router.use('/user', user)

export default router
