export const diagramUsers = new Map();
export const connectedUsers = new Map();

// Track a user's connected socket
export function addConnectedUser(userId, socketId) {
  if (!connectedUsers.has(userId)) {
    connectedUsers.set(userId, new Set());
  }

  connectedUsers.get(userId).add(socketId);
}

// Remove a disconnected socket
export function removeConnectedUser(userId, socketId) {
  const userSockets = connectedUsers.get(userId);

  if (!userSockets) return;

  userSockets.delete(socketId);

  if (userSockets.size === 0) {
    connectedUsers.delete(userId);
  }
}

// Track a user inside a diagram
export function addSocketToDiagram(socket, diagramId, io) {
  const userId = socket.data.user.id;

  if (!diagramUsers.has(diagramId)) {
    diagramUsers.set(diagramId, new Map());
  }

  const users = diagramUsers.get(diagramId);
  const isFirstConnection = !users.has(userId);

  if (!users.has(userId)) {
    users.set(userId, new Set());
  }

  users.get(userId).add(socket.id);

  broadcastPresence(io, diagramId);

  if (isFirstConnection) {
    socket.to(`diagram:${diagramId}`).emit("diagram:user-joined", {
      diagramId,
      user: socket.data.user
    });
  }
}

// Broadcast the current active users
export function broadcastPresence(io, diagramId) {
  const usersMap = diagramUsers.get(diagramId);
  const users = [];

  if (usersMap) {
    for (const [userId, socketIds] of usersMap.entries()) {
      let activeSocket = null;

      // Find any currently connected socket for this user
      for (const socketId of socketIds) {
        activeSocket = io.sockets.sockets.get(socketId);

        if (activeSocket) break;
      }

      if (activeSocket) {
        users.push({
          id: userId,
          name: activeSocket.data.user.name
        });
      }
    }
  }

  io.to(`diagram:${diagramId}`).emit("presence:update", {
    diagramId,
    users
  });
}

// Remove a socket from a diagram
export function removeSocketFromDiagram(socket, diagramId, io) {
  const userId = socket.data.user.id;
  const room = `diagram:${diagramId}`;

  socket.leave(room);
  socket.data.joinedDiagrams.delete(diagramId);

  const users = diagramUsers.get(diagramId);

  if (!users) return;

  const userSockets = users.get(userId);

  if (userSockets) {
    userSockets.delete(socket.id);

    if (userSockets.size === 0) {
      users.delete(userId);

      io.to(room).emit("diagram:user-left", {
        diagramId,
        user: { id: userId }
      });
    }
  }

  broadcastPresence(io, diagramId);

  if (users.size === 0) {
    diagramUsers.delete(diagramId);
  }
}