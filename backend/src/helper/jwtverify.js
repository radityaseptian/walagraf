import jwt from 'jsonwebtoken'
import 'dotenv/config'

const { KEY } = process.env

export async function jwtverify(token) {
  try {
    if (!token) return false
    const verify = jwt.verify(token, KEY)
    const admin = await Admin.findOne({ username: verify?.username })
    if (!admin) return false
    return true
  } catch (error) {
    return false
  }
}
