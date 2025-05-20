const Joi = require("joi");

const validateParking = (data) => {
  const schema = Joi.object({
    code: Joi.number().required().label("Code"),
    parking_name: Joi.string().required().label("Parking Na,e"),
    n_space_available: Joi.number()
      .required()
      .label("Number of space available"),
    location: Joi.string().required().label("Location"),
    charging_hour: Joi.number().required().label("Charging per hour"),
  });
  return schema.validate(data);
};

module.exports = {
  validateParking,
};
