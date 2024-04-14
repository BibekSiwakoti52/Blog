const { authenticateJWT } = require("../middlewares/authenticateJWT");
const { optionalTokenParser } = require("../middlewares/optionalTokenParser");
const Posts = require("../models/post");

const postRouter = require("express").Router();

postRouter.get("/all", optionalTokenParser, async function (req, res, next) {
  const posts = await Posts.find();
  const isLoggedIn = !!req.user;
  const isAdmin = !!req.user?.isAdmin;

  res.render("myPosts", { posts, isLoggedIn, private: false, isAdmin });
});

postRouter.get("/myPosts", authenticateJWT, async function (req, res, next) {
  const userId = req.user.id;
  const isAdmin = req.user?.isAdmin;

  let posts = [];
  if (isAdmin) {
    posts = await Posts.find();
  } else {
    posts = await Posts.find({ user: userId });
  }

  res.render("myPosts", {
    posts,
    private: true,
    isLoggedIn: true,
    isAdmin,
  });
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

postRouter.get("/:id", optionalTokenParser, async function (req, res, next) {
  const postId = req.params.id;
  const isLoggedIn = !!req.user;
  const isAdmin = !!req.user?.isAdmin;

  const post = await Posts.findById(postId).populate("user");
  if (!postId) {
    return res.send("Post details not found");
  }

  return res.render("postDetail", { post, isAdmin, isLoggedIn });
});

module.exports = postRouter;
