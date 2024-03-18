const { User } = require('../databases/models/index.js')
const jwt = require('jsonwebtoken')
const { hash, compare } = require('bcrypt')
require('dotenv').config()

async function login(req, res) {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })

    if (!user) return res.status(404).json({ success: false, message: 'Email not found!' })

    const validate = await compare(password, user.password)
    if (!validate) return res.status(400).json({ success: false, message: 'Password not match!' })

    const token = jwt.sign({ email: user.email }, process.env.KEY, { expiresIn: '30d' })
    const options = { httpOnly: true, path: '/', maxAge: 30 * 24 * 60 * 60 * 1000 }

    res.cookie('token', token, options)
    res.json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

async function register(req, res) {
  const { email, password } = req.body
  try {
    const isExist = await User.findOne({ email })
    if (isExist) return res.json({ success: false, message: 'Email already used!' })

    const newPassword = await hash(password, 10)
    const user = await new User({ email, password: newPassword }).save()

    res.json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

async function logout(req, res) {
  res.clearCookie('token')
  res.sendStatus(200)
}

async function status(req, res) {
  res.json({ success: true, data: req.user })
}

module.exports = { login, register, logout, status }
