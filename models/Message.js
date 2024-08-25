const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  file: { type: String },
}, { timestamps: true });

const ChatSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [MessageSchema],
}, { timestamps: true });

module.exports = mongoose.model('Chat', ChatSchema);
