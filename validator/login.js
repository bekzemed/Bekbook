const isEmpty = require("./isEmpty");
const validator = require("validator");

module.exports = function validateLogin(data) {
  let errors = {};

  (data.email = !isEmpty(data.email) ? data.email : ""),
    (data.password = !isEmpty(data.password) ? data.password : "");

  if (!validator.isEmail(data.email)) {
    errors.email = "Email field should be in correct format.";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required.";
  }
  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is requied.";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
