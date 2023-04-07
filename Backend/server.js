const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
// const cors = require("./middleware/cors");
require("dotenv-flow").config();

//swagger
// const swaggerUI = require("swagger-ui-express");
// const yaml = require("yamljs");

//swagger setup
// const swaggerDocument = yaml.load("./swagger.yaml");
// app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//cors

// parse request - content type JSON
app.use(bodyParser.json());

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.DBHOST, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .catch((error) => console.log("Error conncecting to MongoDB:" + error));

mongoose.connection.once("open", () =>
  console.log("Connected succesfully to MongoDB")
);

// Root route
app.get("/", (req, res) => {
  res.status(200).send({ message: "Welcome to the PM REST API Homepage" });
});

// routes
app.use("/api/projects", require("./routes/projects"));
app.use("/api/tasks", require("./routes/tasks"));

// app.use("/api/auth", require("./routes/auth"));

//login
app.use("/api/login", require("./routes/login"));

//register
app.use("/api/register", require("./routes/register"));

const PORT = process.env.PORT || 4000;

//start up server on port 4000
app.listen(PORT, function () {
  console.log("Server is running on port: " + PORT);
});

module.exports = app;
