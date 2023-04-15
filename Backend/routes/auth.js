const Router = require("express").Router; //Router function from express
const User = require("../models/user"); //User model
const router = new Router();
const bcrypt = require("bcrypt"); //bcryptjs for password hashing
const jwt = require("jsonwebtoken"); //jsonwebtoken for token generation

const { registerValidation, loginValidation } = require("../validation"); //User validation
const { application } = require("express"); //express

//Registration Route
router.post("/register", async (req, res) => {
  //user input validation
  const { error } = registerValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  console.log("req.body.email:", req.body.email);
  console.log("req.body.password:", req.body.password);

  //check if email already exists

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send("Email already exists");
  }

  //hash password

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //create user

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    createdAt: Date.now(),
  });

  //save user
  user
    .save()
    .then((user) => res.status(201).json(user))
    .catch((err) => res.status(400).send(err));
});

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

//delete user by id
router.delete("/:id", async (req, res) => {
  try {
    const removedUser = await User.remove({ _id: req.params.id });
    res.json(removedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

//export router
module.exports = router;
