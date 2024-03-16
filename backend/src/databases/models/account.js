import mongoose from '../mongodb.js'

const model = new mongoose.Schema({
  id: { type: String, require: true, unique: true },
  fromUser: { type: String, require: true },
  type: { type: String, require: true },
  name: { type: String, require: true, default: null },
  username: { type: String, require: true, default: 'unknown' },
  session: { type: String, require: true, unique: true },
  createdAt: { type: Number, require: true, default: Date.now },
  lastOnline: { type: Number, require: true, default: Date.now },
})

model.index({ fromUser: 1 })

export const Account = mongoose.model('account', model)
