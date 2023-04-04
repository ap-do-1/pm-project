const router = require("express").Router();
const task = require("../models/task.js");

// CRUD operations

// create a new car
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

// read all cars
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

// find specific Car by id
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

// update specific cars by id
router.put("/:id", (req, res) => {
  const id = req.params.id;

  // update specific car
  task
    .findByIdAndUpdate(id, req.body)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "No car found with that id." });
      } else {
        res.send({ message: "Car was updated successfully." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error updating Car with this id=" + id });
    });
});

// delete specific car
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  task
    .findByIdAndDelete(id, req.body)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "No car found with that id." });
      } else {
        res.send({ message: "Car was deleted successfully." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error deleting car with this id=" + id });
    });
});

module.exports = router;
