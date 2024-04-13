const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId, //Gets the id from a specific code which comment is being made
    ref: "Post",
    required: true,
  },
  authorName: {
    type: String,
  },
  authorEmail: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
