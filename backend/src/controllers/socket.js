const { Server } = require('socket.io')
const { socketLogger } = require('../config/logger.js')
const { corsOptions } = require('../config/app.js')
const { jwtVerify } = require('../helper/jwtverify.js')
require('dotenv').config()

let io

async function initSocket(server) {
  io = new Server(server, { cors: corsOptions })

  io.on('connection', async (socket) => {
    try {
      const user = await jwtVerify(socket.handshake.headers.cookie?.split('=')[1])
      if (!user) throw new Error('Token not valid')

      socketLogger.info('Connected:' + user.email)

      socket.on('disconnect', () => socketLogger.info('Disconnected:', user.email))
    } catch (error) {
      socketLogger.error('Authentication failed:', error.message)
      socket.disconnect(true)
    }
  })
}

const getIo = () => io

module.exports = { initSocket, getIo }
