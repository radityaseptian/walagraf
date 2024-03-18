const { Router } = require('express')
const user = require('../controllers/user.js')
const { isAuthUser } = require('../middlewares/auth.js')

const router = Router()

router.post('/register', user.register)
router.post('/login', user.login)
router.delete('/logout', user.logout)
router.get('/status', isAuthUser, user.status)

module.exports = router
