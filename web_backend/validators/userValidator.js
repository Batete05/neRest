const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");


//We use validation as a first hand form to verify the user and even validate their 
//inpuuts before they are stored in the database
const validateUser = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    role: Joi.string().valid("ADMIN", "ATTENDANT").default("ATTENDANT"), // <-- allow role
  });

  return schema.validate(data);
};

const validatePasswordComplexity = (data) => {
  const schema = Joi.object({
    password: passwordComplexity().required().label("Password"),
  });
  return schema.validate(data);
};

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = {
  validateLogin,
  validatePasswordComplexity,
  validateUser,
};
