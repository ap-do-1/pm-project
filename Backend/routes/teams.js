const Router = require("express").Router; //Router function from express
const Project = require("../models/teams"); //User model
const router = new Router();

//CRUD FOR TEAMS

//Create Team
router.post("/create", async (req, res) => {
  //create team
  const team = new Team({
    name: req.body.name,
    description: req.body.description,
    createdAt: Date.now(),
  });

  //save team
  team
    .save()
    .then((team) => res.status(201).json(team))
    .catch((err) => res.status(400).send(err));
});

//Read Team
router.get("/read", async (req, res) => {
  //find team
  const team = await Team.find();

  //send team
  res.status(200).json(team);
});

//Update Team
router.put("/update/:id", async (req, res) => {
  const id = req.params.id;

  // update specific car
  Teams.findByIdAndUpdate(id, req.body)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "No Team found with that id." });
      } else {
        res.send({ message: "Team was updated successfully." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error updating Team with this id=" + id });
    });
});

//Delete Task
router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  // update specific car
  Teams.findByIdAndDelete(id, req.body)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "No Team found with that id." });
      } else {
        res.send({ message: "Team was updated successfully." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error updating Team with this id=" + id });
    });
});

module.exports = router;
