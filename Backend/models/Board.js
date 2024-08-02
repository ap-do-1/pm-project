const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
  name: { type: String, required: true, max: 101 },
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  lanes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Lane",
    },
  ],
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

module.exports = mongoose.model("Board", BoardSchema);
