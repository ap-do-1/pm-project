const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LaneSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  board: {
    type: Schema.Types.ObjectId,
    ref: "Board",
  },
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

module.exports = mongoose.model("Lane", LaneSchema);
