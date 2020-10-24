const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");
const fileSystem = require("fs");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fileSystem.mkdir("./uploads/", (err) => {
      cb(null, "./uploads/");
    });
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
// model
const Post = require("../../model/Post");
const Profile = require("../../model/Profile");

// validate
const validatePost = require("../../validator/post");

// @route get api/post
// @des  get all post
// @acces  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.find()
      .sort({ date: -1 })
      .populate("user", ["firstName", "lastName", "avatar"])
      .then((post) => res.json(post))
      .catch((err) => res.status(404).json(err));
  }
);

// @route get api/post/my
// @des  get my posts
// @acces  Private
router.get(
  "/my",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.find({ user: req.user.id })
      .sort({ date: -1 })
      .populate("user", ["firstName", "lastName", "avatar"])
      .then((post) => res.json(post))
      .catch((err) => res.status(404).json(err));
  }
);

// @route get api/post/:id
// @des  get  post
// @acces  Private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .populate("user", ["firstName", "lastName", "avatar"])
      .then((post) => res.json(post))
      .catch((err) => res.status(404).json(err));
  }
);

// @route POST api/post
// @des  add post
// @acces  Private
router.post(
  "/",
  upload.single("images"),
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePost(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      // name: req.body.handle,
      avatar: req.body.avatar,
      user: req.user.id,
      images: req.file.path,
    });

    newPost
      .save()
      .then((post) => res.json(post))
      .catch((err) => res.status(404).json(err));
  }
);

// @route Delete api/post/:id
// @des  delete post by its id
// @acces  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id).then((post) => {
        if (post.user.toString() !== req.user.id) {
          return res
            .status(401)
            .json({ notAuthorized: "Not authorized to delete the post" });
        }

        post
          .remove()
          .then(() => res.json({ success: "true" }))
          .catch((err) => res.status(404).json(err));
      });
    });
  }
);

// @route POST api/post/updateLike/:id
// @des  update like and unlike
// @acces  Private
router.post(
  "/updateLike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(() => {
        Post.findById(req.params.id).then((post) => {
          if (
            post.likes.filter((post) => post.user.toString() === req.user.id)
              .length > 0
          ) {
            const newLike = post.likes
              .map((post) => post.user.toString())
              .indexOf(req.user.id);

            post.likes.splice(newLike, 1);

            post
              .save()
              .then((post) => res.json(post))
              .catch((err) => res.status(404).json(err));
          } else {
            post.likes.unshift({ user: req.user.id });

            post
              .save()
              .then((post) => res.json(post))
              .catch((err) => res.status(404).json(err));
          }
        });
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route POST api/post/comment/:id
// @des  add comment
// @acces  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePost(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(() => {
      Post.findById(req.params.id).then((post) => {
        const newComment = {
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          avatar: req.user.avatar,
          user: req.user.id,
          text: req.body.text,
        };

        post.comments.unshift(newComment);

        post
          .save()
          .then((post) => res.json(post))
          .catch((err) => res.status(404).json(err));
      });
    });
  }
);

// @route Delete api/post/comment/:id/:comment_id
// @des  delete comment
// @acces  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(() => {
      Post.findById(req.params.id).then((post) => {
        if (
          post.comments.filter(
            (post) => post._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ alreadyDeleted: "Comment already deleted." });
        }

        const newComment = post.comments
          .map((post) => post._id.toString())
          .indexOf(req.params.comment_id);

        post.comments.splice(newComment, 1);

        post
          .save()
          .then((post) => res.json(post))
          .catch((err) => res.status(404).json(err));
      });
    });
  }
);

module.exports = router;
