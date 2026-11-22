const mongoose = require("mongoose");
module.exports = async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing. Create .env from .env.example.");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("[database] MongoDB connected.");
};
