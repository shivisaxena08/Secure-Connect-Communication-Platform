const jwt = require("jsonwebtoken");
const User = require("../models/User");
async function authenticateToken(req,res,next) {
  try {
    const [scheme,token] = (req.headers.authorization || "").split(" ");
    if (scheme !== "Bearer" || !token) return res.status(401).json({message:"No token provided."});
    if (!process.env.JWT_SECRET) return res.status(500).json({message:"JWT_SECRET is not configured."});
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("_id username email role");
    if (!user) return res.status(401).json({message:"Token user no longer exists."});
    req.user = user; next();
  } catch(err) {
    if (["TokenExpiredError","JsonWebTokenError"].includes(err.name))
      return res.status(401).json({message:"Invalid or expired token."});
    next(err);
  }
}
function requireRole(...roles) {
  return (req,res,next) => req.user && roles.includes(req.user.role)
    ? next() : res.status(403).json({message:"Access denied: insufficient role."});
}
module.exports = {authenticateToken,requireRole};
