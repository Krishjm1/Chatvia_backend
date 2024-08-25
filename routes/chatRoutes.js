const express = require('express');
const { sendMessage,storeMessage, getChats, getFile } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// router.post('/message', protect, sendMessage);
router.get('/chats', protect, getChats);
router.get('/file/:chatId/:messageId', protect, getFile);
router.post('/message', protect, storeMessage);

module.exports = router;
