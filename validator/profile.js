const isEmpty = require("./isEmpty");
const validator = require("validator");

module.exports = function validateProfile(data) {
  let errors = {};

  (data.handle = !isEmpty(data.handle) ? data.handle : ""),
    (data.hobbies = !isEmpty(data.hobbies) ? data.hobbies : "");
  data.gender = !isEmpty(data.gender) ? data.gender : "";
  data.birth = !isEmpty(data.birth) ? data.birth : "";

  if (validator.isEmpty(data.handle)) {
    errors.handle = "Handle field is required.";
  }

  if (validator.isEmpty(data.hobbies)) {
    errors.hobbies = "Hobbies field is requied.";
  }
  if (validator.isEmpty(data.gender)) {
    errors.gender = "Gender field is requied.";
  }
  if (validator.isEmpty(data.birth)) {
    errors.birth = "Birth Status field is requied.";
  }

  if (!isEmpty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = "Not valid website";
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!validator.isURL(data.youtube)) {
      errors.youtube = "Not valid website";
    }
  }
  if (!isEmpty(data.twitter)) {
    if (!validator.isURL(data.twitter)) {
      errors.twitter = "Not valid website";
    }
  }
  if (!isEmpty(data.linkedin)) {
    if (!validator.isURL(data.linkedin)) {
      errors.linkedin = "Not valid website";
    }
  }
  if (!isEmpty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = "Not valid website";
    }
  }
  if (!isEmpty(data.instagram)) {
    if (!validator.isURL(data.instagram)) {
      errors.instagram = "Not valid website";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
