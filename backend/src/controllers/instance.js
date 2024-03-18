import TelegramClass from '../class/telegram.js'
import WhatsAppClass from '../class/whatsapp.js'
import { User, Instance } from '../databases/models/index.js'
import { v4 as uuid } from 'uuid'

async function init(req, res) {
  const { name = null, type } = req.body
  const { email } = req.user
  try {
    const id = uuid()
    let base64Qr

    if (type === 'whatsapp') {
      const socket = new WhatsAppInstance(email, id, null, true, name)
      await socket.start('')

      // setInterval(() => {

      // }, 500)

      Telegrams[id] = socket
      // ============================
    } else if (type === 'telegram') {
      const socket = new TelegramInstance(email, id, null)
      await socket.start('')

      base64Qr = await socket.getQr(name)
      Telegrams[id] = socket
      // ============================
    } else {
      return res.status(400).json({ success: false, message: 'Instance Type not recognize.' })
    }

    res.json({ success: true, data: base64Qr })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

async function restore(req, res) {
  // const { id } = req.query
  // try {
  //   const { email } = req.user
  //   const { session } = await Instance.findOne({ id })
  //   if (!session) {
  //     return res.status(400).json({ success: false, message: 'Telegram instance not running' })
  //   }
  //   const socket = new TelegramInstance(email, id, session)
  //   await socket.start(session)
  //   await User.updateOne({ name }, { $set: { status: 'online' } })
  //   TelegramInstances[name] = socket
  //   results.restores.push(name)
  //   res.json({ success: true, data: results })
  // } catch (error) {
  //   res.status(500).json({ success: false, message: error.message })
  // }
}

async function remove(req, res) {
  // const { id } = req.query
  // try {
  //   if (!id) return res.status(400).json({ success: false, message: 'Name cannot be empty!' })
  //   const user = await User.findOneAndDelete({ id })
  //   if (!user) return res.status(404).json({ success: false, message: 'User is not defined!' })
  //   const instance = TelegramInstances[id]
  //   if (instance) {
  //     await instance.destroyConnection()
  //     delete TelegramInstances[id]
  //   }
  //   res.json({ success: true, data: name })
  // } catch (error) {
  //   res.status(500).json({ success: false, message: error.message })
  // }
}

export { init, restore, remove }
