const { Browsers } = require('@whiskeysockets/baileys')
const pino = require('pino')

module.exports = {
  fromUser: null,
  id: null,
  userId: null,
  clientParams: {
    logger: pino({ level: 'silent' }),
    browser: Browsers.ubuntu('Chrome'),
    printQRInTerminal: false,
    generateHighQualityLinkPreview: false,
    defaultQueryTimeoutMs: 10000,
    keepAliveIntervalMs: 60000,
    retryRequestDelayMs: 10000,
    maxMsgRetryCount: 10000,
    markOnlineOnConnect: true,
    syncFullHistory: true,
  },
}
