const mongoose = require("mongoose");
const Note = require("../models/Note");
const events = require("../events/appEvents");
const validId = id => mongoose.Types.ObjectId.isValid(id);
const scope = user => user.role === "admin" ? {} : {owner:user._id};

exports.create = async (req,res,next) => {
  try {
    const {title,content} = req.body;
    if (!title || !content) return res.status(400).json({message:"title and content are required."});
    const note = await Note.create({title,content,owner:req.user._id});
    events.emit("note:created",{noteId:note._id.toString(),userId:req.user._id.toString()});
    res.status(201).json(note);
  } catch(err) { next(err); }
};
exports.list = async (req,res,next) => {
  try {
    const notes = await Note.find(scope(req.user)).populate("owner","username email").sort({createdAt:-1});
    res.json({count:notes.length,notes});
  } catch(err) { next(err); }
};
exports.getOne = async (req,res,next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({message:"Invalid note ID."});
    const note = await Note.findOne({_id:req.params.id,...scope(req.user)}).populate("owner","username email");
    if (!note) return res.status(404).json({message:"Note not found."});
    res.json(note);
  } catch(err) { next(err); }
};
exports.update = async (req,res,next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({message:"Invalid note ID."});
    const updates = {};
    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.content !== undefined) updates.content = req.body.content;
    if (!Object.keys(updates).length) return res.status(400).json({message:"Provide title or content to update."});
    const note = await Note.findOneAndUpdate({_id:req.params.id,...scope(req.user)},updates,{new:true,runValidators:true});
    if (!note) return res.status(404).json({message:"Note not found."});
    res.json(note);
  } catch(err) { next(err); }
};
exports.remove = async (req,res,next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({message:"Invalid note ID."});
    const note = await Note.findOneAndDelete({_id:req.params.id,...scope(req.user)});
    if (!note) return res.status(404).json({message:"Note not found."});
    events.emit("note:deleted",{noteId:note._id.toString(),userId:req.user._id.toString()});
    res.json({message:"Note deleted.",id:note._id});
  } catch(err) { next(err); }
};
