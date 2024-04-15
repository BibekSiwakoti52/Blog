const { app } = require("tailwind");
const { authenticateJWT } = require("../middlewares/authenticateJWT");
const { validateRole } = require("../middlewares/validateRole");
const Posts = require("../models/post");

const adminRouter = require("express").Router();

adminRouter.get(
  "/posts",
  //Middleware for jwtAuthentication 
  authenticateJWT,
  //Middleware for validate admin user
  validateRole,
  async function (req, res, next) {
    // Fetch all posts from the database
    const posts = await Posts.find();
        // Render the 'posts' view template with isAdmin flag set to true and fetched posts data
    res.render("posts", { isAdmin: true, posts });
  }
);



module.exports = adminRouter;
