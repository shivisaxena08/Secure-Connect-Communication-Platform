const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const events = require("../events/appEvents");

function makeToken(user) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured in .env.");
  return jwt.sign({userId:user._id.toString(),role:user.role},process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_EXPIRES_IN || "1d"});
}
exports.signup = async (req,res,next) => {
  try {
    const {username,email,password} = req.body;
    if (!username || !email || !password) return res.status(400).json({message:"username, email and password are required."});
    if (typeof password !== "string" || password.length < 6) return res.status(400).json({message:"Password must contain at least 6 characters."});
    const normalized = String(email).trim().toLowerCase();
    if (await User.findOne({email:normalized})) return res.status(409).json({message:"Email is already registered."});
    const user = await User.create({username,email:normalized,password:await bcrypt.hash(password,12),role:"user"});
    events.emit("user:registered",user);
    res.status(201).json({message:"User registered.",id:user._id,username:user.username,email:user.email,role:user.role});
  } catch(err) { next(err); }
};
exports.login = async (req,res,next) => {
  try {
    const {email,password} = req.body;
    if (!email || !password) return res.status(400).json({message:"email and password are required."});
    const user = await User.findOne({email:String(email).trim().toLowerCase()}).select("+password");
    if (!user || !(await bcrypt.compare(password,user.password))) return res.status(401).json({message:"Invalid email or password."});
    const token = makeToken(user);
    events.emit("user:logged-in",user);
    res.json({message:"Login successful.",token,user:{id:user._id,username:user.username,email:user.email,role:user.role}});
  } catch(err) { next(err); }
};
exports.me = (req,res) => res.json({user:req.user});
