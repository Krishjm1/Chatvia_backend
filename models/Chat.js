const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  type: { type: String, enum: ['incoming', 'outgoing'], required: true },
}, { timestamps: true });

const ChatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [MessageSchema],
}, { timestamps: true });

module.exports = mongoose.model('Chat', ChatSchema);