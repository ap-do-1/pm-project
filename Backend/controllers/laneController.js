const mongoose = require("mongoose");
const Lane = require("../models/Lane");
const Board = require("../models/Board");
const Task = require("../models/Task");

async function createLane(req, res) {
  const { name, board } = req.body;

  let lane;
  try {
    lane = await Lane.create({
      name,
      board,
    });
  } catch (error) {
    console.error("Error creating lane: ", error);
    return res.status(500).json({ error: "Failed to create lane." });
  }

  try {
    return res.json(lane);
  } catch (error) {
    console.error("Error returning lane: ", error);
    return res.status(500).json({ error: "Failed to return lane." });
  }
}

async function getAllLanes(req, res) {
  try {
    const lanes = await Lane.find().populate("tasks").exec();
    return res.json(lanes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch lanes." });
  }
}

async function getLane(req, res) {
  try {
    const lane = await Lane.findById(req.params.id).populate("tasks").exec();
    if (!lane) {
      return res.status(404).json({ error: "Lane not found." });
    }
    return res.json(lane);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch lane." });
  }
}

async function updateLane(req, res) {
  try {
    const { name } = req.body;
    const lane = await Lane.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    ).exec();
    if (!lane) {
      return res.status(404).json({ error: "Lane not found." });
    }
    return res.json(lane);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update lane." });
  }
}

async function deleteLane(req, res) {
  try {
    const lane = await Lane.findByIdAndDelete(req.params.id).exec();
    if (!lane) {
      return res.status(404).json({ error: "Lane not found." });
    }
    await Task.deleteMany({ lane: lane._id }).exec();
    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete lane." });
  }
}

async function addTask(req, res) {
  try {
    const { id } = req.params;
    const { taskId } = req.body;

    // Find the lane by id
    const lane = await Lane.findById(id);
    if (!lane) {
      return res.status(404).json({ error: "Lane not found." });
    }

    // Check if the task already exists in the lane's tasks array
    const taskIndex = lane.tasks.indexOf(taskId);
    if (taskIndex !== -1) {
      return res.status(400).json({ error: "Task already exists in lane." });
    }

    // Add the task to the lane's tasks array
    lane.tasks.push(taskId);
    await lane.save();

    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to add task to lane." });
  }
}

async function removeTask(req, res) {
  try {
    const { id, taskId } = req.params;

    // Find the lane by id
    const lane = await Lane.findById(id);
    if (!lane) {
      return res.status(404).json({ error: "Lane not found." });
    }

    // Check if the task exists in the lane's tasks array
    const taskIndex = lane.tasks.indexOf(taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ error: "Task not found in lane." });
    }

    // Remove the task from the lane's tasks array
    lane.tasks.splice(taskIndex, 1);
    await lane.save();

    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to remove task from lane." });
  }
}

module.exports = {
  createLane,
  getAllLanes,
  getLane,
  updateLane,
  deleteLane,
  addTask,
  removeTask,
};
