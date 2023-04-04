const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//schema for User

let userSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100 },
  password: { type: String, required: true, max: 100 },
  created_at: { type: Date, default: Date.now },
});

// Export the model
module.exports = mongoose.model("User", userSchema);
