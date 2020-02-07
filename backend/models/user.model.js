const mongoose = require("mongoose");
const mongooseHidden = require("mongoose-hidden")({ defaultHidden: { __v: true } });
const Schema = mongoose.Schema;
const Joi = require("@hapi/joi");

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	created_at: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

userSchema.plugin(mongooseHidden);

const userValidationSchema = Joi.object({
	email: Joi.string()
		.email({ minDomainSegments: 2 })
		.required(),

	password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

module.exports = {
	model: mongoose.model("User", userSchema),
	schema: userValidationSchema,
};
