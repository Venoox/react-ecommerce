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
	type: {
		type: String,
		required: true,
	},
	status: {
		type: Number,
		required: true,
		default: 0,
	},
	confirmation_token: {
		type: String,
		required: false,
	},
	firstName: {
		type: String,
		required: false,
	},
	lastName: {
		type: String,
		required: false,
	},
	address: {
		street: {
			type: String,
			required: false,
		},
		city: {
			type: String,
			required: false,
		},
		zip: {
			type: String,
			required: false,
		},
		country: {
			type: String,
			required: false,
		},
	},
	image: {
		type: String,
		required: true,
		default: "uploads/default-avatar.png",
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

	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9]{6,50}$"))
		.required(),
});

module.exports = {
	model: mongoose.model("User", userSchema),
	schema: userValidationSchema,
};
