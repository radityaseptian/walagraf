const mongoose = require('mongoose')

const model = new mongoose.Schema({
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  createdAt: { type: Number, require: true, default: Date.now },
  updatedAt: { type: Number, require: true, default: Date.now },
  instances: { type: Array, require: true, default: [] },
})

model.index({ email: 1 })

const User = mongoose.model('user', model)

module.exports = User
