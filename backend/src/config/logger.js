const pino = require('pino')
const fs = require('fs')
const { join } = require('path')

const logsDir = join('src/logs')
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir)

const appLogger = pino(pino.destination(join(logsDir, 'app.log')))
const socketLogger = pino(pino.destination(join(logsDir, 'socket.log')))
const telegramLogger = pino(pino.destination(join(logsDir, 'telegram.log')))
const whatsappLogger = pino(pino.destination(join(logsDir, 'whatsapp.log')))
const authLogger = pino(pino.destination(join(logsDir, 'auth.log')))

module.exports = { appLogger, socketLogger, telegramLogger, whatsappLogger, authLogger }
