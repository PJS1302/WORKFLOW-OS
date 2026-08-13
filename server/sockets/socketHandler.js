const Notification = require('../models/Notification');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Utility to send notifications via socket
  global.sendSocketNotification = async (userId, notificationData) => {
    try {
      const notification = await Notification.create({
        user: userId,
        message: notificationData.message,
        link: notificationData.link || '#'
      });
      io.to(userId.toString()).emit('newNotification', notification);
      return notification;
    } catch (error) {
      console.error('Socket notification error:', error);
    }
  };
};