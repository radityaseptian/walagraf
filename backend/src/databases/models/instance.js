const mongoose = require('mongoose')

const model = new mongoose.Schema({
  id: { type: String, require: true, unique: true },
  userId: { type: String, require: true },
  type: { type: String, require: true },
  name: { type: String, require: true, default: null },
  username: { type: String, require: true, default: 'unknown' },
  session: { type: String, require: true, unique: true },
  createdAt: { type: Number, require: true, default: Date.now },
})

model.index({ id: 1 })

const Instance = mongoose.model('instance', model)

module.exports = Instance
