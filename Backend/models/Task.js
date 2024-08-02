const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    lane: {
      type: Schema.Types.ObjectId,
      ref: "Lane",
    },
    boardId: { type: Schema.Types.ObjectId, ref: "Board" },
    laneId: { type: Schema.Types.Number, ref: "Lane" },
    name: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 1000 },
    due_date: { type: Date, required: false },
    assigned_to: { type: Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["New", "In Progress", "Completed"],
      default: "New",
    },
    priority: { type: Number, required: false, min: 1, max: 5 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
