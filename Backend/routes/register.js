const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registerValidation } = require("../validation");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    // Validate user input
    const { error } = registerValidation(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if email already exists
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      createdAt: Date.now(),
    });

    // Save user
    const savedUser = await user.save();

    // Create and send token in response header
    const token = jwt.sign(
      { name: savedUser.name, id: savedUser._id },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.header("auth-token", token).json({ data: savedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
