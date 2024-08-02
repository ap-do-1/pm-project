const Task = require("../models/Task");

// Get all tasks
async function getTasks(req, res) {
  try {
    const tasks = await Task.find().exec();
    return res.json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch tasks." });
  }
}

// Get a single task
async function getTask(req, res) {
  try {
    const task = await Task.findById(req.params.id).exec();
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }
    return res.json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch task." });
  }
}

async function getTasksByBoardId(req, res) {
  try {
    const tasks = await Task.find({ boardId: req.params.id }).exec();
    if (!tasks) {
      return res.status(404).json({ error: "Tasks not found." });
    }
    return res.json(tasks);
  } catch (error) {
    //console.error(error);
    return res.status(500).json({ error: "Failed to fetch tasks." });
  }
}

// create a new task with board id
async function createTaskId(req, res) {
  try {
    const { laneId, name, description, due_date, assigned_to, creator, status, priority } = req.body;
    const task = await Task.create({
      boardId: req.params.id,
      laneId,
      name,
      description,
      due_date,
      assigned_to,
      creator,
      status,
      priority,
    });
    return res.json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create task." });
  }
}

// Create a new task
async function createTask(req, res) {
  try {
    const {
      boardId,
      laneId,
      name,
      description,
      due_date,
      assigned_to,
      creator,
      status,
      priority,
    } = req.body;
    const task = await Task.create({
      boardId,
      laneId,
      name,
      description,
      due_date,
      assigned_to,
      creator,
      status,
      priority,
    });
    return res.json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create task." });
  }
}

// Update a task
async function updateTask(req, res) {
  try {
    const {
      name,
      description,
      due_date,
      assigned_to,
      creator,
      status,
      priority,
    } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { name, description, due_date, assigned_to, creator, status, priority },
      { new: true }
    ).exec();
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }
    return res.json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update task." });
  }
}

// Delete a task
async function deleteTask(req, res) {
  try {
    const task = await Task.findByIdAndDelete(req.params.id).exec();
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }
    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete task." });
  }
}

// Delete all tasks
async function deleteAllTasks(req, res) {
  try {
    await Task.deleteMany({}).exec();
    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete all tasks." });
  }
}

module.exports = {
  getTasks,
  getTask,
  getTasksByBoardId,
  createTask,
  createTaskId,
  updateTask,
  deleteTask,
  deleteAllTasks,
};
