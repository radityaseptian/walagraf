import 'dotenv/config'
import { Server } from 'socket.io'
import { Admin } from './databases/models/index.js'
import jwt from 'jsonwebtoken'

const { ORIGIN, JWTKEY } = process.env
let io

function initSocket(server) {
  io = new Server(server, {
    cors: { optionsSuccessStatus: 200, origin: ORIGIN, credentials: true },
  })

  io.on('connection', async (socket) => {
    try {
      const token = socket.handshake.headers.cookie?.split('=')[1]
      if (!token) {
        console.error(date + 'Authentication failed: Token not provided')
        return socket.disconnect(true)
      }
      const verify = jwt.verify(token, JWTKEY)
      const admin = await Admin.findOne({ username: verify?.username })
      if (!admin) {
        console.error(date + 'Authentication failed: Admin not found')
        return socket.disconnect(true)
      }
      console.info(date + 'Connected:', admin.username)

      socket.on('disconnect', () =>
        console.log(date + 'Disconnected:', admin.username)
      )
    } catch (error) {
      console.error(date + 'Authentication failed:', error.message)
      socket.disconnect(true)
    }
  })
}

const getIo = () => io

export { initSocket, getIo }
