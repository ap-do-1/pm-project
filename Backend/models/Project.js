const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema for Projects
const projectSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  description: { type: String, required: true, max: 100 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

// Export the model
module.exports = mongoose.model("Project", projectSchema);
