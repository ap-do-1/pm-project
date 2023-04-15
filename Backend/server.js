const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("./middleware/cors");
const app = express();
const { errorHandler } = require("./middleware/error");

require("dotenv-flow").config();

// Routes task project and auth
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const taskRoutes = require("./routes/tasks");

// Middleware
app.use(cors);
app.use(bodyParser.json());

mongoose.set("strictQuery", false);

// Database Connection
const dbUri = process.env.DBHOST;
const dbOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  // remove these options
  // useCreateIndex: true,
  // useFindAndModify: false,
};

mongoose
  .connect(dbUri, dbOptions)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => consoleåp.log("Error connecting to MongoDB:", error));

// Routes
app.get("/", (req, res) => {
  res.status(200).send({ message: "Welcome to the PM REST API HOMEPAGE" });
});

// Mount your API routes
app.use("/api/user", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

//Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 4000;

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
