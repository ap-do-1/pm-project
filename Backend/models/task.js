const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//schema for Tasks

let taskSchema = new Schema({
  project_id: { type: Schema.Types.ObjectId, ref: "Project" },
  name: { type: String, required: true, max: 100 },
  description: { type: String, required: true, max: 100 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  due_date: { type: Date, default: Date.now },
  assigned_to: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["New", "In Progress", "Completed"],
    default: "New",
  },
  //the priority level of the task (integer)
  priority: { type: Number, required: true },
});

// Export the model
module.exports = mongoose.model("Task", taskSchema);
