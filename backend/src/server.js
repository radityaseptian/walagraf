import express from 'express'
import cors from 'cors'
import routes from './routes/index.js'
import { createServer } from 'http'
import { initSocket } from './config/socket.js'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import 'dotenv/config'

global.Whatsapp = {}
global.Telegram = {}

const { PORT, ORIGIN } = process.env

const app = express()
const server = createServer(app)

app.use(helmet())
app.use(cors({ optionsSuccessStatus: 200, origin: ORIGIN, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(routes)

initSocket(server)
server.listen(PORT, () => console.log('Running in port ' + PORT))
