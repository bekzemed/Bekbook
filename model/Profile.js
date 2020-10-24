const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  handle: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  birth: {
    type: Date,
    required: true,
  },
  hobbies: {
    type: [String],
    required: true,
  },
  language: {
    type: [String],
  },

  religion: {
    type: String,
  },
  interestedIn: {
    type: String,
  },
  status: {
    type: String,
  },
  bio: {
    type: String,
  },
  website: {
    type: String,
  },

  education: [
    {
      school: {
        type: String,
        required: true,
      },
      degree: {
        type: String,
        required: true,
      },
      fieldofstudy: {
        type: String,
        required: true,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],

  // friendNor: [
  //   {
  //     user: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "users",
  //     },
  //   },
  // ],
  friendRequest: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  placeLived: [
    {
      livesIn: {
        type: String,
        required: true,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
    },
  ],
  social: {
    youtube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Profile = mongoose.model("profile", profileSchema);
module.exports = Profile;
