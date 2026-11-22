const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username:{type:String,required:true,trim:true,minlength:2},
  email:{type:String,required:true,unique:true,lowercase:true,trim:true,
    match:[/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,"Enter a valid email address."]},
  password:{type:String,required:true,minlength:6,select:false},
  role:{type:String,enum:["user","admin"],default:"user"}
},{timestamps:true});
module.exports = mongoose.model("User",userSchema);
