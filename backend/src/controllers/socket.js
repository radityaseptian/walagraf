import 'dotenv/config'
import { Server } from 'socket.io'
import { socketLogger } from '../config/logger.js'
import { corsOptions } from '../config/app.js'
import { jwtVerify } from '../helper/jwtverify.js'

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

export { initSocket, getIo }
