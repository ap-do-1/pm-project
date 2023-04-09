const router = require("express").Router();
const project = require("../models/Project.js");
const user = require("../models/User.js");

// create a new Project
router.post("/", (req, res) => {
  data = req.body;

  project
    .insertMany(data)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// read all Project
router.get("/", (req, res) => {
  project
    .find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// find specific Project by id
router.get("/:id", (req, res) => {
  project
    .findById(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// update specific Project by id
router.put("/:id", (req, res) => {
  const id = req.params.id;

  // update specific Project
  project
    .findByIdAndUpdate(id, req.body)
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

// delete specific Project by id
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  project
    .findByIdAndDelete(id)
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

// Add members to a project
router.post("/:id/members", async (req, res) => {
  const projectId = req.params.id;
  const { userId, role, permissions } = req.body;

  try {
    const projectDoc = await project.findById(projectId);
    const userDoc = await user.findById(userId);

    if (!projectDoc || !userDoc) {
      return res.status(404).send({ message: "Project or user not found." });
    }

    const newMember = { user: userId, role, permissions };
    projectDoc.members.push(newMember);
    await projectDoc.save();

    res.send({ message: "Member added to the project successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Remove members from a project
router.delete("/:id/members/:userId", async (req, res) => {
  const projectId = req.params.id;
  const userId = req.params.userId;

  try {
    const projectDoc = await project.findById(projectId);

    if (!projectDoc) {
      return res.status(404).send({ message: "Project not found." });
    }

    projectDoc.members = projectDoc.members.filter(
      (member) => member.user.toString() !== userId
    );
    await projectDoc.save();

    res.send({ message: "Member removed from the project successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Add tasks to a project
router.post("/:id/tasks", async (req, res) => {
  const projectId = req.params.id;
  const { title, description, assignee, dueDate } = req.body;

  try {
    const projectDoc = await project.findById(projectId);
    const userDoc = await user.findById(assignee);

    if (!projectDoc || !userDoc) {
      return res.status(404).send({ message: "Project or user not found." });
    }

    const newTask = { title, description, assignee, dueDate };
    projectDoc.tasks.push(newTask);
    await projectDoc.save();

    res.send({ message: "Task added to the project successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Remove tasks from a project
router.delete("/:id/tasks/:taskId", async (req, res) => {
  const projectId = req.params.id;
  const taskId = req.params.taskId;

  try {
    const projectDoc = await project.findById(projectId);

    if (!projectDoc) {
      return res.status(404).send({ message: "Project not found." });
    }

    projectDoc.tasks = projectDoc.tasks.filter(
      (task) => task._id.toString() !== taskId
    );
    await projectDoc.save();

    res.send({ message: "Task removed from the project successfully." });

    // res.send(projectDoc);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
