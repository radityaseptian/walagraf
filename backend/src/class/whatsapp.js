import { makeWASocket, DisconnectReason } from '@whiskeysockets/baileys'
import { downloadMessage, useMultiFileAuthState, generateVC } from '../helper/index.js'
import { Account } from '../databases/models/index.js'
import qrCode from 'qrcode'
import axios from 'axios'
import config from '../config/whatsapp.js'

export default class Instance {
  _config = config
  client = {}

  misc = { qr: null, isFirst: true, name: null }

  constructor(fromUser, id, userId, isFirst = true, name = null) {
    this._config.fromUser = fromUser
    this._config.id = id
    this._config.userId = userId

    this.misc.isFirst = isFirst
    this.misc.name = name
  }

  sendEvent(event, data) {
    console.log(event, data)
  }

  async start(session) {
    const auth = await useMultiFileAuthState(`../auth/${session}`)
    this._config.clientParams.auth = auth.state

    const client = makeWASocket(this._config.clientParams)
    client.auth = auth
    this.client = client
    this.setHandler()
  }

  async destroy() {
    const { fromId, id } = this._config
    this.client.ev?.removeAllListeners()
    this.client?.ws?.close()
    // delete instance in user !
    Instance.deleteOne({ id }).catch(() => {})
  }

  setHandler() {
    const client = this.client

    // on credentials update save state
    client.ev?.on('creds.update', this.client.auth.saveCreds)

    // on socket closed, opened, connecting
    client.ev?.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update
      if (connection === 'connecting') return

      if (connection === 'close') {
        if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
          await this.start(this._config.id)
        } else {
          console.log(this._config.id, 'pairing or banned')
        }
      }

      if (connection === 'open' && this.misc.isFirst) {
        this.misc.isFirst = false
        const id = this._config.id
        try {
          const { name: waName, verifiedName, id: userId } = await this.getMe()
          const username = waName || verifiedName || 'unknown'
          this._config.userId = userId

          const name = this.misc.name
          const data = { name, userId, username, type: 'whatsapp', createdAt: Date.now() }

          await Instance.updateOne({ id }, { $set: { ...data, session: id } })
          this.sendEvent('connection', { ...data, status: 'success' })
        } catch (error) {
          this.sendEvent('connection', { status: 'failed', reason: error.message })
          return this.destroy()
        }
      }

