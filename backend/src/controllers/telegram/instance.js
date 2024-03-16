import TelegramInstance from '../../class/telegram.js'
import { User, Instance } from '../../databases/models/index.js'
import { v4 as uuid } from 'uuid'

async function init(req, res) {
  const { name = null } = req.body
  const { email } = req.user
  try {
    const id = uuid()
    const socket = new TelegramInstance(email, id, null)
    await socket.start('')

    const base64Qr = await socket.getQr(name)
    Telegrams[id] = socket

    res.json({ success: true, data: base64Qr })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

async function restore(req, res) {
  const { id } = req.body
  try {
    const { email } = req.user
    const { session } = await Instance.findOne({ id })

    if (!session) {
      return res.status(400).json({ success: false, message: 'Telegram instance not running' })
    }

    const socket = new TelegramInstance(email, id, session)
    await socket.start(session)
    await User.updateOne({ name }, { $set: { status: 'online' } })
    TelegramInstances[name] = socket
    results.restores.push(name)

    res.json({ success: true, data: results })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

async function remove(req, res) {
  const { name } = req.query
  try {
    if (!name) return res.status(400).json({ success: false, message: 'Name cannot be empty!' })
    const user = await User.findOneAndDelete({ name })
    if (!user) return res.status(404).json({ success: false, message: 'User is not defined!' })

    const instance = TelegramInstances[name]
    if (instance) {
      await instance.destroyConnection()
      delete TelegramInstances[name]
    }

    res.json({ success: true, data: name })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

async function sendCode(req, res) {
  const { phone } = req.body
  const instance = req.instance
  const name = req.name
  try {
    const user = await User.findOne({ name })

    if (user.status !== 'idle') {
      return res.status(400).json({ success: false, message: 'User not idle.' })
    }

    const response = await instance.sendCode(phone)

    res.json({ success: true, data: response })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
} //

async function register(req, res) {
  const { firstName, lastName, hash, phone } = req.body
  const instance = req.instance
  const name = req.name
  try {
    if (!firstName || !lastName || !hash | !phone) {
      return res
        .status(400)
        .json({ success: false, message: 'Firstname, Lastname, Phone and Hash cannot be empty!' })
    }

    const user = await User.findOne({ name })
    if (user.status !== 'idle') {
      return res.status(400).json({ success: false, message: 'User not idle.' })
    }

    const response = await instance.register(phone, hash, firstName, lastName)

    res.json({ success: true, data: response })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
} //

export { init, restore, getQr, remove, sendCode, register }
