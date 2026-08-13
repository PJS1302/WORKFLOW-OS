const path = require('path');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io'); // FIXED: Destructure Server from socket.io
const connectDB = require('./config/db');
const socketHandler = require('./sockets/socketHandler');

// Load env vars - use __dirname so the path resolves correctly regardless of CWD
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to Database
connectDB();

const app = require('./app');
const server = http.createServer(app);

// FIXED: Initialize Socket.IO using 'new Server()'
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Socket.io setup
socketHandler(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});