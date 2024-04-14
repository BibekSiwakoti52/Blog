const { authenticateJWT } = require("../middlewares/authenticateJWT");
const { optionalTokenParser } = require("../middlewares/optionalTokenParser");
const { Comment } = require("../models/comment");
const Posts = require("../models/post");

const postRouter = require("express").Router();

postRouter.get("/all", optionalTokenParser, async function (req, res, next) {
  try {
    const posts = await Posts.find();
    const isLoggedIn = !!req.user;
    const isAdmin = !!req.user?.isAdmin;

    res.render("myPosts", { posts, isLoggedIn, private: false, isAdmin });
  } catch (err) {
    console.log(err);
    res.send("An error occurred");
  }
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

postRouter.get("/edit/:id", authenticateJWT, async function (req, res, next) {
  const id = req.params.id;
  if (!id) {
    return res.send("Post id is required");
  }

  const post = await Posts.findById(id);
  if (!post) {
    return res.send("Post not found");
  }

  return res.render("editPost", {
    isAdmin: true,
    title: post.title,
    content: post.content,
    postId: post._id,
  });
});

postRouter.post("/edit/:id", authenticateJWT, async function (req, res, next) {
  const id = req.params.id;

  const post = await Posts.findByIdAndUpdate(id, req.body);
  if (!post) {
    return res.send("Post not found");
  }

  return res.redirect("/post/myPosts");
});

postRouter.delete("/:id", authenticateJWT, async function (req, res, next) {
  const postId = req.params.id;

  if (!postId) {
    return res.send("Post id not found");
  }

  const post = await Posts.findByIdAndDelete(postId);

  res.status(200).json({
    message: "Successfully deleted post",
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

postRouter.post(
  "/:id/comment",
  authenticateJWT,
  async function (req, res, next) {
    const postId = req.params.id;
    const comment = await Comment.create({
      ...req.body,
      user: req.user.id,
      post: postId,
    });

    res.redirect(`/post/${postId}`);
  }
);

postRouter.post(
  "/comment/edit/:id",
  authenticateJWT,
  async function (req, res, next) {
    const commentId = req.params.id;
    const comment = await Comment.findByIdAndUpdate(commentId, req.body);

    if (!comment) {
      return res.send("Comment not found");
    }

    return res.redirect(`/post/${comment.post}`);
  }
);

postRouter.get(
  "/comment/edit/:id",
  authenticateJWT,
  async function (req, res, next) {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);
    const isAdmin = req.user.isAdmin;

    if (!comment) {
      return res.send("Comment not found");
    }

    return res.render("editComment", { comment, isAdmin });
  }
);

postRouter.delete(
  "/comment/:id",
  authenticateJWT,
  async function (req, res, next) {
    const commentId = req.params.id;

    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      return res.send("Comment not found");
    }
    return res.status(200).json({
      message: "Successfully deleted comment",
    });
  }
);

postRouter.get("/:id", optionalTokenParser, async function (req, res, next) {
  const postId = req.params.id;
  const isLoggedIn = !!req.user;
  const isAdmin = !!req.user?.isAdmin;

  const post = await Posts.findById(postId).populate("user");
  const comments = await Comment.find({ post: postId })
    .sort("-createdAt")
    .populate("user");
  if (!postId) {
    return res.send("Post details not found");
  }

  return res.render("postDetail", {
    post,
    isAdmin,
    isLoggedIn,
    comments,
    userId: req.user.id,
  });
});

module.exports = postRouter;
