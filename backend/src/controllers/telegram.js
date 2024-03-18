import { User } from '../databases/models/index.js'
import { unlinkSync } from 'fs'
import { readFile } from 'fs/promises'

async function getMe(req, res) {
  const name = req.name
  try {
    const user = await User.findOne({ name })
    res.json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

async function sendMessage(req, res) {
  const instance = req.instance
  const { username, message = '' } = req.body
  const file = req.file

  try {
    if (!username || !message) {
      return res
        .status(400)
        .json({ success: false, message: 'Cannot read property undefined username or message.' })
    }

    const result = file
      ? await instance.sendMediaMessage(username, { file: file.path, caption: message })
      : await instance.sendTextMessage(username, { message })

    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  } finally {
    if (file) unlinkSync(file.path)
  }
}

async function getMessages(req, res) {
  const instance = req.instance
  const { id, limit = 20, offset = 0 } = req.query
  try {
    if (!id) return res.status(400).json({ success: false, message: 'Query id cannot be empty!' })

    const response = await instance.getMessages(id, parseInt(limit), parseInt(offset))

    res.json({ success: true, data: response })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

async function downloadMedia(req, res) {
  const { file } = req.body
  const instance = req.instance
  try {
    if (!file && typeof file !== 'object') {
      return res.status(400).json({ success: false, message: 'Typeof file must be object!' })
    }

    const media = await instance.downloadMedia(file)

    res.json({ success: true, data: media })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

async function updateProfileInfo(req, res) {
  const { firstName, lastName, about } = req.body
  const instance = req.instance
  const name = req.name
  try {
    if (!firstName || !lastName) {
      return res
        .status(400)
        .json({ success: false, message: 'Cannot read property undefined firstname, lastname.' })
    }

    const response = await instance.updateProfileInfo(firstName, lastName, about)
    const username = response.username ?? response.id
    const { about: newAbout } = (await instance.telegramUserInfo(username)).fullUser

    const firstname = response.firstName
    const lastname = response.lastName ?? ''
    const fullname = `${firstname} ${lastname}`.trim()
    const data = { fullname, firstname, lastname, about: newAbout }

    await User.updateOne({ name }, { $set: data })

    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

async function updateUsername(req, res) {
  const { username } = req.body
  const instance = req.instance
  const name = req.name
  try {
    if (!username)
      return res
        .status(400)
        .json({ success: false, message: 'Cannot read property undefined username' })
    const response = await instance.updateUsername(username)

    const data = { username: response.username }
    await User.updateOne({ name }, { $set: data })

    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

async function updateProfileAvatar(req, res) {
  const instance = req.instance
  const name = req.name
  const file = req.file
  try {
    if (!file)
      return res
        .status(400)
        .json({ success: false, message: 'Cannot read property undefined file' })
    const { path, size, originalname } = file
    await instance.updateProfileAvatar(path, size, originalname)

    const savedFile = await readFile(file.path)

    const profile = Buffer.from(savedFile).toString('base64')

    await User.updateOne({ name }, { $set: { profile } })

    res.json({ success: true, data: { profile } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  } finally {
    if (file) unlinkSync(file.path)
  }
}

async function telegramUserInfo(req, res) {
  const instance = req.instance
  const { usernames, phones } = req.body
  try {
    if (!Array.isArray(usernames) || !Array.isArray(phones)) {
      return res.status(400).json({ success: false, message: 'usernames or phones must be array!' })
    }

    const results = {
      usernames: { success: [], failed: [] },
      phones: { success: [], failed: [] },
    }

    for (const uName of usernames) {
      try {
        const response = await instance.telegramUserInfo(uName)
        const [{ username, phone, firstName, lastName, id }] = response.users
        results.usernames.success.push({ phone, userId: id, username, firstName, lastName })
      } catch (e) {
        results.usernames.failed.push(uName)
      }
    }

    for (const phone of phones) {
      try {
        const { users, peer } = await instance.checkUserByPhone('+' + phone)
        const [{ username, firstName, lastName }] = users
        results.phones.success.push({ phone, userId: peer.userId, username, firstName, lastName })
      } catch (e) {
        results.phones.failed.push(phone)
      }
    }

    return res.json({ success: true, data: results })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

async function blockUser(req, res) {
  const instance = req.instance
  const { username } = req.body
  try {
    const response = await instance.blockUser(username)
    res.json({ success: true, data: response })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

async function unblockUser(req, res) {
  const instance = req.instance
  const { username } = req.body
  try {
    const response = await instance.unblockUser(username)
    res.json({ success: true, data: response })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

async function setTyping(req, res) {
  const instance = req.instance
  const { username } = req.body
  try {
    if (!username) {
      return res.status(400).json({ success: false, message: 'Username cannot be empty!' })
    }

    const response = await instance.typing(username) //boolean
    const result = { success: response }

    if (!response) result.message = 'Failed change typing status'

    res.json(result)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

async function searchUser(req, res) {
  const { q } = req.query
  const instance = req.instance
  try {
    if (!q)
      return res.status(400).json({ success: false, message: 'Query params cannot be empty!' })
    const result = await instance.searchGlobal(q)
    res.json({ success: true, data: result.users })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export {
  init,
  restore,
  remove,
  getMe,
  sendMessage,
  getMessages,
  downloadMedia,
  updateUsername,
  updateProfileInfo,
  updateProfileAvatar,
  telegramUserInfo,
  blockUser,
  unblockUser,
  searchUser,
  setTyping,
}
