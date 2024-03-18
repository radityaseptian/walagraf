import { User } from '../databases/models/index.js'
import { jwtVerify } from '../helper/jwtverify.js'

async function isAuthUser(req, res, next) {
  try {
    const user = await jwtVerify(req.cookies?.token)
    if (!user) throw new Error('Authentication failed')

    req.user = user
    next()
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

async function isValidUser(req, res, next) {
  try {
    const { id } = req.query
    const { email } = req.user

    next()
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export { isAuthUser, isValidUser }
