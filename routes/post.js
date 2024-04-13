const { authenticateJWT } = require("../middlewares/authenticateJWT");
const Posts = require("../models/post");

const postRouter = require("express").Router();

postRouter.get("/all", async function (req, res, next) {
  const posts = await Posts.find();
  res.render("myPosts", { posts });
});

postRouter.get("/myPosts", authenticateJWT, async function (req, res, next) {
  const userId = req.user.id;
  const posts = await Posts.find({ user: userId });
  res.render("myPosts", { posts });
});

postRouter.get("/create", function (req, res, next) {
  res.render("createpost");
});

postRouter.post("/", authenticateJWT, async function (req, res, next) {
  const userId = req.user.id;
  const post = req.body;

  const newPost = await Posts.create({ ...req.body, user: userId });

  const posts = await Posts.find({ user: userId });

  res.render("myPosts", { posts, isAdmin: true });
});

module.exports = postRouter;
