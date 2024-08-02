const express = require("express");
const router = express.Router();
const laneController = require("../../controllers/laneController");
const authMiddleware = require("../../middleware/auth");

// Lanes
router.get("/lanes", authMiddleware, laneController.getAllLanes);
router.get("/lanes/:id", authMiddleware, laneController.getLane);
router.post("/lanes", authMiddleware, laneController.createLane);
router.put("/lanes/:id", authMiddleware, laneController.updateLane);
router.delete("/lanes/:id", authMiddleware, laneController.deleteLane);

// Tasks add and remove
router.post("/lanes/:id/tasks", authMiddleware, laneController.addTask);
router.delete("/lanes/:id/tasks/:taskId", authMiddleware, laneController.removeTask);

module.exports = router;