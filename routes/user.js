const { SaltRounds } = require("../lib/constants");
const { authenticateJWT } = require("../middlewares/authenticateJWT");
const { validateRole } = require("../middlewares/validateRole");
const User = require("../models/users");
const bcrypt = require("bcrypt");

const userRouter = require("express").Router();

userRouter.get(
  "/",
  authenticateJWT,
  validateRole,
  async function (req, res, next) {
    const users = await User.find().sort("-createdAt");

    return res.render("users", { users });
  }
);

userRouter.get(
  "/create",
  authenticateJWT,
  validateRole,
  function (req, res, next) {
    return res.render("createUser");
  }
);

userRouter.post(
  "/",
  authenticateJWT,
  validateRole,
  async function (req, res, next) {
    const hashedPassword = await bcrypt.hash(req.body.password, SaltRounds);

    // save the username and password in the database
    const newUser = await User.create({
      // send every value from request body to mongoose model
      ...req.body,
      password: hashedPassword,
    });

    res.redirect("/user");
  }
);

userRouter.get(
  "/edit/:id",
  authenticateJWT,
  validateRole,
  async function (req, res, next) {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.send("User not found");
    }

    return res.render("editUser", {
      name: user.name,
      email: user.email,
      userId: user._id,
    });
  }
);

userRouter.delete(
  "/:id",
  authenticateJWT,
  validateRole,
  async function (req, res, next) {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.send("User not found");
    }
    return res.status(200).json({ message: "Successfully deleted user" });
  }
);

userRouter.post(
  "/edit/:id",
  authenticateJWT,
  validateRole,
  async function (req, res, next) {
    const userId = req.params.id;

    const newUser = await User.findByIdAndUpdate(userId, req.body);

    if (!newUser) {
      return res.send("User not found");
    }

    return res.redirect("/user");
  }
);

module.exports = userRouter;
