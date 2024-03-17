import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import 'dotenv/config'

import routes from './routes/index.js'
import { initSocket } from './socket/index.js'
import { corsOptions, port } from './config/app.js'

global.Whatsapps = {}
global.Telegrams = {}

const app = express()
const server = createServer(app)

app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(routes)

initSocket(server)
server.listen(port, () => console.log('Running in port ' + port))
