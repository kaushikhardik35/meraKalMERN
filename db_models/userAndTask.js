const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  endpoint: { type: String, required: true },
  data: { type: String, required: false },
  delay: { type: Number, required: true },
  method: { type: String, required: true },
  status: { type: String, required: true },
  userId: { type: Number, required: true },
});

const userSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  username: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
const Task = mongoose.model("Task", taskSchema);

module.exports = { Task, User };
