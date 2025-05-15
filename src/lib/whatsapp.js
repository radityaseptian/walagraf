console.log('whatsapp')

// random message
const messageToSend = ['test message 1', 'test message 2', 'test message 3']

const random = (data) => data[Math.floor(Math.random() * data.length)]

const whatsappClient = {
  async init() {
    window.AuthStore = {}
    window.AuthStore.AppState = window.require('WAWebSocketModel').Socket
    window.AuthStore.Cmd = window.require('WAWebCmd').Cmd
    window.AuthStore.Conn = window.require('WAWebConnModel').Conn
    window.AuthStore.OfflineMessageHandler = window.require('WAWebOfflineHandler').OfflineMessageHandler
    window.AuthStore.PairingCodeLinkUtils = window.require('WAWebAltDeviceLinkingApi')
    window.AuthStore.Base64Tools = window.require('WABase64')
    window.AuthStore.RegistrationUtils = {
      ...window.require('WAWebCompanionRegClientUtils'),
      ...window.require('WAWebAdvSignatureApi'),
      ...window.require('WAWebUserPrefsInfoStore'),
      ...window.require('WAWebSignalStoreApi'),
    }

    window.Store = Object.assign({}, window.require('WAWebCollections'))
    window.Store.AppState = window.require('WAWebSocketModel').Socket
    window.Store.BlockContact = window.require('WAWebBlockContactAction')
    window.Store.Conn = window.require('WAWebConnModel').Conn
    window.Store.Cmd = window.require('WAWebCmd').Cmd
    window.Store.DownloadManager = window.require('WAWebDownloadManager').downloadManager
    window.Store.GroupQueryAndUpdate = window.require('WAWebGroupQueryJob').queryAndUpdateGroupMetadataById
    window.Store.MediaPrep = window.require('WAWebPrepRawMedia')
    window.Store.MediaObject = window.require('WAWebMediaStorage')
    window.Store.MediaTypes = window.require('WAWebMmsMediaTypes')
    window.Store.MediaUpload = window.require('WAWebMediaMmsV4Upload')
    window.Store.MsgKey = window.require('WAWebMsgKey')
    window.Store.OpaqueData = window.require('WAWebMediaOpaqueData')
    window.Store.QueryProduct = window.require('WAWebBizProductCatalogBridge')
    window.Store.QueryOrder = window.require('WAWebBizOrderBridge')
    window.Store.SendClear = window.require('WAWebChatClearBridge')
    window.Store.SendDelete = window.require('WAWebDeleteChatAction')
    window.Store.SendMessage = window.require('WAWebSendMsgChatAction')
    window.Store.EditMessage = window.require('WAWebSendMessageEditAction')
    window.Store.SendSeen = window.require('WAWebUpdateUnreadChatAction')
    window.Store.User = window.require('WAWebUserPrefsMeUser')
    window.Store.ContactMethods = window.require('WAWebContactGetters')
    window.Store.UploadUtils = window.require('WAWebUploadManager')
    window.Store.UserConstructor = window.require('WAWebWid')
    window.Store.Validators = window.require('WALinkify')
    window.Store.VCard = window.require('WAWebFrontendVcardUtils')
    window.Store.WidFactory = window.require('WAWebWidFactory')
    window.Store.ProfilePic = window.require('WAWebContactProfilePicThumbBridge')
    window.Store.PresenceUtils = window.require('WAWebPresenceChatAction')
    window.Store.ChatState = window.require('WAWebChatStateBridge')
    window.Store.findCommonGroups = window.require('WAWebFindCommonGroupsContactAction').findCommonGroups
    window.Store.StatusUtils = window.require('WAWebContactStatusBridge')
    window.Store.ConversationMsgs = window.require('WAWebChatLoadMessages')
    window.Store.sendReactionToMsg = window.require('WAWebSendReactionMsgAction').sendReactionToMsg
    window.Store.createOrUpdateReactionsModule = window.require('WAWebDBCreateOrUpdateReactions')
    window.Store.EphemeralFields = window.require('WAWebGetEphemeralFieldsMsgActionsUtils')
    window.Store.MsgActionChecks = window.require('WAWebMsgActionCapability')
    window.Store.QuotedMsg = window.require('WAWebQuotedMsgModelUtils')
    window.Store.LinkPreview = window.require('WAWebLinkPreviewChatAction')
    window.Store.Socket = window.require('WADeprecatedSendIq')
    window.Store.SocketWap = window.require('WAWap')
    window.Store.SearchContext = window.require('WAWebChatMessageSearch').getSearchContext
    window.Store.DrawerManager = window.require('WAWebDrawerManager').DrawerManager
    window.Store.LidUtils = window.require('WAWebApiContact')
    window.Store.WidToJid = window.require('WAWebWidToJid')
    window.Store.JidToWid = window.require('WAWebJidToWid')
    window.Store.getMsgInfo = window.require('WAWebApiMessageInfoStore').queryMsgInfo
    window.Store.pinUnpinMsg = window.require('WAWebSendPinMessageAction').sendPinInChatMsg
    window.Store.QueryExist = window.require('WAWebQueryExistsJob').queryWidExists
    window.Store.ReplyUtils = window.require('WAWebMsgReply')
    window.Store.Settings = window.require('WAWebUserPrefsGeneral')
    window.Store.BotSecret = window.require('WAWebBotMessageSecret')
    window.Store.BotProfiles = window.require('WAWebBotProfileCollection')
    window.Store.DeviceList = window.require('WAWebApiDeviceList')
    window.Store.HistorySync = window.require('WAWebSendNonMessageDataRequest')

    window.Store.NumberInfo = {
      ...window.require('WAPhoneUtils'),
      ...window.require('WAPhoneFindCC'),
    }

    window.Store.ForwardUtils = {
      ...window.require('WAWebForwardMessagesToChat'),
    }

    window.Store.StickerTools = {
      ...window.require('WAWebImageUtils'),
      ...window.require('WAWebAddWebpMetadata'),
    }
    window.Store.GroupUtils = {
      ...window.require('WAWebGroupCreateJob'),
      ...window.require('WAWebGroupModifyInfoJob'),
      ...window.require('WAWebExitGroupAction'),
      ...window.require('WAWebContactProfilePicThumbBridge'),
    }
    window.Store.GroupParticipants = {
      ...window.require('WAWebModifyParticipantsGroupAction'),
      ...window.require('WASmaxGroupsAddParticipantsRPC'),
    }
    window.Store.GroupInvite = {
      ...window.require('WAWebGroupInviteJob'),
      ...window.require('WAWebGroupQueryJob'),
      ...window.require('WAWebMexFetchGroupInviteCodeJob'),
    }
    window.Store.GroupInviteV4 = {
      ...window.require('WAWebGroupInviteV4Job'),
      ...window.require('WAWebChatSendMessages'),
    }
    window.Store.MembershipRequestUtils = {
      ...window.require('WAWebApiMembershipApprovalRequestStore'),
      ...window.require('WASmaxGroupsMembershipRequestsActionRPC'),
    }

    window.WWebJS = {}

    window.WWebJS.forwardMessage = async (chatId, msgId) => {
      const msg = window.Store.Msg.get(msgId) || (await window.Store.Msg.getMessagesById([msgId]))?.messages?.[0]
      let chat = window.Store.Chat.get(chatId)

      if (window.compareWwebVersions(window.Debug.VERSION, '>', '2.3000.0')) {
        return window.Store.ForwardUtils.forwardMessagesToChats([msg], [chat], false)
      } else {
        return chat.forwardMessages([msg])
      }
    }

    window.WWebJS.sendSeen = async (chatId) => {
      let chat = window.Store.Chat.get(chatId)
      if (chat !== undefined) {
        await window.Store.SendSeen.sendSeen(chat, false)
        return true
      }
      return false
    }

    window.WWebJS.sendMessage = async (chat, content, options = {}) => {
      let attOptions = {}
      if (options.attachment) {
        attOptions = options.sendMediaAsSticker
          ? await window.WWebJS.processStickerData(options.attachment)
          : await window.WWebJS.processMediaData(options.attachment, {
              forceVoice: options.sendAudioAsVoice,
              forceDocument: options.sendMediaAsDocument,
              forceGif: options.sendVideoAsGif,
            })

        attOptions.caption = options.caption
        content = options.sendMediaAsSticker ? undefined : attOptions.preview
        attOptions.isViewOnce = options.isViewOnce

        delete options.attachment
        delete options.sendMediaAsSticker
      }
      let quotedMsgOptions = {}
      if (options.quotedMessageId) {
        let quotedMessage = await window.Store.Msg.getMessagesById([options.quotedMessageId])

        if (quotedMessage['messages'].length == 1) {
          quotedMessage = quotedMessage['messages'][0]

          // TODO remove .canReply() once all clients are updated to >= v2.2241.6
          const canReply = window.Store.ReplyUtils
            ? window.Store.ReplyUtils.canReplyMsg(quotedMessage.unsafe())
            : quotedMessage.canReply()

          if (canReply) {
            quotedMsgOptions = quotedMessage.msgContextInfo(chat)
          }
        } else {
          if (!options.ignoreQuoteErrors) {
            throw new Error('Could not get the quoted message.')
          }
        }

        delete options.ignoreQuoteErrors
        delete options.quotedMessageId
      }

      if (options.mentionedJidList) {
        options.mentionedJidList = await Promise.all(
          options.mentionedJidList.map(async (id) => {
            const wid = window.Store.WidFactory.createWid(id)
            if (await window.Store.QueryExist(wid)) {
              return wid
            }
          })
        )
        options.mentionedJidList = options.mentionedJidList.filter(Boolean)
      }

      if (options.groupMentions) {
        options.groupMentions = options.groupMentions.map((e) => ({
          groupSubject: e.subject,
          groupJid: window.Store.WidFactory.createWid(e.id),
        }))
      }

      let locationOptions = {}
      if (options.location) {
        let { latitude, longitude, description, url } = options.location
        url = window.Store.Validators.findLink(url)?.href
        url && !description && (description = url)
        locationOptions = {
          type: 'location',
          loc: description,
          lat: latitude,
          lng: longitude,
          clientUrl: url,
        }
        delete options.location
      }

      let _pollOptions = {}
      if (options.poll) {
        const { pollName, pollOptions } = options.poll
        const { allowMultipleAnswers, messageSecret } = options.poll.options
        _pollOptions = {
          type: 'poll_creation',
          pollName: pollName,
          pollOptions: pollOptions,
          pollSelectableOptionsCount: allowMultipleAnswers ? 0 : 1,
          messageSecret:
            Array.isArray(messageSecret) && messageSecret.length === 32
              ? new Uint8Array(messageSecret)
              : window.crypto.getRandomValues(new Uint8Array(32)),
        }
        delete options.poll
      }

      let vcardOptions = {}
      if (options.contactCard) {
        let contact = window.Store.Contact.get(options.contactCard)
        vcardOptions = {
          body: window.Store.VCard.vcardFromContactModel(contact).vcard,
          type: 'vcard',
          vcardFormattedName: contact.formattedName,
        }
        delete options.contactCard
      } else if (options.contactCardList) {
        let contacts = options.contactCardList.map((c) => window.Store.Contact.get(c))
        let vcards = contacts.map((c) => window.Store.VCard.vcardFromContactModel(c))
        vcardOptions = {
          type: 'multi_vcard',
          vcardList: vcards,
          body: undefined,
        }
        delete options.contactCardList
      } else if (options.parseVCards && typeof content === 'string' && content.startsWith('BEGIN:VCARD')) {
        delete options.parseVCards
        try {
          const parsed = window.Store.VCard.parseVcard(content)
          if (parsed) {
            vcardOptions = {
              type: 'vcard',
              vcardFormattedName: window.Store.VCard.vcardGetNameFromParsed(parsed),
            }
          }
        } catch (_) {
          // not a vcard
        }
      }

      if (options.linkPreview) {
        delete options.linkPreview
        const link = window.Store.Validators.findLink(content)
        if (link) {
          let preview = await window.Store.LinkPreview.getLinkPreview(link)
          if (preview && preview.data) {
            preview = preview.data
            preview.preview = true
            preview.subtype = 'url'
            options = { ...options, ...preview }
          }
        }
      }

      let buttonOptions = {}
      if (options.buttons) {
        let caption
        if (options.buttons.type === 'chat') {
          content = options.buttons.body
          caption = content
        } else {
          caption = options.caption ? options.caption : ' ' //Caption can't be empty
        }
        buttonOptions = {
          productHeaderImageRejected: false,
          isFromTemplate: false,
          isDynamicReplyButtonsMsg: true,
          title: options.buttons.title ? options.buttons.title : undefined,
          footer: options.buttons.footer ? options.buttons.footer : undefined,
          dynamicReplyButtons: options.buttons.buttons,
          replyButtons: options.buttons.buttons,
          caption: caption,
        }
        delete options.buttons
      }

      let listOptions = {}
      if (options.list) {
        if (window.Store.Conn.platform === 'smba' || window.Store.Conn.platform === 'smbi') {
          throw "[LT01] Whatsapp business can't send this yet"
        }
        listOptions = {
          type: 'list',
          footer: options.list.footer,
          list: {
            ...options.list,
            listType: 1,
          },
          body: options.list.description,
        }
        delete options.list
        delete listOptions.list.footer
      }

      const botOptions = {}
      if (options.invokedBotWid) {
        botOptions.messageSecret = window.crypto.getRandomValues(new Uint8Array(32))
        botOptions.botMessageSecret = await window.Store.BotSecret.genBotMsgSecretFromMsgSecret(
          botOptions.messageSecret
        )
        botOptions.invokedBotWid = window.Store.WidFactory.createWid(options.invokedBotWid)
        botOptions.botPersonaId = window.Store.BotProfiles.BotProfileCollection.get(options.invokedBotWid).personaId
        delete options.invokedBotWid
      }

      const meUser = window.Store.User.getMaybeMeUser()
      const newId = await window.Store.MsgKey.newId()

      const newMsgId = new window.Store.MsgKey({
        from: meUser,
        to: chat.id,
        id: newId,
        participant: chat.id.isGroup() ? meUser : undefined,
        selfDir: 'out',
      })

      const extraOptions = options.extraOptions || {}
      delete options.extraOptions

      const ephemeralFields = window.Store.EphemeralFields.getEphemeralFields(chat)

      const message = {
        ...options,
        id: newMsgId,
        ack: 0,
        body: content,
        from: meUser,
        to: chat.id,
        local: true,
        self: 'out',
        t: parseInt(new Date().getTime() / 1000),
        isNewMsg: true,
        type: 'chat',
        ...ephemeralFields,
        ...locationOptions,
        ..._pollOptions,
        ...attOptions,
        ...(attOptions.toJSON ? attOptions.toJSON() : {}),
        ...quotedMsgOptions,
        ...vcardOptions,
        ...buttonOptions,
        ...listOptions,
        ...botOptions,
        ...extraOptions,
      }

      // Bot's won't reply if canonicalUrl is set (linking)
      if (botOptions) {
        delete message.canonicalUrl
      }

      await window.Store.SendMessage.addAndSendMsgToChat(chat, message)
      return window.Store.Msg.get(newMsgId._serialized)
    }

    window.WWebJS.editMessage = async (msg, content, options = {}) => {
      const extraOptions = options.extraOptions || {}
      delete options.extraOptions

      if (options.mentionedJidList) {
        options.mentionedJidList = await Promise.all(
          options.mentionedJidList.map(async (id) => {
            const wid = window.Store.WidFactory.createWid(id)
            if (await window.Store.QueryExist(wid)) {
              return wid
            }
          })
        )
        options.mentionedJidList = options.mentionedJidList.filter(Boolean)
      }

      if (options.groupMentions) {
        options.groupMentions = options.groupMentions.map((e) => ({
          groupSubject: e.subject,
          groupJid: window.Store.WidFactory.createWid(e.id),
        }))
      }

      if (options.linkPreview) {
        delete options.linkPreview
        const link = window.Store.Validators.findLink(content)
        if (link) {
          const preview = await window.Store.LinkPreview.getLinkPreview(link)
          preview.preview = true
          preview.subtype = 'url'
          options = { ...options, ...preview }
        }
      }

      const internalOptions = {
        ...options,
        ...extraOptions,
      }

      await window.Store.EditMessage.sendMessageEdit(msg, content, internalOptions)
      return window.Store.Msg.get(msg.id._serialized)
    }

    window.WWebJS.toStickerData = async (mediaInfo) => {
      if (mediaInfo.mimetype == 'image/webp') return mediaInfo

      const file = window.WWebJS.mediaInfoToFile(mediaInfo)
      const webpSticker = await window.Store.StickerTools.toWebpSticker(file)
      const webpBuffer = await webpSticker.arrayBuffer()
      const data = window.WWebJS.arrayBufferToBase64(webpBuffer)

      return {
        mimetype: 'image/webp',
        data,
      }
    }

    window.WWebJS.processStickerData = async (mediaInfo) => {
      if (mediaInfo.mimetype !== 'image/webp') throw new Error('Invalid media type')

      const file = window.WWebJS.mediaInfoToFile(mediaInfo)
      let filehash = await window.WWebJS.getFileHash(file)
      let mediaKey = await window.WWebJS.generateHash(32)

      const controller = new AbortController()
      const uploadedInfo = await window.Store.UploadUtils.encryptAndUpload({
        blob: file,
        type: 'sticker',
        signal: controller.signal,
        mediaKey,
      })

      const stickerInfo = {
        ...uploadedInfo,
        clientUrl: uploadedInfo.url,
        deprecatedMms3Url: uploadedInfo.url,
        uploadhash: uploadedInfo.encFilehash,
        size: file.size,
        type: 'sticker',
        filehash,
      }

      return stickerInfo
    }

    window.WWebJS.processMediaData = async (mediaInfo, { forceVoice, forceDocument, forceGif }) => {
      const file = window.WWebJS.mediaInfoToFile(mediaInfo)
      const mData = await window.Store.OpaqueData.createFromData(file, file.type)
      const mediaPrep = window.Store.MediaPrep.prepRawMedia(mData, { asDocument: forceDocument })
      const mediaData = await mediaPrep.waitForPrep()
      const mediaObject = window.Store.MediaObject.getOrCreateMediaObject(mediaData.filehash)

      const mediaType = window.Store.MediaTypes.msgToMediaType({
        type: mediaData.type,
        isGif: mediaData.isGif,
      })

      if (forceVoice && mediaData.type === 'audio') {
        mediaData.type = 'ptt'
        const waveform = mediaObject.contentInfo.waveform
        mediaData.waveform = waveform ?? (await window.WWebJS.generateWaveform(file))
      }

      if (forceGif && mediaData.type === 'video') {
        mediaData.isGif = true
      }

      if (forceDocument) {
        mediaData.type = 'document'
      }

      if (!(mediaData.mediaBlob instanceof window.Store.OpaqueData)) {
        mediaData.mediaBlob = await window.Store.OpaqueData.createFromData(
          mediaData.mediaBlob,
          mediaData.mediaBlob.type
        )
      }

      mediaData.renderableUrl = mediaData.mediaBlob.url()
      mediaObject.consolidate(mediaData.toJSON())
      mediaData.mediaBlob.autorelease()

      const uploadedMedia = await window.Store.MediaUpload.uploadMedia({
        mimetype: mediaData.mimetype,
        mediaObject,
        mediaType,
      })

      const mediaEntry = uploadedMedia.mediaEntry
      if (!mediaEntry) {
        throw new Error('upload failed: media entry was not created')
      }

      mediaData.set({
        clientUrl: mediaEntry.mmsUrl,
        deprecatedMms3Url: mediaEntry.deprecatedMms3Url,
        directPath: mediaEntry.directPath,
        mediaKey: mediaEntry.mediaKey,
        mediaKeyTimestamp: mediaEntry.mediaKeyTimestamp,
        filehash: mediaObject.filehash,
        encFilehash: mediaEntry.encFilehash,
        uploadhash: mediaEntry.uploadHash,
        size: mediaObject.size,
        streamingSidecar: mediaEntry.sidecar,
        firstFrameSidecar: mediaEntry.firstFrameSidecar,
      })

      return mediaData
    }

    window.WWebJS.getMessageModel = (message) => {
      const msg = message.serialize()

      msg.isEphemeral = message.isEphemeral
      msg.isStatusV3 = message.isStatusV3
      msg.links = window.Store.Validators.findLinks(message.mediaObject ? message.caption : message.body).map(
        (link) => ({
          link: link.href,
          isSuspicious: Boolean(link.suspiciousCharacters && link.suspiciousCharacters.size),
        })
      )

      if (msg.buttons) {
        msg.buttons = msg.buttons.serialize()
      }
      if (msg.dynamicReplyButtons) {
        msg.dynamicReplyButtons = JSON.parse(JSON.stringify(msg.dynamicReplyButtons))
      }
      if (msg.replyButtons) {
        msg.replyButtons = JSON.parse(JSON.stringify(msg.replyButtons))
      }

      if (typeof msg.id.remote === 'object') {
        msg.id = Object.assign({}, msg.id, { remote: msg.id.remote._serialized })
      }

      delete msg.pendingAckUpdate

      return msg
    }

    window.WWebJS.getPollVoteModel = async (vote) => {
      const _vote = vote.serialize()
      if (!vote.parentMsgKey) return null
      const msg =
        window.Store.Msg.get(vote.parentMsgKey) ||
        (await window.Store.Msg.getMessagesById([vote.parentMsgKey]))?.messages?.[0]
      msg && (_vote.parentMessage = window.WWebJS.getMessageModel(msg))
      return _vote
    }

    window.WWebJS.getChatModel = async (chat) => {
      let res = chat.serialize()
      res.isGroup = false
      res.formattedTitle = chat.formattedTitle
      res.isMuted = chat.muteExpiration == 0 ? false : true

      if (chat.groupMetadata) {
        res.isGroup = true
        const chatWid = window.Store.WidFactory.createWid(chat.id._serialized)
        await window.Store.GroupMetadata.update(chatWid)
        res.groupMetadata = chat.groupMetadata.serialize()
      }

      res.lastMessage = null
      if (res.msgs && res.msgs.length) {
        const lastMessage = chat.lastReceivedKey
          ? window.Store.Msg.get(chat.lastReceivedKey._serialized) ||
            (await window.Store.Msg.getMessagesById([chat.lastReceivedKey._serialized]))?.messages?.[0]
          : null
        if (lastMessage) {
          res.lastMessage = window.WWebJS.getMessageModel(lastMessage)
        }
      }

      delete res.msgs
      delete res.msgUnsyncedButtonReplyMsgs
      delete res.unsyncedButtonReplies

      return res
    }

    window.WWebJS.getChat = async (chatId) => {
      const chatWid = window.Store.WidFactory.createWid(chatId)
      const chat = await window.Store.Chat.find(chatWid)
      return await window.WWebJS.getChatModel(chat)
    }

    window.WWebJS.getChats = async () => {
      const chats = window.Store.Chat.getModelsArray()

      const chatPromises = chats.map((chat) => window.WWebJS.getChatModel(chat))
      return await Promise.all(chatPromises)
    }

    window.WWebJS.getContactModel = (contact) => {
      let res = contact.serialize()
      res.isBusiness = contact.isBusiness === undefined ? false : contact.isBusiness

      if (contact.businessProfile) {
        res.businessProfile = contact.businessProfile.serialize()
      }

      // TODO: remove useOldImplementation and its checks once all clients are updated to >= v2.2327.4
      const useOldImplementation = window.compareWwebVersions(window.Debug.VERSION, '<', '2.2327.4')

      res.isMe = useOldImplementation ? contact.isMe : window.Store.ContactMethods.getIsMe(contact)
      res.isUser = useOldImplementation ? contact.isUser : window.Store.ContactMethods.getIsUser(contact)
      res.isGroup = useOldImplementation ? contact.isGroup : window.Store.ContactMethods.getIsGroup(contact)
      res.isWAContact = useOldImplementation ? contact.isWAContact : window.Store.ContactMethods.getIsWAContact(contact)
      res.isMyContact = useOldImplementation ? contact.isMyContact : window.Store.ContactMethods.getIsMyContact(contact)
      res.isBlocked = contact.isContactBlocked
      res.userid = useOldImplementation ? contact.userid : window.Store.ContactMethods.getUserid(contact)
      res.isEnterprise = useOldImplementation
        ? contact.isEnterprise
        : window.Store.ContactMethods.getIsEnterprise(contact)
      res.verifiedName = useOldImplementation
        ? contact.verifiedName
        : window.Store.ContactMethods.getVerifiedName(contact)
      res.verifiedLevel = useOldImplementation
        ? contact.verifiedLevel
        : window.Store.ContactMethods.getVerifiedLevel(contact)
      res.statusMute = useOldImplementation ? contact.statusMute : window.Store.ContactMethods.getStatusMute(contact)
      res.name = useOldImplementation ? contact.name : window.Store.ContactMethods.getName(contact)
      res.shortName = useOldImplementation ? contact.shortName : window.Store.ContactMethods.getShortName(contact)
      res.pushname = useOldImplementation ? contact.pushname : window.Store.ContactMethods.getPushname(contact)

      return res
    }

    window.WWebJS.getContact = async (contactId) => {
      const wid = window.Store.WidFactory.createWid(contactId)
      const contact = await window.Store.Contact.find(wid)
      const bizProfile = await window.Store.BusinessProfile.fetchBizProfile(wid)
      bizProfile.profileOptions && (contact.businessProfile = bizProfile)
      return window.WWebJS.getContactModel(contact)
    }

    window.WWebJS.getContacts = () => {
      const contacts = window.Store.Contact.getModelsArray()
      return contacts.map((contact) => window.WWebJS.getContactModel(contact))
    }

    window.WWebJS.mediaInfoToFile = ({ data, mimetype, filename }) => {
      const binaryData = window.atob(data)

      const buffer = new ArrayBuffer(binaryData.length)
      const view = new Uint8Array(buffer)
      for (let i = 0; i < binaryData.length; i++) {
        view[i] = binaryData.charCodeAt(i)
      }

      const blob = new Blob([buffer], { type: mimetype })
      return new File([blob], filename, {
        type: mimetype,
        lastModified: Date.now(),
      })
    }

    window.WWebJS.arrayBufferToBase64 = (arrayBuffer) => {
      let binary = ''
      const bytes = new Uint8Array(arrayBuffer)
      const len = bytes.byteLength
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      return window.btoa(binary)
    }

    window.WWebJS.arrayBufferToBase64Async = (arrayBuffer) =>
      new Promise((resolve, reject) => {
        const blob = new Blob([arrayBuffer], {
          type: 'application/octet-stream',
        })
        const fileReader = new FileReader()
        fileReader.onload = () => {
          const [, data] = fileReader.result.split(',')
          resolve(data)
        }
        fileReader.onerror = (e) => reject(e)
        fileReader.readAsDataURL(blob)
      })

    window.WWebJS.getFileHash = async (data) => {
      let buffer = await data.arrayBuffer()
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
      return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))
    }

    window.WWebJS.generateHash = async (length) => {
      var result = ''
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      var charactersLength = characters.length
      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result
    }

    /**
     * Referenced from and modified:
     * @see https://github.com/wppconnect-team/wa-js/commit/290ebfefe6021b3d17f7fdfdda5545bb0473b26f
     */
    window.WWebJS.generateWaveform = async (audioFile) => {
      try {
        const audioData = await audioFile.arrayBuffer()
        const audioContext = new AudioContext()
        const audioBuffer = await audioContext.decodeAudioData(audioData)

        const rawData = audioBuffer.getChannelData(0)
        const samples = 64
        const blockSize = Math.floor(rawData.length / samples)
        const filteredData = []
        for (let i = 0; i < samples; i++) {
          const blockStart = blockSize * i
          let sum = 0
          for (let j = 0; j < blockSize; j++) {
            sum = sum + Math.abs(rawData[blockStart + j])
          }
          filteredData.push(sum / blockSize)
        }

        const multiplier = Math.pow(Math.max(...filteredData), -1)
        const normalizedData = filteredData.map((n) => n * multiplier)

        const waveform = new Uint8Array(normalizedData.map((n) => Math.floor(100 * n)))

        return waveform
      } catch (e) {
        return undefined
      }
    }

    window.WWebJS.sendClearChat = async (chatId) => {
      let chat = window.Store.Chat.get(chatId)
      if (chat !== undefined) {
        await window.Store.SendClear.sendClear(chat, false)
        return true
      }
      return false
    }

    window.WWebJS.sendDeleteChat = async (chatId) => {
      let chat = window.Store.Chat.get(chatId)
      if (chat !== undefined) {
        await window.Store.SendDelete.sendDelete(chat)
        return true
      }
      return false
    }

    window.WWebJS.sendChatstate = async (state, chatId) => {
      chatId = window.Store.WidFactory.createWid(chatId)

      switch (state) {
        case 'typing':
          await window.Store.ChatState.sendChatStateComposing(chatId)
          break
        case 'recording':
          await window.Store.ChatState.sendChatStateRecording(chatId)
          break
        case 'stop':
          await window.Store.ChatState.sendChatStatePaused(chatId)
          break
        default:
          throw 'Invalid chatstate'
      }

      return true
    }

    window.WWebJS.getLabelModel = (label) => {
      let res = label.serialize()
      res.hexColor = label.hexColor

      return res
    }

    window.WWebJS.getLabels = () => {
      const labels = window.Store.Label.getModelsArray()
      return labels.map((label) => window.WWebJS.getLabelModel(label))
    }

    window.WWebJS.getLabel = (labelId) => {
      const label = window.Store.Label.get(labelId)
      return window.WWebJS.getLabelModel(label)
    }

    window.WWebJS.getChatLabels = async (chatId) => {
      const chat = await window.WWebJS.getChat(chatId)
      return (chat.labels || []).map((id) => window.WWebJS.getLabel(id))
    }

    window.WWebJS.getOrderDetail = async (orderId, token, chatId) => {
      const chatWid = window.Store.WidFactory.createWid(chatId)
      return window.Store.QueryOrder.queryOrder(chatWid, orderId, 80, 80, token)
    }

    window.WWebJS.getProductMetadata = async (productId) => {
      let sellerId = window.Store.Conn.wid
      let product = await window.Store.QueryProduct.queryProduct(sellerId, productId)
      if (product && product.data) {
        return product.data
      }

      return undefined
    }

    window.WWebJS.rejectCall = async (peerJid, id) => {
      peerJid = peerJid.split('@')[0] + '@s.whatsapp.net'
      let userId = window.Store.User.getMaybeMeUser().user + '@s.whatsapp.net'
      const stanza = window.Store.SocketWap.wap(
        'call',
        {
          id: window.Store.SocketWap.generateId(),
          from: window.Store.SocketWap.USER_JID(userId),
          to: window.Store.SocketWap.USER_JID(peerJid),
        },
        [
          window.Store.SocketWap.wap('reject', {
            'call-id': id,
            'call-creator': window.Store.SocketWap.USER_JID(peerJid),
            count: '0',
          }),
        ]
      )
      await window.Store.Socket.deprecatedCastStanza(stanza)
    }

    window.WWebJS.cropAndResizeImage = async (media, options = {}) => {
      if (!media.mimetype.includes('image')) throw new Error('Media is not an image')

      if (options.mimetype && !options.mimetype.includes('image')) delete options.mimetype

      options = Object.assign({ size: 640, mimetype: media.mimetype, quality: 0.75, asDataUrl: false }, options)

      const img = await new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = `data:${media.mimetype};base64,${media.data}`
      })

      const sl = Math.min(img.width, img.height)
      const sx = Math.floor((img.width - sl) / 2)
      const sy = Math.floor((img.height - sl) / 2)

      const canvas = document.createElement('canvas')
      canvas.width = options.size
      canvas.height = options.size

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, sx, sy, sl, sl, 0, 0, options.size, options.size)

      const dataUrl = canvas.toDataURL(options.mimetype, options.quality)

      if (options.asDataUrl) return dataUrl

      return Object.assign(media, {
        mimetype: options.mimeType,
        data: dataUrl.replace(`data:${options.mimeType};base64,`, ''),
      })
    }

    window.WWebJS.setPicture = async (chatid, media) => {
      const thumbnail = await window.WWebJS.cropAndResizeImage(media, {
        asDataUrl: true,
        mimetype: 'image/jpeg',
        size: 96,
      })
      const profilePic = await window.WWebJS.cropAndResizeImage(media, {
        asDataUrl: true,
        mimetype: 'image/jpeg',
        size: 640,
      })

      const chatWid = window.Store.WidFactory.createWid(chatid)
      try {
        const collection = window.Store.ProfilePicThumb.get(chatid)
        if (!collection.canSet()) return

        const res = await window.Store.GroupUtils.sendSetPicture(chatWid, thumbnail, profilePic)
        return res ? res.status === 200 : false
      } catch (err) {
        if (err.name === 'ServerStatusCodeError') return false
        throw err
      }
    }

    window.WWebJS.deletePicture = async (chatid) => {
      const chatWid = window.Store.WidFactory.createWid(chatid)
      try {
        const collection = window.Store.ProfilePicThumb.get(chatid)
        if (!collection.canDelete()) return

        const res = await window.Store.GroupUtils.requestDeletePicture(chatWid)
        return res ? res.status === 200 : false
      } catch (err) {
        if (err.name === 'ServerStatusCodeError') return false
        throw err
      }
    }

    window.WWebJS.getProfilePicThumbToBase64 = async (chatWid) => {
      const profilePicCollection = await window.Store.ProfilePicThumb.find(chatWid)

      const _readImageAsBase64 = (imageBlob) => {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = function() {
            const base64Image = reader.result
            if (base64Image == null) {
              resolve(undefined)
            } else {
              const base64Data = base64Image.toString().split(',')[1]
              resolve(base64Data)
            }
          }
          reader.readAsDataURL(imageBlob)
        })
      }

      if (profilePicCollection?.img) {
        try {
          const response = await fetch(profilePicCollection.img)
          if (response.ok) {
            const imageBlob = await response.blob()
            if (imageBlob) {
              const base64Image = await _readImageAsBase64(imageBlob)
              return base64Image
            }
          }
        } catch (error) {
          /* empty */
        }
      }
      return undefined
    }

    window.WWebJS.getAddParticipantsRpcResult = async (groupMetadata, groupWid, participantWid) => {
      const participantLidArgs = groupMetadata?.isLidAddressingMode
        ? {
            phoneNumber: participantWid,
            lid: window.Store.LidUtils.getCurrentLid(participantWid),
          }
        : { phoneNumber: participantWid }

      const iqTo = window.Store.WidToJid.widToGroupJid(groupWid)

      const participantArgs = participantLidArgs.lid
        ? [
            {
              participantJid: window.Store.WidToJid.widToUserJid(participantLidArgs.lid),
              phoneNumberMixinArgs: {
                anyPhoneNumber: window.Store.WidToJid.widToUserJid(participantLidArgs.phoneNumber),
              },
            },
          ]
        : [
            {
              participantJid: window.Store.WidToJid.widToUserJid(participantLidArgs.phoneNumber),
            },
          ]

      let rpcResult, resultArgs
      const isOldImpl = window.compareWwebVersions(window.Debug.VERSION, '<=', '2.2335.9')
      const data = {
        name: undefined,
        code: undefined,
        inviteV4Code: undefined,
        inviteV4CodeExp: undefined,
      }

      try {
        rpcResult = await window.Store.GroupParticipants.sendAddParticipantsRPC({ participantArgs, iqTo })
        resultArgs = isOldImpl
          ? rpcResult.value.addParticipant[0].addParticipantsParticipantMixins
          : rpcResult.value.addParticipant[0]
              .addParticipantsParticipantAddedOrNonRegisteredWaUserParticipantErrorLidResponseMixinGroup.value
              .addParticipantsParticipantMixins
      } catch (err) {
        data.code = 400
        return data
      }

      if (rpcResult.name === 'AddParticipantsResponseSuccess') {
        const code = resultArgs?.value.error ?? '200'
        data.name = resultArgs?.name
        data.code = +code
        data.inviteV4Code = resultArgs?.value.addRequestCode
        data.inviteV4CodeExp = resultArgs?.value.addRequestExpiration?.toString()
      } else if (rpcResult.name === 'AddParticipantsResponseClientError') {
        const { code: code } = rpcResult.value.errorAddParticipantsClientErrors.value
        data.code = +code
      } else if (rpcResult.name === 'AddParticipantsResponseServerError') {
        const { code: code } = rpcResult.value.errorServerErrors.value
        data.code = +code
      }

      return data
    }
  },

  async sendMessage(chatId, content, sendSeen = true) {
    const chatWid = window.Store.WidFactory.createWid(chatId)
    const chat = await window.Store.Chat.find(chatWid)

    if (sendSeen) {
      await window.WWebJS.sendSeen(chatId)
    }

    const msg = await window.WWebJS.sendMessage(chat, content, {}, sendSeen)
    const newMessage = window.WWebJS.getMessageModel(msg)

    return newMessage
  },

  /**
   * Get all current chat instances
   * @returns {Promise<Array<Chat>>}
   */
  async getChats() {
    const chats = await window.WWebJS.getChats()
    return chats
  },

  async sendSeen(chatId) {
    return await window.WWebJS.sendSeen(chatId)
  },
}

whatsappClient.init()

window.addEventListener('message', async (event) => {
  if (event.source !== window) return
  if (event.data.action !== 'sendMessage') return

  if (window.AuthStore.AppState.state !== 'CONNECTED') return

  const groups = (await whatsappClient.getChats()).filter((chat) => chat.isGroup)

  if (!groups.length) return

  const group = random(groups).groupMetadata

  const text = random(messageToSend)

  const date = Date.now() / 1000

  const payload = {
    text,
    date,
    success: true,
    type: 'whatsapp',
    userId: window.Store.User.getMe().user,
    group: {
      id: group.id._serialized,
      title: group.subject,
    },
  }

  try {
    await whatsappClient.sendMessage(group.id._serialized, text)
  } catch (error) {
    payload.success = false
    payload.error = error?.stack || error?.message || String(error)
  } finally {
    window.postMessage({ action: 'payload', data: payload }, '*')
    console.log(group, payload)
  }
})
