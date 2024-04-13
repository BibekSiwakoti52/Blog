var express = require("express");
var router = express.Router();
const userModel = require("../models/users");
const postModel = require("../models/post");
const commentModel = require("../models/comment");
const posts = require("../models/post");
const Posts = require("../models/post");
const { authenticateJWT } = require("../middlewares/authenticateJWT");

router.get("/", function (req, res, next) {
  res.redirect("/post/all");
});

module.exports = router;
