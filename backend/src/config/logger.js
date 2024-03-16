import pino from 'pino'
import fs from 'fs'

const logsDir = '../logs'
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir)

const folder = '../logs/'
const options = { prettyPrint: true }

const appLogger = pino(options, pino.destination(folder + 'app.log'))
const telegramLogger = pino(options, pino.destination(folder + 'telegram.log'))
const whatsappLogger = pino(options, pino.destination(folder + 'whatsapp.log'))
const authLogger = pino(options, pino.destination(folder + 'auth.log'))

export { appLogger, telegramLogger, whatsappLogger, authLogger }
