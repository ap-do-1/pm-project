const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the role schema for embedding
const roleSchema = new Schema({
  role: { type: String, required: true },
  permissions: [{ type: String, required: true }],
});

// Define the user schema
const userSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100 },
  password: { type: String, required: true, max: 100 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // Embed the role schema inside the user schema
  roles: [roleSchema],
  // Add references to projects and tasks
  projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
});

// Export the model
module.exports = mongoose.model("User", userSchema);
