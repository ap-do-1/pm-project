const Board = require("../models/Board");
const Task = require("../models/Task");

async function getBoards(req, res) {
  try {
    const boards = await Board.find().exec();
    return res.json(boards);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch boards." });
  }
}

async function getBoard(req, res) {
  try {
    const board = await Board.findById(req.params.id).populate("tasks").exec();
    if (!board) {
      return res.status(404).json({ error: "Board not found." });
    }
    return res.json(board);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch board." });
  }
}

async function createBoard(req, res) {
  try {
    const { name, project, creator, members } = req.body;
    const board = await Board.create({ name, project, creator, members });
    return res.status(201).json(board);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create board." });
  }
}

async function updateBoard(req, res) {
  try {
    const { name, project, creator, members } = req.body;
    const board = await Board.findByIdAndUpdate(
      req.params.id,
      { name, project, creator, members },
      { new: true }
    ).exec();
    if (!board) {
      return res.status(404).json({ error: "Board not found." });
    }
    return res.json(board);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update board." });
  }
}

async function deleteBoard(req, res) {
  try {
    const board = await Board.findByIdAndDelete(req.params.id).exec();
    if (!board) {
      return res.status(404).json({ error: "Board not found." });
    }
    // Delete associated tasks
    await Task.deleteMany({ board: board._id }).exec();
    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete board." });
  }
}

async function createTask(req, res) {
  try {
    const { boardId } = req.params;
    const { name, description } = req.body;

    const task = await Task.create({
      name,
      description,
      board: boardId,
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create the task." });
  }
}

async function getTasks(req, res) {
  try {
    const { boardId } = req.params;
    const tasks = await Task.find({ board: boardId }).exec();

    return res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to retrieve tasks." });
  }
}

async function updateTask(req, res) {
  try {
    const { boardId, taskId } = req.params;
    const { name, description } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: taskId, board: boardId },
      { name, description },
      { new: true }
    ).exec();

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    return res.json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update the task." });
  }
}

async function deleteTask(req, res) {
  try {
    const { boardId, taskId } = req.params;

    const task = await Task.findOneAndDelete({
      _id: taskId,
      board: boardId,
    }).exec();

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    return res.json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete the task." });
  }
}

module.exports = {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
