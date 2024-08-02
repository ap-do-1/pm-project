const express = require("express");
const router = express.Router();
const projectControllers = require("../../controllers/projectController");
const authMiddleware = require("../../middleware/auth");

//Projects
router.get("/projects", authMiddleware, projectControllers.getAllProjects);
router.get("/projects/user/:userId", authMiddleware, projectControllers.getUserProjects);
router.get("/projects/member/:userId", authMiddleware, projectControllers.getMemberProjects);
router.get("/projects/:id", authMiddleware, projectControllers.getProject);
router.post("/projects", authMiddleware, projectControllers.createProject);
router.put("/projects/:id", authMiddleware, projectControllers.updateProject);
router.get(
    "/projects/closeDueDates", authMiddleware,
    projectControllers.getProjectsCloseDueDates
);
router.delete("/projects/:id", authMiddleware, projectControllers.deleteProject);

//Tasks
router.post("/projects/:id/boards", authMiddleware, projectControllers.addBoard);
router.delete("/projects/:id/boards/:boardId", authMiddleware, projectControllers.removeBoard);

//Members
router.post("/projects/:id/members", authMiddleware, projectControllers.addMember);
router.delete(
    "/projects/:id/members/:memberId", authMiddleware,
    projectControllers.removeMember
);

router.delete("/projects", authMiddleware, projectControllers.deleteAllProjects);

module.exports = router;