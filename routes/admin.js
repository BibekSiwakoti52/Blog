const { app } = require("tailwind");
const { authenticateJWT } = require("../middlewares/authenticateJWT");
const { validateRole } = require("../middlewares/validateRole");
const Posts = require("../models/post");

const adminRouter = require("express").Router();

adminRouter.get(
  "/posts",
  authenticateJWT,
  validateRole,
  async function (req, res, next) {
    const posts = await Posts.find();
    res.render("posts", { isAdmin: true, posts });
  }
);



module.exports = adminRouter;
