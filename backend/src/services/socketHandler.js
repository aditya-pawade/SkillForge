// Socket.io handler for real-time features
const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join user to their personal room
    socket.on('join-user-room', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their personal room`);
    });

    // Join guild room
    socket.on('join-guild', (guildId) => {
      socket.join(`guild_${guildId}`);
      console.log(`User joined guild ${guildId}`);
    });

    // Handle guild chat messages
    socket.on('guild-message', (data) => {
      socket.to(`guild_${data.guildId}`).emit('guild-message', {
        message: data.message,
        sender: data.sender,
        timestamp: new Date()
      });
    });

    // Handle global chat messages
    socket.on('global-message', (data) => {
      io.emit('global-message', {
        message: data.message,
        sender: data.sender,
        timestamp: new Date()
      });
    });

    // Handle raid coordination
    socket.on('join-raid', (raidId) => {
      socket.join(`raid_${raidId}`);
      socket.to(`raid_${raidId}`).emit('player-joined-raid', {
        playerId: socket.id,
        timestamp: new Date()
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = socketHandler;