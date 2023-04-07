const router = require("express").Router();
const task = require("../models/Task.js");
const User = require("../models/user");

// create a new Task
router.post("/", (req, res) => {
  data = req.body;

  task
    .insertMany(data)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// read all Tasks
router.get("/", (req, res) => {
  task
    .find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// find specific Task by id
router.get("/:id", (req, res) => {
  task
    .findById(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// update specific Tasks by id
router.put("/:id", (req, res) => {
  const id = req.params.id;

  // update specific Task
  task
    .findByIdAndUpdate(id, req.body)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "No Task found with that id." });
      } else {
        res.send({ message: "Task was updated successfully." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error updating Task with this id=" + id });
    });
});

// delete specific Task
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  task
    .findByIdAndDelete(id, req.body)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "No Task found with that id." });
      } else {
        res.send({ message: "Task was deleted successfully." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error deleting Task with this id=" + id });
    });
});

module.exports = router;
