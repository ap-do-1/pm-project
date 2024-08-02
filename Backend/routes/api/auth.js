const express = require("express");
const router = express.Router();
const authControllers = require("../../controllers/authController");
const authMiddleware = require("../../middleware/auth");

router.post("/register", authControllers.register);

router.post("/login", authControllers.login);

router.post("/logout", authControllers.logout);

router.post("/refresh", authControllers.refresh);

router.post("/validateToken", authControllers.validateToken);

router.get("/user", authMiddleware, authControllers.user);

router.put("/user", authMiddleware, authControllers.updateUser);

router.put("/update", authMiddleware, authControllers.updateUser2);


module.exports = router;