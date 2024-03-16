import { makeWASocket, DisconnectReason } from '@whiskeysockets/baileys'
import { downloadMessage, useMultiFileAuthState, generateVC } from '../helper/index.js'
import qrCode from 'qrcode'
import logger from 'pino'
import config from '../config/whatsapp.js'

class WhatsAppInstance {
  _config = config
  client = null

  constructor(fromUser, id, userId) {
    this._config.fromUser = fromUser
    this._config.id = id
    this._config.userId = userId
  }

  sendEvent(event, data) {
    console.log(event, data)
  }

  async start(session) {
    const auth = await useMultiFileAuthState(`../auth/${session}`)

    const client = makeWASocket(this._config.clientParams)
    client.auth = auth
    this.client = client
    this.setHandler()

    return client
    // this.collection = mongoClient.db('Device_AuthSave').collection(this.key)
    // const { state, saveCreds } = await useMongoDBAuthState(this.collection)
    // this.authState = { state: state, saveCreds: saveCreds }
    // this.socketConfig.auth = this.authState.state
    // this.instance.sock = makeWASocket(this.socketConfig)
    // this.setHandler()
    // return this
  }

  setHandler() {
    const sock = this.instance.sock
    // on credentials update save state
    sock?.ev.on('creds.update', this.authState.saveCreds)
    // on socket closed, opened, connecting
    sock?.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update

      if (connection === 'connecting') return

      if (connection === 'close') {
        if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
          await this.init()
        } else {
          await this.collection.drop().then((r) => {
            logger.info('STATE: Droped collection')
          })
          this.instance.online = false
          let WaName
          const me = await this.getMe()
          if (me?.name) {
            WaName = me?.name
          } else if (me?.verifiedName) {
            WaName = me?.verifiedName
          } else {
            WaName = 'UNKNOWN'
          }
          await Devices.findOneAndUpdate(
            {
              key: this.key,
            },
            {
              wa_name: WaName,
              phone: me?.id,
              status: 'PAIRING',
            }
          )
        }
      } else if (connection === 'open') {
        if (config.mongoose.enabled) {
          let alreadyThere = await Chat.findOne({
            key: this.key,
          }).exec()
          if (!alreadyThere) {
            const saveChat = new Chat({ key: this.key })
            await saveChat.save()
          }
        }
        this.instance.online = true
        let WaName
        const me = await this.getMe()
        if (me?.name) {
          WaName = me?.name
        } else if (me?.verifiedName) {
          WaName = me?.verifiedName
        } else {
          WaName = 'UNKNOWN'
        }

        await Devices.findOneAndUpdate(
          {
            key: this.key,
          },
          {
            wa_name: WaName,
            phone: me?.id,
            status: 'ONLINE',
          }
        )
      }

