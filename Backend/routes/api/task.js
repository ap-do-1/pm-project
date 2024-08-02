const express = require("express");
const router = express.Router();
const taskControllers = require("../../controllers/taskController");
const authMiddleware = require("../../middleware/auth");

//Tasks
router.get("/tasks", authMiddleware, taskControllers.getTasks);
router.get("/tasks/:id", authMiddleware, taskControllers.getTask);
router.get("/tasks/board/:id", taskControllers.getTasksByBoardId);
router.post("/tasks/:id", authMiddleware, taskControllers.createTaskId);
router.post("/tasks", authMiddleware, taskControllers.createTask);
router.put("/tasks/:id", authMiddleware, taskControllers.updateTask);
router.delete("/tasks/:id", authMiddleware, taskControllers.deleteTask);
router.delete("/tasks", authMiddleware, taskControllers.deleteAllTasks);

module.exports = router;