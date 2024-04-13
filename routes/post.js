const { authenticateJWT } = require("../middlewares/authenticateJWT");
const { optionalTokenParser } = require("../middlewares/optionalTokenParser");
const Posts = require("../models/post");

const postRouter = require("express").Router();

postRouter.get("/all", optionalTokenParser, async function (req, res, next) {
  const posts = await Posts.find();
  const isAdmin = !!req.user?.isAdmin;
  const isLoggedin = !!req.user;
  res.render("myPosts", { posts, isAdmin, isLoggedin });
});

postRouter.get("/myPosts", authenticateJWT, async function (req, res, next) {
  const userId = req.user.id;
  const isAdmin = req.user?.isAdmin;

  const posts = await Posts.find({ user: userId });
  res.render("myPosts", { posts, isAdmin });
});

postRouter.get("/create", authenticateJWT, function (req, res, next) {
  const isAdmin = req.user?.isAdmin;

  res.render("createpost", { isAdmin });
});

postRouter.post("/", authenticateJWT, async function (req, res, next) {
  const userId = req.user.id;
  const post = req.body;

  const newPost = await Posts.create({ ...req.body, user: userId });

  const posts = await Posts.find({ user: userId });
  res.redirect("/post/myPosts");
});

module.exports = postRouter;
