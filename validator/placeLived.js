const isEmpty = require("./isEmpty");
const validator = require("validator");

module.exports = function validateLogin(data) {
  let errors = {};

  (data.livesIn = !isEmpty(data.livesIn) ? data.livesIn : ""),
    (data.from = !isEmpty(data.from) ? data.from : "");

  if (validator.isEmpty(data.livesIn)) {
    errors.livesIn = "Current Home Town field is required.";
  }
  if (validator.isEmpty(data.from)) {
    errors.from = "From field is requied.";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
