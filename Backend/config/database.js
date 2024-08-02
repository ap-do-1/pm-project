const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(process.env.DBHOST, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = connect;
