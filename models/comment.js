const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    post: {
      //Gets the id from a specific post which comment is being made
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Post",
      required: true,
    },
    user: {
      //Gets the id of the user who is commenting
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = { Comment };
