import { User } from '../databases/models/index.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export async function jwtVerify(token) {
  try {
    if (!token) return false
    const { email } = jwt.verify(token, process.env.KEY)
    return await User.findOne({ email })
  } catch (error) {
    return false
  }
}
