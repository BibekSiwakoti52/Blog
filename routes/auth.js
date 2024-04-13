const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/users");
const Posts = require("../models/post");
const authRouter = express.Router();

authRouter.get("/login", function (req, res, next) {
  res.render("login");
});

authRouter.post("/login", async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email });

  if (!user) {
    return res.send("User not found");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.send("Incorrect password");
  }

  const posts = await Posts.find({ user: user._id });

  const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET);

  // save token in browsers cookie
  // httpOnly prevents the cookie to be accessed by javascript
  res.cookie("jwt", token, { httpOnly: true });

  return res.render("myPosts", { posts });
});

authRouter.get("/register", function (req, res, next) {
  res.render("register");
});

const saltRounds = 12; //what this does is bcrypt will perform 2^12 (4096) iterations of the hashing algorithm to generate the salt
authRouter.post("/register", async function (req, res, next) {
  try {
    const body = req.body;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    console.log(hashedPassword);

    // save the username and password in the database
    const newUser = await User.create({
      // send every value from request body to mongoose model
      ...req.body,
      password: hashedPassword,
    });
    res.render("login");
  } catch (err) {
    console.log(err);
  }
});

module.exports = authRouter;
