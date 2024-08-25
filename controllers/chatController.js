const mongoose = require('mongoose');
const Chat = require('../models/Chat');
const User = require('../models/User');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

exports.storeMessage = async (req, res) => {
  console.log("-------------------===========", req.body);
  const { sender, receiver, message } = req.body;

  try {
    // Find a chat where both sender and receiver match
    let chat = await Chat.findOne({
      sender: new mongoose.Types.ObjectId(sender),
      receiver: new mongoose.Types.ObjectId(receiver)
    });

    if (!chat) {
      // If no chat exists between these users, create a new one
      chat = await Chat.create({ sender, receiver, messages: [] });
    }

    // Add the message to the chat
    chat.messages.push(message);
    await chat.save();

    res.status(200).json({ status: true, message: "Message stored" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
 try {
  console.log("================================")
  const { sender, receiver } = req.query;
  console.log ("+++++++++++++++++++",sender, receiver)
  const chat = await Chat.findOne({
    participants: { $all: [sender, receiver] }
  });
  console.log("chat------------------",chat)
  
  if(chat)
    {
      return res.status(200).json({status:true,data:chat})
    } else {
      {return res.status(200).json({status:false,data:chat})}

    }
 }
 catch (error) {
  console.log (error)
  
 }
}




exports.storeMessage = async (req, res) => {
  const { sender, receiver, messages } = req.body;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [sender, receiver] }
    });

    if (!chat) {
      chat = new Chat({
        participants: [sender, receiver],
        messages: []
      });
    }

    chat.messages.push({
      sender: sender,
      content: messages.content,
      type: messages.type
    });

    await chat.save();

    // Populate the sender information
    const populatedMessage = await Chat.populate(chat.messages[chat.messages.length - 1], {
      path: 'sender',
      select: 'username email'
    });

    res.status(200).json({ status: true, message: populatedMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'username email')
      .populate('messages.sender', 'username email');
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getFile = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;
    const chat = await Chat.findById(chatId);
    const message = chat.messages.id(messageId);

    if (!message || !message.file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.set('Content-Type', message.file.contentType);
    res.set('Content-Disposition', `attachment; filename="${message.file.filename}"`);
    res.send(message.file.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};