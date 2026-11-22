const EventEmitter = require("events");
const events = new EventEmitter();
events.on("user:registered",u=>console.log(`[event] New user registered: ${u.email}`));
events.on("user:logged-in",u=>console.log(`[event] User logged in: ${u.email}`));
events.on("note:created",d=>console.log(`[event] Note ${d.noteId} created by ${d.userId}`));
events.on("note:deleted",d=>console.log(`[event] Note ${d.noteId} deleted by ${d.userId}`));
module.exports = events;
