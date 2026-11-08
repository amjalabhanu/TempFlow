export function registerCursorHandlers(io, socket) {
  socket.on("cursor:move", (payload = {}) => {
    const { diagramId, position } = payload;

    // Validate diagram ID
    if (typeof diagramId !== "string" || !diagramId) return;

    // Validate room membership
    if (!socket.data.joinedDiagrams.has(diagramId)) return;

    // Validate coordinates
    if (
      !position ||
      !Number.isFinite(position.x) ||
      !Number.isFinite(position.y)
    ) {
      return;
    }

    // Broadcast to other users in the same diagram
    socket.to(`diagram:${diagramId}`).emit("cursor:update", {
      diagramId,
      userId: socket.data.user.id,
      position: {
        x: position.x,
        y: position.y
      }
    });
  });
}