      if (qr) {
        QRCode.toDataURL(qr).then((url) => {
          this.instance.qr = url
          this.instance.qrRetry++
          if (this.instance.qrRetry >= config.instance.maxRetryQr) {
            // close WebSocket connection
            this.instance.sock.ws.close()
            // remove all events
            this.instance.sock.ev.removeAllListeners()
            this.instance.qr = ' '
            logger.info('socket connection terminated')
          }
        })
      }
    })
    sock?.ev.on('close', async (data) => {})

    sock?.ev.on('chats.set', async ({ chats }) => {
      this.instance.chats = []
      const recivedChats = chats.map((chat) => {
        return {
          ...chat,
          messages: [],
        }
      })
      this.instance.chats.push(...recivedChats)
      await this.updateDb(this.instance.chats)
      await this.updateDbGroupsParticipants()
    })
    // on recive new chat
    sock.ev.on('chats.upsert', (newChat) => {
      const chats = newChat.map((chat) => {
        return {
          ...chat,
          messages: [],
        }
      })
      this.instance.chats.push(...chats)
    })
    // on chat change
    sock?.ev.on('chats.update', (changedChat) => {
      // console.log(changedChat);
      changedChat.map((chat) => {
        const index = this.instance.chats.findIndex((pc) => pc.id === chat.id)
        const PrevChat = this.instance.chats[index]
        this.instance.chats[index] = {
          ...PrevChat,
          ...chat,
        }
      })
    })
    // on chat delete
    sock?.ev.on('chats.delete', (deletedChats) => {
      deletedChats.map((chat) => {
        const index = this.instance.chats.findIndex((c) => c.id === chat)
        this.instance.chats.splice(index, 1)
      })
    })

    // on new mssage
    sock?.ev.on('messages.upsert', async (m) => {
      try {
        // const history = await this.instance.sock.downloadHistory(msg);
        // console.log(history);
      } catch (error) {
        console.log(error)
      }
      if (m.type === 'prepend') this.instance.messages.unshift(...m.messages)
      if (m.type !== 'notify') this.instance.messages.unshift(...m.messages)
      // if(m.type === 'append')
      //     this.instance.messages.unshift(...m.messages)

      this.instance.online = true
      let WaName
      const me = await this.getMe()
      if (me?.name) {
        WaName = me?.name
      } else if (me?.verifiedName) {
        WaName = me?.verifiedName
      } else {
        WaName = 'UNKNOWN'
      }

      await Devices.findOneAndUpdate(
        {
          key: this.key,
        },
        {
          wa_name: WaName,
          phone: me?.id,
          status: 'ONLINE',
        }
      )
      m.messages.map(async (msg) => {
        if (!msg.message) return
        if (msg.key.fromMe) return
        if (msg.key.remoteJid === 'status@broadcast') return
        // if (msg.key.remoteJid.includes('@g.us')) return
        if (msg.key.remoteJid.includes('-')) return

        const messageType = Object.keys(msg.message)[0]
        if (['protocolMessage', 'senderKeyDistributionMessage'].includes(messageType)) return
        const device = await Devices.findOne({
          key: this.key,
        })
        const webhookData = {
          device: device,
          key: this.key,
          ...msg,
        }

        if (messageType === 'conversation') {
          webhookData['text'] = m
        }
        if (messageType === 'extendedTextMessage') {
          webhookData['text'] = msg.message.extendedTextMessage.text
        }
        if (config.webhookBase64) {
          switch (messageType) {
            case 'imageMessage':
              webhookData['msgContent'] = await downloadMessage(msg.message.imageMessage, 'image')
              break
            case 'videoMessage':
              webhookData['msgContent'] = await downloadMessage(msg.message.videoMessage, 'video')
              break
            case 'audioMessage':
              webhookData['msgContent'] = await downloadMessage(msg.message.audioMessage, 'audio')
              break
            default:
              webhookData['msgContent'] = ''
              break
          }
        }

        await this.SendWebhook(webhookData)
        let deviceAuth = mongoClient
          .db('Device_AuthSave')
          .collection(this.key)
          .initializeOrderedBulkOp()
        for (let i = 0; i <= 5000; i++) {
          deviceAuth.find({ _id: `pre-key-${i}` }).delete()
        }
        deviceAuth.execute()
      })
    })

    // sock?.ev.on('chats-received',async ({ hasNewChats }) => {
    //     console.log(hasNewChats);
    // })
    sock?.ev.on('groups.upsert', async (newChat) => {
      this.createGroupByApp(newChat)
      if (['all', 'groups', 'groups.upsert'].some((e) => config.webhookAllowedEvents.includes(e)))
        await this.SendWebhook(
          'group_created',
          {
            data: newChat,
          },
          this.key
        )
    })

    sock?.ev.on('groups.update', async (newChat) => {
      this.updateGroupSubjectByApp(newChat)
      if (['all', 'groups', 'groups.update'].some((e) => config.webhookAllowedEvents.includes(e)))
        await this.SendWebhook(
          'group_updated',
          {
            data: newChat,
          },
          this.key
        )
    })
    sock?.ev.on('group-participants.update', async (newChat) => {
      this.updateGroupParticipantsByApp(newChat)
      if (
        ['all', 'groups', 'group_participants', 'group-participants.update'].some((e) =>
          config.webhookAllowedEvents.includes(e)
        )
      )
        await this.SendWebhook(
          'group_participants_updated',
          {
            data: newChat,
          },
          this.key
        )
    })
    sock.ev.on('call', async (call) => {
      await sock.rejectCall(call[0].id, call[0].from)
    })
  }

  async DeleteMessage(to, message) {
    try {
      const data = await this.instance.sock.sendMessage(to + '@s.whatsapp.net', { delete: message })
      return data
    } catch (error) {
      return error
    }
  }

  async fecthAllContactGroup() {
    try {
      const data = await this.instance.sock.groupFetchAllParticipating()
      const Group = Object.entries(data)
        .slice(0)
        .map((entry) => entry[1])
      return Group
    } catch (error) {
      console.log(error)
    }
  }

  async ChangeNameProfile(name) {
    try {
      const data = await this.instance.sock.updateProfileName(name)
      return data
    } catch (error) {
      return error
    }
  }
  async sendButtonTextMessage2(to, message) {
    const verifyId = await this.verifyId(this.getWhatsAppId(to))
    if (!verifyId) return
    const buttons = message.buttons
    const buttonMessage = {
      image: { url: message.imageUrl },
      caption: message.caption,
      footer: message.footer,
      buttons: buttons,
      headerType: 4,
    }
    const data = await this.instance.sock.sendMessage(this.getWhatsAppId(to), buttonMessage)
    return data
  }
  async getMe() {
    const me = await this.instance.sock?.authState.creds.me
    if (me === undefined) return
    return me
  }
  async deleteInstance(key) {
    try {
      await Chat.findOneAndDelete({ key: key })
    } catch (e) {
      logger.error('Error updating document failed')
    }
  }
  async getInstanceDetail(key) {
    return {
      instance_key: key,
      phone_connected: this.instance?.online,
      user: this.instance?.online ? this.instance.sock?.user : {},
    }
  }
  getWhatsAppId(id) {
    if (id.includes('@g.us') || id.includes('@s.whatsapp.net')) return id
    return id.includes('-') ? `${id}@g.us` : `${id}@s.whatsapp.net`
  }
  async verifyId(id) {
    if (id.includes('@g.us')) return true
    const [result] = await this.instance.sock?.onWhatsApp(id)
    if (result?.exists) return true
  }
  async sendTextMessage(to, message) {
    const verifyId = await this.verifyId(this.getWhatsAppId(to))
    if (!verifyId) return
    try {
      const data = await this.instance.sock?.sendMessage(this.getWhatsAppId(to), { text: message })
      return data
    } catch (error) {
      return { data: 'Number not exist' }
    }
  }

  async setUserUpdateStatus(statuses) {
    const status = await this.instance.sock.updateProfileStatus(statuses)
    return status
  }

  async sendMediaFile(to, file, type, caption = '', filename) {
    await this.verifyId(this.getWhatsAppId(to))
    const data = await this.instance.sock?.sendMessage(this.getWhatsAppId(to), {
      mimetype: file.mimetype,
      [type]: file.buffer,
      caption: caption,
      ptt: type === 'audio' ? true : false,
      fileName: filename ? filename : file.originalname,
    })
    return data
  }
  async sendUrlMediaFile(to, url, type, mimeType, caption = '') {
    await this.verifyId(this.getWhatsAppId(to))
    const data = await this.instance.sock?.sendMessage(this.getWhatsAppId(to), {
      [type]: {
        url: url,
      },
      caption: caption,
      mimetype: mimeType,
    })
    return data
  }
  async DownloadProfile(of) {
    await this.verifyId(this.getWhatsAppId(of))
    const ppUrl = await this.instance.sock?.profilePictureUrl(this.getWhatsAppId(of), 'image')
    return ppUrl
  }
  async getUserStatus(of) {
    await this.verifyId(this.getWhatsAppId(of))
    const status = await this.instance.sock?.fetchStatus(this.getWhatsAppId(of))
    return status
  }
  async blockUnblock(to, data) {
    await this.verifyId(this.getWhatsAppId(to))
    const status = await this.instance.sock?.updateBlockStatus(this.getWhatsAppId(to), data)
    return status
  }
  async sendButtonMessage(to, data) {
    await this.verifyId(this.getWhatsAppId(to))
    const result = await this.instance.sock?.sendMessage(this.getWhatsAppId(to), {
      templateButtons: processButton(data.buttons),
      text: data.text ?? '',
      footer: data.footerText ?? '',
      viewOnce: true,
    })
    return result
  }

  async sendContactMessage(to, data) {
    await this.verifyId(this.getWhatsAppId(to))
    const vcard = generateVC(data)
    const result = await this.instance.sock?.sendMessage(await this.getWhatsAppId(to), {
      contacts: {
        displayName: data.fullName,
        contacts: [{ displayName: data.fullName, vcard }],
      },
    })
    return result
  }

  async sendListMessage(to, data) {
    await this.verifyId(this.getWhatsAppId(to))
    const result = await this.instance.sock?.sendMessage(this.getWhatsAppId(to), {
      text: data.text,
      sections: data.sections,
      buttonText: data.buttonText,
      footer: data.description,
      title: data.title,
      viewOnce: true,
    })
    return result
  }

  async sendMediaButtonMessage(to, data) {
    await this.verifyId(this.getWhatsAppId(to))

    const result = await this.instance.sock?.sendMessage(this.getWhatsAppId(to), {
      [data.mediaType]: {
        url: data.image,
      },
      footer: data.footerText ?? '',
      caption: data.text,
      templateButtons: processButton(data.buttons),
      mimetype: data.mimeType,
      viewOnce: true,
    })
    return result
  }

  async JoinGroup(code) {
    try {
      const res = await this.instance.sock.groupAcceptInvite(code)
      return res
    } catch (error) {
      return error
    }
  }

  async setStatus(status, to) {
    await this.verifyId(this.getWhatsAppId(to))
    const result = await this.instance.sock?.sendPresenceUpdate(status, to)
    return result
  }

  // change your display picture or a group's
  async updateProfilPicture(id, url) {
    try {
      const img = await axios.get(url, { responseType: 'arraybuffer' })
      console.log(img.data)
      const res = await this.instance.sock.updateProfilePicture(id, img.data)
      return res
    } catch (e) {
      console.log(e)
      return {
        error: true,
        message: 'Unable to update profile picture',
      }
    }
  }

  // get user or group object from db by id
  async getUserOrGroupById(id) {
    try {
      let Chats = await this.getChat()
      const group = Chats.find((c) => c.id === this.getWhatsAppId(id))
      if (!group) throw new Error('unable to get group, check if the group exists')
      return group
    } catch (e) {
      logger.error(e)
      logger.error('Error get group failed')
    }
  }

  // Group Methods
  parseParticipants(users) {
    return users.map((users) => this.getWhatsAppId(users))
  }

  async updateDbGroupsParticipants() {
    try {
      let groups = await this.groupFetchAllParticipating()
      let Chats = await this.getChat()
      if (groups && Chats) {
        for (const [key, value] of Object.entries(groups)) {
          let group = Chats.find((c) => c.id === value.id)
          if (group) {
            let participants = []
            for (const [key_participant, participant] of Object.entries(value.participants)) {
              participants.push(participant)
            }
            group.participant = participants
            if (value.creation) {
              group.creation = value.creation
            }
            if (value.subjectOwner) {
              group.subjectOwner = value.subjectOwner
            }
            Chats.filter((c) => c.id === value.id)[0] = group
          }
        }
        await this.updateDb(Chats)
      }
    } catch (e) {
      logger.error(e)
      logger.error('Error updating groups failed')
    }
  }

  async createNewGroup(name, users) {
    try {
      const group = await this.instance.sock?.groupCreate(name, users.map(this.getWhatsAppId))
      return group
    } catch (e) {
      logger.error(e)
      logger.error('Error create new group failed')
    }
  }

  async addNewParticipant(id, users) {
    try {
      const res = await this.instance.sock?.groupAdd(
        this.getWhatsAppId(id),
        this.parseParticipants(users)
      )
      return res
    } catch {
      return {
        error: true,
        message: 'Unable to add participant, you must be an admin in this group',
      }
    }
  }

  async makeAdmin(id, users) {
    try {
      const res = await this.instance.sock?.groupMakeAdmin(
        this.getWhatsAppId(id),
        this.parseParticipants(users)
      )
      return res
    } catch {
      return {
        error: true,
        message:
          'unable to promote some participants, check if you are admin in group or participants exists',
      }
    }
  }

  async demoteAdmin(id, users) {
    try {
      const res = await this.instance.sock?.groupDemoteAdmin(
        this.getWhatsAppId(id),
        this.parseParticipants(users)
      )
      return res
    } catch {
      return {
        error: true,
        message:
          'unable to demote some participants, check if you are admin in group or participants exists',
      }
    }
  }

  async getAllGroups() {
    let Chats = await this.getChat()
    return Chats.filter((c) => c.id.includes('@g.us')).map((data, i) => {
      return {
        index: i,
        name: data.name,
        jid: data.id,
        participant: data.participant,
        creation: data.creation,
        subjectOwner: data.subjectOwner,
      }
    })
  }

  async leaveGroup(id) {
    try {
      const data = await this.instance.sock.groupLeave(id)
      console.log(data)
      return { Message: 'Leave group', data: data }
    } catch (e) {
      return { Message: 'Group not Exits' }
    }
  }

  async getInviteCodeGroup(id) {
    try {
      let Chats = await this.getChat()
      const group = Chats.find((c) => c.id === id)
      if (!group) throw new Error('unable to get invite code, check if the group exists')
      return await this.instance.sock?.groupInviteCode(id)
    } catch (e) {
      logger.error(e)
      logger.error('Error get invite group failed')
    }
  }

  async getInstanceInviteCodeGroup(id) {
    try {
      return await this.instance.sock?.groupInviteCode(id)
    } catch (e) {
      logger.error(e)
      logger.error('Error get invite group failed')
    }
  }

  // get Chat object from db
  async getChat(key = this.key) {
    let dbResult = await Chat.findOne({ key: key }).exec()
    let ChatObj = dbResult.chat
    return ChatObj
  }

  // create new group by application
  async createGroupByApp(newChat) {
    try {
      let Chats = await this.getChat()
      let group = {
        id: newChat[0].id,
        name: newChat[0].subject,
        participant: newChat[0].participants,
        messages: [],
        creation: newChat[0].creation,
        subjectOwner: newChat[0].subjectOwner,
      }
      Chats.push(group)
      await this.updateDb(Chats)
    } catch (e) {
      logger.error(e)
      logger.error('Error updating document failed')
    }
  }

  async updateGroupSubjectByApp(newChat) {
    try {
      if (newChat[0] && newChat[0].subject) {
        let Chats = await this.getChat()
        Chats.find((c) => c.id === newChat[0].id).name = newChat[0].subject
        await this.updateDb(Chats)
      }
    } catch (e) {
      logger.error(e)
      logger.error('Error updating document failed')
    }
  }

  async updateGroupParticipantsByApp(newChat) {
    try {
      if (newChat && newChat.id) {
        let Chats = await this.getChat()
        let chat = Chats.find((c) => c.id === newChat.id)
        let is_owner = false
        if (chat) {
          if (chat.participant == undefined) {
            chat.participant = []
          }
          if (chat.participant && newChat.action == 'add') {
            for (const participant of newChat.participants) {
              chat.participant.push({
                id: participant,
                admin: null,
              })
            }
          }
          if (chat.participant && newChat.action == 'remove') {
            for (const participant of newChat.participants) {
              // remove group if they are owner
              if (chat.subjectOwner == participant) {
                is_owner = true
              }
              chat.participant = chat.participant.filter((p) => p.id != participant)
            }
          }
          if (chat.participant && newChat.action == 'demote') {
            for (const participant of newChat.participants) {
              if (chat.participant.filter((p) => p.id == participant)[0]) {
                chat.participant.filter((p) => p.id == participant)[0].admin = null
              }
            }
          }
          if (chat.participant && newChat.action == 'promote') {
            for (const participant of newChat.participants) {
              if (chat.participant.filter((p) => p.id == participant)[0]) {
                chat.participant.filter((p) => p.id == participant)[0].admin = 'superadmin'
              }
            }
          }
          if (is_owner) {
            Chats = Chats.filter((c) => c.id !== newChat.id)
          } else {
            Chats.filter((c) => c.id === newChat.id)[0] = chat
          }
          await this.updateDb(Chats)
        }
      }
    } catch (e) {
      logger.error(e)
      logger.error('Error updating document failed')
    }
  }

  async groupFetchAllParticipating() {
    try {
      const result = await this.instance.sock?.groupFetchAllParticipating()
      return result
    } catch (e) {
      logger.error('Error group fetch all participating failed')
    }
  }

  // update promote demote remove
  async groupParticipantsUpdate(id, users, action) {
    try {
      const res = await this.instance.sock?.groupParticipantsUpdate(
        this.getWhatsAppId(id),
        this.parseParticipants(users),
        action
      )
      return res
    } catch (e) {
      //console.log(e)
      return {
        error: true,
        message:
          'unable to ' +
          action +
          ' some participants, check if you are admin in group or participants exists',
      }
    }
  }

  // update group settings like
  // only allow admins to send messages
  async groupSettingUpdate(id, action) {
    try {
      const res = await this.instance.sock?.groupSettingUpdate(this.getWhatsAppId(id), action)
      return res
    } catch (e) {
      //console.log(e)
      return {
        error: true,
        message: 'unable to ' + action + ' check if you are admin in group',
      }
    }
  }

  async groupUpdateSubject(id, subject) {
    try {
      const res = await this.instance.sock?.groupUpdateSubject(this.getWhatsAppId(id), subject)
      return res
    } catch (e) {
      //console.log(e)
      return {
        error: true,
        message: 'unable to update subject check if you are admin in group',
      }
    }
  }

  async groupUpdateDescription(id, description) {
    try {
      const res = await this.instance.sock?.groupUpdateDescription(
        this.getWhatsAppId(id),
        description
      )
      return res
    } catch (e) {
      //console.log(e)
      return {
        error: true,
        message: 'unable to update description check if you are admin in group',
      }
    }
  }

  // update db document -> chat
  async updateDb(object) {
    try {
      await Chat.updateOne({ key: this.key }, { chat: object })
    } catch (e) {
      logger.error('Error updating document failed')
    }
  }

  async readMessage(msgObj) {
    try {
      const key = {
        remoteJid: msgObj.remoteJid,
        id: msgObj.id,
        participant: msgObj?.participant, // required when reading a msg from group
      }
      const res = await this.instance.sock?.readMessages([key])
      return res
    } catch (e) {
      logger.error('Error read message failed')
    }
  }

  async bulkSendTextMessage(to, message) {
    const verifyId = await this.verifyId(this.getWhatsAppId(to))
    if (!verifyId) return
    try {
      const data = await this.instance.sock.sendMessage(this.getWhatsAppId(to), { text: message })
      return data
    } catch (error) {
      console.log(error)
      return { data: 'Number not Exist' }
    }
  }

  async reactMessage(id, key, emoji) {
    try {
      const reactionMessage = {
        react: {
          text: emoji, // use an empty string to remove the reaction
          key: key,
        },
      }
      const res = await this.instance.sock?.sendMessage(this.getWhatsAppId(id), reactionMessage)
      return res
    } catch (e) {
      logger.error('Error react message failed')
    }
  }
}

exports.WhatsAppInstance = WhatsAppInstance
