const { User } = require('../databases/models/index.js')
const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = async function jwtVerify(token) {
  try {
    if (!token) return false
    const { email } = jwt.verify(token, process.env.KEY)
    return await User.findOne({ email })
  } catch (error) {
    return false
  }
}
