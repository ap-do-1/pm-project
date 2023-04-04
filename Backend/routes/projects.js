const Router = require("express").Router; //Router function from express
const Project = require("../models/projects"); //User model
const router = new Router();

//CRUD FOR PROJECTS

//Create Project
router.post("/", async (req, res) => {
  //create project
  data = req.body;

  Project.insertMany(data)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

//Read Project
router.get("/", async (req, res) => {
  //find project
  const project = await Project.find();

  //send project
  res.status(200).json(project);
});

//Update Project
router.put("/:id", async (req, res) => {
  //find project
  const id = req.params.id;

  // update specific car
  Project.findByIdAndUpdate(id, req.body)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "No Project found with that id." });
      } else {
        res.send({ message: "Project was updated successfully." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error updating Project with this id=" + id });
    });
});

//Delete Project
router.delete("/:id", async (req, res) => {
  //find project
  const id = req.params.id;

  Project.findByIdAndDelete(id, req.body)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "No Project found with that id." });
      } else {
        res.send({ message: "Project was deleted successfully." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error deleting Project with this id=" + id });
    });
});

//Export router
module.exports = router;
