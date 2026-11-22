require("dotenv").config();
const http = require("http");
const app = require("./src/app");
const connectDB = require("./src/config/db");
const { initializeSocket } = require("./src/socket/socket");
const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    const server = http.createServer(app);
    initializeSocket(server);
    server.listen(PORT, () => {
      console.log(`[server] Listening at http://localhost:${PORT}`);
      console.log(`[server] Chat demo: http://localhost:${PORT}/chat.html`);
    });
  } catch (err) {
    console.error("[server] Startup failed:", err.message);
    process.exit(1);
  }
}
start();
