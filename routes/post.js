const { authenticateJWT } = require("../middlewares/authenticateJWT");
const { optionalTokenParser } = require("../middlewares/optionalTokenParser");
const { Comment } = require("../models/comment");
const Posts = require("../models/post");

const postRouter = require("express").Router();


// Route to get all posts (public or private)
postRouter.get("/all", optionalTokenParser, async function (req, res, next) {
  try {
        // Fetch all posts from the database
    const posts = await Posts.find();

    // Check if user is logged in by verifying the existence of req.user
    const isLoggedIn = !!req.user; 

        // Check if the logged-in user is an admin by verifying req.user.isAdmin
    const isAdmin = !!req.user?.isAdmin; 

        // Render the 'myPosts' view with the fetched posts data along with user authentication status
    res.render("myPosts", { posts, isLoggedIn, private: false, isAdmin });
  } catch (err) {
    console.log(err);
    res.send("An error occurred");
  }
});

// Route to fetch posts created by the logged-in user or all posts if the user is an admin
postRouter.get("/myPosts", authenticateJWT, async function (req, res, next) {
    // Extract user ID from the authenticated request
  const userId = req.user.id;
    // Check if the authenticated user is an admin
  const isAdmin = req.user?.isAdmin;

  let posts = [];
  if (isAdmin) {
      // If the user is an admin, fetch all posts
    posts = await Posts.find();
  } else {    
    // If the user is not an admin, fetch posts created by the requeted user
    posts = await Posts.find({ user: userId });
  }

  res.render("myPosts", {
    posts,
    private: true, // Indicates that these posts are private to the logged-in user
    isLoggedIn: true, 
    isAdmin,
  });
});

// Route to render the edit post page for a specific post ID
postRouter.get("/edit/:id", authenticateJWT, async function (req, res, next) {
  const id = req.params.id;
    // Check if the post ID is provided
  if (!id) {
    return res.send("Post id is required");
  }

  const post = await Posts.findById(id);
  if (!post) {
    return res.send("Post not found");
  }

  // Render the 'editPost' view with post data for editing
  return res.render("editPost", {
    isAdmin: true, // Indicates that the user is an admin and has editing privileges
    title: post.title, // Pass the title of the post to the view
    content: post.content, // Pass the content of the post to the view
    postId: post._id, // Pass the ID of the post to the view
  });
});

// Route to update a post with a specific ID
postRouter.post("/edit/:id", authenticateJWT, async function (req, res, next) {
  const id = req.params.id;

    // Find the post by ID and update its content with the data from the request body
  const post = await Posts.findByIdAndUpdate(id, req.body);
  if (!post) {
    return res.send("Post not found");
  }
    // Redirect the user to the 'myPosts' page after successfully updating the post
  return res.redirect("/post/myPosts");
});

// Route to delete a post with a specific ID
postRouter.delete("/:id", authenticateJWT, async function (req, res, next) {
  const postId = req.params.id;

  if (!postId) {
    return res.send("Post id not found");
  }

  // Find the post by ID and delete it from the database
  const post = await Posts.findByIdAndDelete(postId);

  res.status(200).json({
    message: "Successfully deleted post",
  });
});

// Route to render the create post page
postRouter.get("/create", authenticateJWT, function (req, res, next) {
  const isAdmin = req.user?.isAdmin;
    // Render the 'createpost' view with the isAdmin flag indicating admin privileges
  res.render("createpost", { isAdmin });
});


// Route to create a new post
postRouter.post("/", authenticateJWT, async function (req, res, next) {
  const userId = req.user.id;
    // Extract post data from the request body
  const post = req.body;

    // Create a new post in the database associated with the authenticated user
  const newPost = await Posts.create({ ...req.body, user: userId });

    // Fetch all posts created by the authenticated user
  const posts = await Posts.find({ user: userId });

    // Redirect the user to the myPosts  after successfully creating the post
  res.redirect("/post/myPosts");
});

// Route to add a comment to a specific post with a specific ID
postRouter.post(
  "/:id/comment",
  authenticateJWT,
  async function (req, res, next) {
      // Extract post ID from the request parameters
    const postId = req.params.id;
      // Create a new comment 
    const comment = await Comment.create({
      ...req.body,
      user: req.user.id,
      post: postId,
    });

      // Redirect the user to the post detail page after successfully adding the comment
    res.redirect(`/post/${postId}`);
  }
);

// Route to edit a comment with a specific I
postRouter.post(
  "/comment/edit/:id",
  authenticateJWT,
  async function (req, res, next) {
    const commentId = req.params.id;
      // Find the comment by ID and update its content with the data from the request body
    const comment = await Comment.findByIdAndUpdate(commentId, req.body);

    if (!comment) {
      return res.send("Comment not found");
    }

    return res.redirect(`/post/${comment.post}`);
  }
);

// Route to render the edit comment page for a specific comment ID
postRouter.get(
  "/comment/edit/:id",
  authenticateJWT,
  async function (req, res, next) {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);
      // Extract admin status from the authenticated user
    const isAdmin = req.user.isAdmin;

    if (!comment) {
      return res.send("Comment not found");
    }
    return res.render("editComment", { comment, isAdmin });
  }
);

// Route to delete a comment with a specific ID
postRouter.delete(
  "/comment/:id",
  authenticateJWT,
  async function (req, res, next) {
    const commentId = req.params.id;

  // Find the comment by ID and delete it from the database
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      return res.send("Comment not found");
    }
  // Send a simple success message indicating deletion of the comment
  return res.status(200).json({
      message: "Successfully deleted comment",
    });
  }
);

// Route to fetch details of a specific post
postRouter.get("/:id", optionalTokenParser, async function (req, res, next) {
    // Extract post ID from the request parameters
  const postId = req.params.id;
    // Check if user is logged in by verifying the existence of req.user
  const isLoggedIn = !!req.user;
    // Check if the logged-in user is an admin by verifying req.user.isAdmin
  const isAdmin = !!req.user?.isAdmin;

    // Find the post with the provided ID in the database and populate its user field
  const post = await Posts.findById(postId).populate("user");
    // Find all comments associated with the post and populate their user field
  const comments = await Comment.find({ post: postId })
    .sort("-createdAt")
    .populate("user");
  if (!postId) {
    return res.send("Post details not found");
  }

    // Render the postDetail view with the fetched post details, user authentication status, and comments
  return res.render("postDetail", {
    post,
    isAdmin,
    isLoggedIn,
    comments,
    userId: req.user.id,
  });
});

module.exports = postRouter;