      if (qr && this.misc.isFirst) qrCode.toDataURL(qr).then((url) => (this.misc.qr = url))
    })

    // == CHAT
    client.ev?.on('chats.upsert', (chats) => {
      console.log('chats.upsert', chats)
    })

    client.ev?.on('chats.update', (chats) => {
      console.log('chats.update', chats)
    })

    client.ev?.on('chats.phoneNumberShare', (chats) => {
      console.log('chats.phoneNumberShare', chats)
    })

    client.ev?.on('chats.delete', (chats) => {
      console.log('chats.delete', chats)
    })

    // == MISC

    client.ev?.on('presence.update', async (chats) => {
      console.log('presence.update', chats)
    })

    client.ev?.on('messaging-history.set', async (chats) => {
      console.log('messaging-history.set', chats)
    })

    // == CONTACT

    client.ev?.on('contacts.upsert', async (chats) => {
      console.log('contacts.upsert', chats)
    })

    client.ev?.on('contacts.update', async (chats) => {
      console.log('contacts.update', chats)
    })

    // == MESSAGE

    client.ev?.on('messages.delete', async (chats) => {
      console.log('messages.delete', chats)
    })

    client.ev?.on('messages.update', async (chats) => {
      console.log('messages.update', chats)
    })

    client.ev?.on('messages.media-update', async (chats) => {
      console.log('messages.media-update', chats)
    })

    client.ev?.on('messages.reaction', async (chats) => {
      console.log('messages.reaction', chats)
    })

    client.ev?.on('message-receipt.update', async (chats) => {
      console.log('message-receipt.update', chats)
    })

    client.ev?.on('messages.upsert', async (m) => {
      if (m.type !== 'notify') return

      m.messages.map(async (msg) => {
        if (!msg.message) return
        const data = { ...msg }

        const messageType = Object.keys(msg.message)[0]
        if (['protocolMessage', 'senderKeyDistributionMessage'].includes(messageType)) return

        if (messageType === 'conversation') {
          data['text'] = m
        }
        if (messageType === 'extendedTextMessage') {
          data['text'] = msg.message.extendedTextMessage.text
        }

        switch (messageType) {
          case 'imageMessage':
            data['content'] = await downloadMessage(msg.message.imageMessage, 'image')
            break
          case 'videoMessage':
            data['content'] = await downloadMessage(msg.message.videoMessage, 'video')
            break
          case 'audioMessage':
            data['content'] = await downloadMessage(msg.message.audioMessage, 'audio')
            break
          default:
            data['content'] = ''
            break
        }

        this.sendEvent('conversation', data)
      })
    })

    // == GROUP

    client.ev?.on('groups.upsert', async (group) => {
      console.log('group upsert', group)
      // this.createGroupByApp(group)
    })

    client.ev?.on('group-participants.update', async (group) => {
      console.log('group-participants.update', group)
      // this.updateGroupParticipantsByApp(group)
    })

    client.ev?.on('groups.update', async (chats) => {
      console.log('groups.update', chats)
    })

    // == BLACKLIST

    client.ev?.on('blocklist.set', async (chats) => {
      console.log('blocklist.set', chats)
    })

    client.ev?.on('blocklist.update', async (chats) => {
      console.log('blocklist.update', chats)
    })
  }

  async sendMessage(id, options) {
    return await this.client?.sendMessage(id, options)
  }

  // async deleteMessage(id, message) {
  //   return await this.client?.sendMessage(id, { delete: message })
  // }
  // async sendTextMessage(id, message) {
  //   return await this.client?.sendMessage(id, { text: message })
  // }
  // async sendMediaFile(to, file, type, caption = '', filename) {
  //   return await this.client?.sendMessage(to, {
  //     mimetype: file.mimetype,
  //     [type]: file.buffer,
  //     caption: caption,
  //     ptt: type === 'audio' ? true : false,
  //     fileName: filename ? filename : file.originalname,
  //   })
  // }
  // async sendUrlMediaFile(id, url, type, mimeType, caption = '') {
  //   const options = { [type]: { url: url }, caption: caption, mimetype: mimeType }
  //   return await this.client?.sendMessage(id, options)
  // }
  // async sendContactMessage(to, data) {
  //   const vcard = generateVC(data)
  //   return await this.client?.sendMessage(to, {
  //     contacts: { displayName: data.fullName, contacts: [{ displayName: data.fullName, vcard }] },
  //   })
  // }
  // async reactMessage(id, key, emoji) {
  //   return await this.client?.sendMessage(id, { react: { text: emoji, key: key } })
  // }

  async changeUsername(name) {
    return await this.client?.updateProfileName(name)
  }

  async updateProfilPicture(id, url) {
    const { data } = await axios.get(url, { responseType: 'arraybuffer' })
    return await this.client?.updateProfilePicture(id, Buffer.from(data))
  }

  async getMe() {
    return await this.client?.auth?.creds?.me
  }

  async isOnWhatsapp(id) {
    if (id.includes('@g.us')) return true
    const [result] = await this.client?.onWhatsApp(id)
    if (result?.exists) return true
    return false
  }

  async setUserUpdateStatus(statuses) {
    return await this.client?.updateProfileStatus(statuses)
  }

  async downloadProfile(id) {
    return await this.client?.profilePictureUrl(id, 'image')
  }

  async getUserStatus(id) {
    return await this.client?.fetchStatus(id)
  }

  async blockUnblock(to, data) {
    return await this.client?.updateBlockStatus(to, data)
  }

  async JoinGroup(code) {
    return await this.client?.groupAcceptInvite(code)
  }

  async setStatus(status, user) {
    return await this.client?.sendPresenceUpdate(status, user)
  }

  async createNewGroup(name, users) {
    return await this.client?.groupCreate(name, users)
  }

  async addNewParticipant(id, users) {
    return await this.client?.groupAdd(id, users)
  }

  async makeAdmin(id, users) {
    return await this.client?.groupMakeAdmin(id, users)
  }

  async demoteAdmin(id, users) {
    return await this.client?.groupDemoteAdmin(id, users)
  }

  async leaveGroup(id) {
    return await this.client?.groupLeave(id)
  }

  async getInviteCodeGroup(id) {
    return await this.client?.groupInviteCode(id)
  }

  async getInstanceInviteCodeGroup(id) {
    return await this.client?.groupInviteCode(id)
  }

  async groupFetchAllParticipating() {
    return await this.client?.groupFetchAllParticipating()
  }

  async groupParticipantsUpdate(id, users, action) {
    return await this.client?.groupParticipantsUpdate(id, users, action)
  }

  async groupSettingUpdate(id, action) {
    return await this.client?.groupSettingUpdate(id, action)
  }

  async groupUpdateSubject(id, subject) {
    return await this.client?.groupUpdateSubject(id, subject)
  }

  async groupUpdateDescription(id, desc) {
    return await this.client?.groupUpdatedesc(id, desc)
  }

  async readMessage(message) {
    const key = { remoteJid: message.remoteJid, id: message.id, participant: message?.participant }
    return await this.client?.readMessages([key])
  }
}
