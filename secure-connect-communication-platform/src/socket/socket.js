const {Server} = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
function initializeSocket(server) {
  const io = new Server(server);
  io.use(async (socket,next) => {
    try {
      const token = socket.handshake.auth && socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication token required."));
      const decoded = jwt.verify(token,process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("_id username email role");
      if (!user) return next(new Error("User not found."));
      socket.user = user; next();
    } catch(err) { next(new Error("Invalid or expired authentication token.")); }
  });
  io.on("connection",socket => {
    console.log(`[chat] ${socket.user.username} connected`);
    socket.on("join-room",(name="general") => {
      const room = String(name).trim().slice(0,40) || "general";
      socket.join(room);
      socket.emit("system-message",{message:`You joined room: ${room}`,room});
      socket.to(room).emit("system-message",{message:`${socket.user.username} joined the room.`,room});
    });
    socket.on("chat-message",payload => {
      const room = String((payload && payload.room) || "general").trim().slice(0,40) || "general";
      const message = String((payload && payload.message) || "").trim();
      if (!message || message.length > 500) return socket.emit("chat-error",{message:"Message must contain 1–500 characters."});
      if (!socket.rooms.has(room)) return socket.emit("chat-error",{message:"Join the room before sending a message."});
      io.to(room).emit("chat-message",{username:socket.user.username,message,room,sentAt:new Date().toISOString()});
    });
    socket.on("disconnect",()=>console.log(`[chat] ${socket.user.username} disconnected`));
  });
  return io;
}
module.exports = {initializeSocket};
