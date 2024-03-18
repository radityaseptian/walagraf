const mongoose = require('mongoose')
require('dotenv').config()

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO, { rejectUnauthorized: true })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

module.exports = connectToMongoDB
