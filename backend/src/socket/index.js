import 'dotenv/config'
import { Server } from 'socket.io'
import { User } from '../databases/models/index.js'
import jwt from 'jsonwebtoken'
import { socketLogger } from '../config/logger.js'
import { corsOptions } from '../config/app.js'

let io

function initSocket(server) {
  io = new Server(server, { cors: corsOptions })

  io.on('connection', async (socket) => {
    try {
      const token = socket.handshake.headers.cookie?.split('=')[1]
      if (!token) throw new Error('Token not provided')

      const { email } = jwt.verify(token, process.env.KEY)

      const user = await User.findOne({ email })

      if (!user) throw new Error('User not found')

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
