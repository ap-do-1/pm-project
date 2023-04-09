const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema for Tasks
const taskSchema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  name: { type: String, required: true, max: 100 },
  description: { type: String, required: true, max: 1000 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  due_date: { type: Date, required: true },
  assigned_to: { type: Schema.Types.ObjectId, ref: "User", required: true },
  created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["New", "In Progress", "Completed"],
    default: "New",
  },
  priority: { type: Number, required: true, min: 1, max: 5 },
});

// Export the model
module.exports = mongoose.model("Task", taskSchema);
