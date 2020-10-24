const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  text: {
    type: String,
    required: true,
  },
  images: {
    type: String,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },

  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    },
  ],

  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      text: {
        type: String,
        required: true,
      },
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("post", postSchema);

module.exports = Post;
