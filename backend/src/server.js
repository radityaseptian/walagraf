const express = require('express')
const cors = require('cors')
const { createServer } = require('http')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
require('dotenv').config()

const routes = require('./routes')
const { initSocket } = require('./controllers/socket')
const { corsOptions, port } = require('./config/app')
const connectToMongoDB = require('./databases/mongodb')

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

connectToMongoDB()
initSocket(server)
server.listen(port, () => console.log('Running in port ' + port))
