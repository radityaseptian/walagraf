import 'dotenv/config'

const { ORIGIN, PORT } = process.env
const port = PORT || 3000
const corsOptions = { optionsSuccessStatus: 200, origin: ORIGIN, credentials: true }

export { port, corsOptions }
