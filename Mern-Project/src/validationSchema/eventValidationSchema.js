const Joi = require("joi");

const eventValidationSchema = Joi.object({
  title: Joi.string().trim().required(),

  description: Joi.string().trim().required(),

  image: Joi.string().allow("").optional(),

  date: Joi.date().required(),

  time: Joi.string().required(),

  venue: Joi.string().trim().required(),

  ticketPrice: Joi.number().min(0).required(),

  availableSeats: Joi.number().min(0).required(),

  category: Joi.string().trim().required(),
});

module.exports = eventValidationSchema;