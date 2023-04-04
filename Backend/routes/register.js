// const Router = require("express").Router; //Router function from express
// const User = require("../models/user"); //User model
// const router = new Router();
// const bcrypt = require("bcrypt"); //bcryptjs for password hashing
// const jwt = require("jsonwebtoken"); //jsonwebtoken for token generation

// const { registerValidation, loginValidation } = require("../validation"); //User validation

// //Registration Route
// router.post("/register", async (req, res) => {
//   //user input validation
//   const { error } = registerValidation(req.body);

//   if (error) {
//     return res.status(400).send(error.details[0].message);
//   }

//   //check if email already exists

//   const emailExist = await User.findOne({ email: req.body.email });
//   if (emailExist) {
//     return res.status(400).send("Email already exists");
//   }

//   //hash password

//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(req.body.password, salt);

//   //create user

//   const user = new User({
//     name: req.body.name,
//     email: req.body.email,
//     password: hashedPassword,
//     createdAt: Date.now(),
//   });

//   //save user
//   user
//     .save()
//     .then((user) => res.status(201).json(user))
//     .catch((err) => res.status(400).send(err));
// });

// module.exports = router;
