const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//schema for User

let userSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100 },
  password: { type: String, required: true, max: 100 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  // an array of role objects containing the role name and permissions for the user (array of objects)
  roles: [
    {
      role: { type: String, required: true },
      permissions: [{ type: String, required: true }],
    },
  ],
});

// Export the model
module.exports = mongoose.model("User", userSchema);
