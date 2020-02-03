const Joi = require("@hapi/joi");

const userSchema = Joi.object({
	email: Joi.string()
		.email({ minDomainSegments: 2 })
		.required(),

	password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),

	repeat_password: Joi.ref("password"),
});

module.exports = userSchema;
