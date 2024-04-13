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
    res.render("admin/posts", { isAdmin: true, posts });
  }
);

adminRouter.get(
  "/post/edit/:id",
  authenticateJWT,
  validateRole,
  async function (req, res, next) {
    const id = req.params.id;
    if (!id) {
      return res.send("Post id is required");
    }

    const post = await Posts.findById(id);
    if (!post) {
      return res.send("Post not found");
    }

    return res.render("admin/editPost", {
      isAdmin: true,
      title: post.title,
      content: post.content,
      postId: post._id,
    });
  }
);

adminRouter.post(
  "/post/edit/:id",
  authenticateJWT,
  validateRole,
  async function (req, res, next) {
    const id = req.params.id;

    const post = await Posts.findByIdAndUpdate(id, req.body);
    if (!post) {
      return res.send("Post not found");
    }

    return res.redirect("/admin/posts");
  }
);

adminRouter.delete(
  "/post/:id",
  authenticateJWT,
  validateRole,
  async function (req, res, next) {
    const postId = req.params.id;

    if (!postId) {
      return res.send("Post id not found");
    }

    const post = await Posts.findByIdAndDelete(postId);

    res.status(200).json({
      message: "Successfully deleted post",
    });
  }
);

module.exports = adminRouter;
