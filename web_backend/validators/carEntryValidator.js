const Joi = require("joi");

const validateCarEntry = (data) => {
  const schema = Joi.object({
    plate_number: Joi.string().required(),
    parking_code: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = { validateCarEntry };
