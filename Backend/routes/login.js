const Router = require("express").Router; //Router function from express
const User = require("../models/user"); //User model
const router = new Router();
const bcrypt = require("bcrypt"); //bcryptjs for password hashing
const jwt = require("jsonwebtoken"); //jsonwebtoken for token generation

const { loginValidation } = require("../validation"); //User validation

//Login Route
router.post("/login", async (req, res) => {
  //validate user input
  const { error } = loginValidation(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  //if log in is valid find user
  const user = await User.findOne({ email: req.body.email });

  // error if email is wrong
  if (!user) {
    return res.status(400).json({ error: "Email is wrong" });
  }

  //if user exists, check password

  const validPass = await bcrypt.compare(req.body.password, user.password);

  //if password is wrong, error

  if (!validPass) {
    return res.status(400).json({ error: "Password is wrong" });
  }

  //if password is correct, create token
  const token = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  //attach token to response
  res.header("auth-token", token).json({
    error: null,
    data: { token },
  });
});

module.exports = router;
