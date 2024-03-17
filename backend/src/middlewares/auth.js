import jwt from 'jsonwebtoken'
import { User } from '../databases/models/index.js'

async function isAuthUser(req, res, next) {
  try {
    const token = req.cookies?.token
    if (!token) throw new Error('Token missing')

    const { email } = jwt.verify(token, process.env.KEY)

    const user = await User.findOne({ email })
    if (!user) throw new Error('Authentication failed')
    req.user = user

    next()
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

async function isValidUser(req, res, next) {
  try {
    next()
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export { isAuthUser, isValidUser }
