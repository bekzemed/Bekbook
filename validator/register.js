const isEmpty = require("./isEmpty");
const validator = require("validator");

module.exports = function validateRegister(data) {
  let errors = {};

  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (validator.isEmpty(data.firstName)) {
    errors.firstName = "first name field is required.";
  }

  if (validator.isEmpty(data.lastName)) {
    errors.lastName = "last name field is required.";
  }

  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password =
      "Sorry, your password must be between 6 and 30 characters long.";
  }
  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is required.";
  }

  if (validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm Password field is required.";
  }

  if (!validator.isEmail(data.email)) {
    errors.email = "Email field should be in correct format.";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required.";
  }

  if (!validator.equals(data.password, data.password2)) {
    errors.password2 = "Password doesnt match.";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
