const express = require("express");
const router = express.Router();
const passport = require("passport");

// model
const User = require("../../model/User");
const Profile = require("../../model/Profile");

// validation
const validateProfile = require("../../validator/profile");
const validateEducation = require("../../validator/education");
const validateLocation = require("../../validator/placeLived");

// @route get /api/profile/all
// @desc  get all profile
// @acc Private
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.find()
      .populate("user", ["firstName", "lastName", "avatar"])
      .then((profile) => {
        if (profile) {
          res.json(profile);
        } else {
          return res.status(404).json({ noProfile: "There is no profile" });
        }
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route get /api/profile/other
// @desc  get all profile other than login user
// @acc Private
router.get(
  "/other",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.find({ user: { $nin: req.user.id } })
      .populate("user", ["firstName", "lastName", "avatar"])
      .then((profile) => {
        if (profile) {
          res.json(profile);
        } else {
          return res.status(404).json({ noProfile: "There is no profile" });
        }
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route get /api/profile/handle/:handle
// @desc  get profile by its handle
// @acc Private
router.get(
  "/handle/:handle",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ handle: req.params.handle })
      .populate("user", ["firstName", "lastName", "avatar"])
      .then((profile) => {
        if (profile) {
          res.json(profile);
        } else {
          return res.status(404).json({ noHandle: "There is no handle" });
        }
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route get /api/profile/user/:user_id
// @desc  get profile by user id
// @acc Private
router.get(
  "/user/:user_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.params.user_id })
      .populate("user", ["firstName", "lastName", "avatar"])
      .then((profile) => {
        if (profile) {
          res.json(profile);
        } else {
          return res
            .status(404)
            .json({ noUser: "There is no user by this id" });
        }
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route   GET api/profile
// @des     Get Current user profile
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["firstName", "lastName", "avatar"])
      .then((profile) => {
        if (!profile) {
          errors.noprofile = "There is no profile";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route POST /api/profile
// @desc  create or update profile
// @acc Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfile(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const profileData = {};
    profileData.user = req.user.id;
    if (req.body.handle) profileData.handle = req.body.handle;
    if (req.body.gender) profileData.gender = req.body.gender;
    if (req.body.birth) profileData.birth = req.body.birth;
    if (req.body.religion) profileData.religion = req.body.religion;
    if (req.body.interestedIn) profileData.interestedIn = req.body.interestedIn;
    if (req.body.status) profileData.status = req.body.status;
    if (req.body.bio) profileData.bio = req.body.bio;
    if (req.body.website) profileData.website = req.body.website;

    // hobies array
    if (typeof req.body.hobbies !== "undefined") {
      profileData.hobbies = req.body.hobbies.split(",");
    }
    // language array
    if (typeof req.body.language !== "undefined") {
      profileData.language = req.body.language.split(",");
    }

    // social object
    profileData.social = {};
    if (req.body.youtube) profileData.social.youtube = req.body.youtube;
    if (req.body.twitter) profileData.social.twitter = req.body.twitter;
    if (req.body.facebook) profileData.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileData.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileData.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          Profile.findOne({ handle: profileData.handle }).then((profile) => {
            if (profile) {
              return res.status(404).json({ handle: "Handle already exist" });
            }
            Profile(profileData)
              .save()
              .then((profile) => res.json(profile))
              .catch((err) => res.status(404).json(err));
          });
        } else {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileData },
            { new: true }
          )
            .then((profile) => res.json(profile))
            .catch((err) => res.status(404).json(err));
        }
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route POST /api/profile/education
// @desc  add education
// @acc Private

router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducation(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        const newEdu = {
          school: req.body.school,
          degree: req.body.degree,
          fieldofstudy: req.body.fieldofstudy,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description,
        };
        profile.education.unshift(newEdu);
        profile
          .save()
          .then((profile) => res.json(profile))
          .catch((err) => res.status(404).json(err));
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route POST /api/profile/location
// @desc  add user location status
// @acc Private

router.post(
  "/location",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateLocation(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        const newLocation = {
          livesIn: req.body.livesIn,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
        };

        profile.placeLived.unshift(newLocation);

        profile
          .save()
          .then((profile) => res.json(profile))
          .catch((err) => res.status(404).json(err));
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route Delte /api/profile/education/:id
// @desc  delete education by its id
// @acc Private
router.delete(
  "/education/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      const newEdu = profile.education
        .map((item) => item.id)
        .indexOf(req.params.id);

      profile.education.splice(newEdu, 1);

      profile
        .save()
        .then((profile) => res.json(profile))
        .catch((err) => res.json(err));
    });
  }
);

// @route Delte /api/profile/location/:id
// @desc  delete location by its id
// @acc Private
router.delete(
  "/location/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      const newEdu = profile.placeLived
        .map((item) => item.id)
        .indexOf(req.params.id);

      profile.placeLived.splice(newEdu, 1);

      profile
        .save()
        .then((profile) => res.json(profile))
        .catch((err) => res.json(err));
    });
  }
);

// @route POST /api/profile/friendRequest/:user_ID/:freind_ID
// @desc  post friend request
// @acc Private

router.post(
  "/friendRequest/:user_ID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (
          profile.friendRequest.filter(
            (profile) => profile.user.toString() === req.user.id
          ).length > 0 ||
          req.user.id === req.params.user_ID
        ) {
          return res.status(400).json({
            notSentToOneself:
              "You cant sent friend request to urself or Already sent the request.",
          });
        }
        profile.friendRequest.unshift({ user: req.params.user_ID });
        profile.save().then((profile) => res.json(profile));
      })
      .catch(() => res.status(404).json({ noUser: "No user found." }));
  }
);

// @route DELETE /api/profile/friendRequest/:user_ID
// @desc  delete friend request
// @acc Private

router.delete(
  "/friendRequest/:freind_ID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (
          profile.friendRequest.filter(
            (profile) => req.params.freind_ID === profile.user.toString()
          ) === 0
        ) {
          return res
            .status(400)
            .json({ notFreind: "You are not freind with the user" });
        }
        const newFreind = profile.friendRequest
          .map((friend) => friend.user.toString())
          .indexOf(req.params.freind_ID);

        profile.friendRequest.splice(newFreind, 1);

        profile
          .save()
          .then((profile) => res.json(profile))
          .catch((err) => res.status(404).json(err));
      })
      .catch(() => res.status(404).json({ noUser: "No user found." }));
  }
);

// @route DELETE /api/profile
// @desc  delete user
// @acc Private

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id })
      .then(() => {
        User.findOneAndRemove({ _id: req.user.id })
          .then(() => res.json({ success: true }))
          .catch((err) => res.status(404).json(err));
      })
      .catch((err) => res.status(404).json(err));
  }
);

module.exports = router;
