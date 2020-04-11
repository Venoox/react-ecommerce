const mongoose = require("mongoose");
const mongooseHidden = require("mongoose-hidden")({ defaultHidden: { __v: true } });
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
	userId: {
		type: mongoose.ObjectId,
		required: true
	},
	token: {
		type: String,
		required: true,
		unique: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
	expiresAt: {
		type: Date,
		required: true,
		default: () => Date.now() + 1 * 60 * 60 * 1000,
	},
});

tokenSchema.plugin(mongooseHidden);

module.exports = {
	model: mongoose.model("Token", tokenSchema),
	schema: null,
};
