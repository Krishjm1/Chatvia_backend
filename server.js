const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/chats', chatRoutes);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:3000" },
});

app.set('io', io);

io.on('connection', (socket) => {
  socket.on('joinChat', (userId) => {
    socket.join(userId);
  });

  socket.on('sendMessage', (message) => {
    console.log("message socket---------------",message)
    io.to(message.receiver).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});