const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// model
const User = require("../../model/User");

// validation
const registerValidation = require("../../validator/register");
const loginValidation = require("../../validator/login");

// key
const secret = require("../../config/keys").secret;

// @route get /api/users
// @desc  test
// @access  Public

router.get("/", (req, res) => {
  return res.json({ msg: "success user" });
});

// @route POST /api/users/register
// @desc  register user
// @access  Public

router.post("/register", (req, res) => {
  const { errors, isValid } = registerValidation(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  // User.findOne({ email: req.body.email }).then((user) => {
  //   if (user) {
  //     console.log(user);

  //     res.json(user);
  //   } else {
  //     res.json({ msg: "There is no user" });
  //   }
  // });

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.status(404).json({ email: "Email already in use." });
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: "200",
          r: "pg",
          d: "mm",
        });

        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          avatar,
          password: req.body.password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => res.json(user))
              .catch((err) => res.status(404).json(err));
          });
        });
      }
    })
    .catch((err) => res.status(404).json(err));
});

// @route POST /api/users/login
// @desc  login user
// @access  Public

router.post("/login", (req, res) => {
  const { errors, isValid } = loginValidation(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res.status(404).json({ email: "No user found." });
    } else {
      bcrypt.compare(req.body.password, user.password).then((isMatch) => {
        if (!isMatch) {
          return res.status(400).json({ password: "Password mismatch." });
        } else {
          const payload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar,
          };

          jwt.sign(payload, secret, (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          });
        }
      });
    }
  });
});

// @route get /api/users/current
// @desc  display current user
// @access  Private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // console.log(req.user);
    res.json({
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      avatar: req.user.avatar,
    });
  }
);

router.get("/all", (req, res) => {
  User.find().then((user) => res.json(user));
});

module.exports = router;
