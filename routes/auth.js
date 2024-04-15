const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/users");
const Posts = require("../models/post");
const { SaltRounds } = require("../lib/constants");
const authRouter = express.Router();

// get route for rendering login page
authRouter.get("/login", function (req, res, next) {
  res.render("login");
});

//post route for handling login form submission
authRouter.post("/login", async function (req, res, next) {
  //getting the value for email and password from the submittted form
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email in the database
  const user = await User.findOne({ email });

  if (!user) {
    return res.send("User not found");
  }

  // Compare the provided password with the hashed password stored in the database
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.send("Incorrect password");
  }
  // Generate JWT token containing user information
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 10, // Token expires in 10 minutes
      data: { id: user._id, email, isAdmin: user.isAdmin },
    },
    process.env.JWT_SECRET
  );

  // save token in browsers cookie
  // httpOnly prevents the cookie to be accessed by javascript
  res.cookie("jwt", token, { httpOnly: true });

  return res.redirect("/post/all");
});

authRouter.get("/logout", async function (req, res, next) {
  // Clear the JWT cookie from the browser
  res.clearCookie("jwt");
  return res.redirect("/auth/login");
});

authRouter.get("/register", function (req, res, next) {
  res.render("register");
});

//what this does is bcrypt will perform 2^12 (4096) iterations of the hashing algorithm to generate the salt
authRouter.post("/register", async function (req, res, next) {
  try {
    const body = req.body;
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, SaltRounds);

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
