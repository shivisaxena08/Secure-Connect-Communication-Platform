const express = require("express");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.get("/", (req,res) => res.json({
  message:"Secure Connect and Communication Platform",
  endpoints:{signup:"POST /api/auth/signup",login:"POST /api/auth/login",profile:"GET /api/auth/me",notes:"/api/notes",chatDemo:"/chat.html"}
}));
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use(notFound);
app.use(errorHandler);
module.exports = app;
