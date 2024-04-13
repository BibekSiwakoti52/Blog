var express = require("express");
var router = express.Router();
const userModel = require("../models/users");
const postModel = require("../models/post");
const commentModel = require("../models/comment");
const posts = require("../models/post");
const Posts = require("../models/post");
const { authenticateJWT } = require("../middlewares/authenticateJWT");

router.get("/", function (req, res, next) {
  res.redirect("/posts/all");
});

router.get("/register", function (req, res, next) {
  res.render("register");
});

/* GET home page. */
router.post("/:userId", async function (req, res, next) {
  // access userId from route
  const userId = req.params.userId;

  try {
    const createdPost = await postModel.create({
      user: userId,
      title: "hello",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus arcu ex, interdum a volutpat egestas, feugiat accumsan erat. Integer eget tortor nec nulla ullamcorper aliquet in sit amet libero. Etiam vitae odio at risus venenatis dapibus at non ipsum. Sed lobortis lorem a fermentum maximus. Praesent mi urna, suscipit sed ex quis, consectetur venenatis sapien. Sed mauris nibh, finibus nec mauris at, sagittis mattis risus. Mauris quis dapibus massa, nec pretium lorem. Curabitur sit amet orci et mauris hendrerit eleifend non ac orci. Integer dictum ac sapien ultrices mattis",
    });

    // return all the posts in the database
    const posts = await postModel.find();

    // Render the index.ejs template and pass the created post data to it
    res.render("index", { posts });
  } catch (error) {
    // Handle any errors that might occur during post creation
    next(error);
  }
});



module.exports = router;
