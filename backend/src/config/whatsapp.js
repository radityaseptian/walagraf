import { Browsers } from '@whiskeysockets/baileys'
import logger from 'pino'

export const config = {
  fromUser: null,
  id: null,
  userId: null,
  clientParams: {
    defaultQueryTimeoutMs: undefined,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }),
    browser: Browsers.ubuntu('Chrome'),
    generateHighQualityLinkPreview: true,
    receivedPendingNotifications: true,
  },
}
