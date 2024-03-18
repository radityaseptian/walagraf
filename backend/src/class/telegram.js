const { TelegramClient, sessions, Api } = require('telegram')
const { CustomFile } = require('telegram/client/uploads.js')
const { NewMessage } = require('telegram/events')
const qrCode = require('qrcode')
const { schedule } = require('node-cron')

const { Instance, User } = require('../databases/models')
const { config } = require('../config/telegram.js')

module.exports = class TelegramClass {
  _config = config
  client = null

  cronDestroy // if not connected 5 minutes will destroy connection

  constructor(fromUser, id, userId) {
    this._config.fromUser = fromUser
    this._config.id = id
    this._config.userId = userId
  }

  sendEvent(event, data) {
    console.log(event, data)
  }

  events = {
    receiveMessage: async (event) => {
      // const message = event.message
      // const sender = (await message.getSender().catch(() => {})) || {}
      // console.log('event r', event)
      // console.log('sender r', sender)
      // this.sendEvent('conversation', { message, sender })
    },

    customEvent: async (event) => {
      console.log(event)

      // if (event instanceof Api.UpdateNewMessage) {
      //   const message = event.message
      //   const sender = (await message.getSender().catch(() => {})) || {}
      //   console.log('event u', event)
      //   console.log('sender u', sender)
      //   this.sendEvent('conversation', { message, sender })
      // }
    },
  }

  async start(session) {
    const { apiId, apiHash, clientParams } = this._config
    const strSession = new sessions.StringSession(session)
    const client = new TelegramClient(strSession, apiId, apiHash, clientParams)

    const conn = await client.connect()
    if (!conn) {
      this.destroy()
      throw new Error('Error connected to telegram')
    }

    if (!session) this.cronDestroy = schedule('*/5 * * * *', () => this.destroy())

    client.addEventHandler(this.events.receiveMessage, new NewMessage())
    client.addEventHandler(this.events.customEvent)
    this.client = client
  }

  async getQr(name) {
    const { apiId, apiHash, id, fromUser } = this._config
    return await new Promise(async (resolve, reject) => {
      await this.client
        .signInUserWithQrCode(
          { apiId, apiHash },
          {
            onError: () => reject(new Error('Error Get Qr Telegram')),
            qrCode: async ({ token }) =>
              resolve(await qrCode.toDataURL(`tg://login?token=${token.toString('base64url')}`)),
          }
        )
        .then(async (res) => {
          try {
            const { firstName, lastName, id: userId } = res
            this._config.userId = userId
            const session = this.client.session.save()

            const username = `${firstName} ${lastName ?? ''}`.trim() || 'unknown'
            const type = 'telegram'
            const data = { id, name: `${name ? `(${name})` : ''} ${username}`.trim(), type }

            await new Instance({ ...data, userId, username, session, createdAt }).save()
            await User.updateOne({ email: fromUser }, { $push: { instances: data } })

            this.sendEvent('connection', { ...data, status: 'success' })
          } catch (error) {
            this.sendEvent('connection', { status: 'failed', reason: error.message })
          } finally {
            this.cronDestroy?.stop()
          }
        })
    })
  }

  async destroy() {
    this.cronDestroy?.stop()
    await this.client.destroy().catch(() => {})
    const instances = { ...global.Telegrams }
    delete instances[this._config.id]
    global.Telegrams = instances
  }

  async markAsRead(chatId) {
    return await this.client.markAsRead(chatId)
  }

  async typing(username) {
    return await this.client.invoke(
      new Api.messages.SetTyping({
        peer: username,
        action: new Api.SendMessageTypingAction({}),
        topMsgId: 43,
      })
    )
  }

  async getDialog(limit) {
    return await this.client.getDialogs({ limit })
  }

  async downloadProfilePhoto(username) {
    return await this.client.downloadProfilePhoto(username)
  }

  async sendTextMessage(userName, config) {
    return await this.client.invoke(new Api.messages.SendMessage({ peer: userName, ...config }))
  }

  async sendMediaMessage(username, config) {
    return await this.client.sendFile(username, config)
  }

  async downloadMedia(file) {
    return await this.client.downloadMedia(file, {})
  }

  async updateProfileInfo(firstName, lastName, about) {
    return await this.client.invoke(new Api.account.UpdateProfile({ firstName, lastName, about }))
  }

  async updateUsername(username) {
    return await this.client.invoke(new Api.account.UpdateUsername({ username }))
  }

  async updateProfileAvatar(path, size, name) {
    const client = this.client
    return await client.invoke(
      new Api.photos.UploadProfilePhoto({
        file: await client.uploadFile({ file: new CustomFile(name, size, path), workers: 1 }),
      })
    )
  }

  async getMessages(chatId, limit, offset) {
    return await this.client.invoke(
      new Api.messages.GetHistory({ peer: chatId, limit, offsetId: offset })
    )
  }

  async searchGlobal(q) {
    return await this.client.invoke(new Api.contacts.Search({ q, limit: 20 }))
  }

  async telegramUserInfo(userId) {
    return await this.client.invoke(new Api.users.GetFullUser({ id: userId }))
  }

  async checkUsername(username) {
    return await this.client.invoke(new Api.account.CheckUsername({ username }))
  }

  async checkUserByPhone(phone) {
    return await this.client.invoke(new Api.contacts.ResolvePhone({ phone }))
  }

  async blockUser(userId) {
    return await this.client.invoke(new Api.contacts.Block({ id: userId }))
  }

  async unblockUser(userId) {
    return await this.client.invoke(new Api.contacts.Unblock({ id: userId }))
  }

  async joinGroup(hash) {
    return await this.client.invoke(new Api.messages.ImportChatInvite({ hash }))
  }

  async leaveGroup(chatId) {
    return await this.client.invoke(
      new Api.channels.LeaveChannel({
        channel: new Api.PeerChannel({ channelId: chatId }),
      })
    )
  }

  async getParticipants(chatId, limit, offset) {
    return await this.client.getParticipants(chatId, { limit, offset })
  }

  async inviteToGroup(chatId, userId) {
    return await this.client.invoke(new Api.messages.AddChatUser({ chatId, userId, fwdLimit: 20 }))
  }

  async kickParticipant(chatId, userId) {
    return await this.client.invoke(
      new Api.messages.DeleteChatUser({ chatId, userId, revokeHistory: true })
    )
  }

  async checkChatInvite(hash) {
    return await this.client.invoke(new Api.messages.CheckChatInvite({ hash }))
  }
}
