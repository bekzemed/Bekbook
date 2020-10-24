const isEmpty = require("./isEmpty");
const validator = require("validator");

module.exports = function validatePost(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (!validator.isLength(data.text, { min: 1 })) {
    errors.text = "You cant post empty text.";
  }
  if (validator.isEmpty(data.text)) {
    errors.text = "Text field is required.";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
