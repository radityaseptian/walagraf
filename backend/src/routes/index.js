const { Router } = require('express')
const user = require('./user.js')
const instance = require('../controllers/instance.js')
const { isAuthUser, isValidUser } = require('../middlewares/auth.js')

const router = Router()

router.use('/user', user)

router.use('/instance', isAuthUser)
router.post('/instance', instance.init)
router.get('/instance', isValidUser, instance.restore)
router.delete('/instance', isValidUser, instance.remove)

module.exports = router
