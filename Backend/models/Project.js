const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//schema for Projects
let projectSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  description: { type: String, required: true, max: 100 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  created_by: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  memebers: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Project", projectSchema);
