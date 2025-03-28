const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on("join", (streamId) => {
    socket.join(streamId);
    console.log(`User ${socket.id} joined ${streamId}`);
  });

  socket.on("signal", (streamId, data) => {
    socket.to(streamId).emit("signal", data);
    console.log(`Signal from ${socket.id} to ${streamId}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected ${socket.id}`);
  });
});

server.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});
