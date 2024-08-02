const express = require("express");
const router = express.Router();
const boardController = require("../../controllers/boardController");
const authMiddleware = require("../../middleware/auth");

// Boards
router.get("/boards", authMiddleware, boardController.getBoards);
router.get("/boards/:id", authMiddleware, boardController.getBoard);
router.post("/boards", authMiddleware, boardController.createBoard);
router.put("/boards/:id", authMiddleware, boardController.updateBoard);
router.delete("/boards/:id", authMiddleware, boardController.deleteBoard);

// Tasks
router.get("/boards/:boardId/tasks", authMiddleware, boardController.getTasks); // Get tasks within a board
router.post("/boards/:boardId/tasks", authMiddleware, boardController.createTask); // Create a task within a board
router.put("/boards/:boardId/tasks/:taskId", authMiddleware, boardController.updateTask); // Update a task within a board
router.delete("/boards/:boardId/tasks/:taskId", authMiddleware, boardController.deleteTask); // Delete a task within a board

module.exports = router;