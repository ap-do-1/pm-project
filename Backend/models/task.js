const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//schema for Tasks

let taskSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  description: { type: String, required: true, max: 100 },
  created_at: { type: Date, default: Date.now },
});

// Export the model
module.exports = mongoose.model("Task", taskSchema);
