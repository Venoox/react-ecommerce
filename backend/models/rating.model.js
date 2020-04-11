const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseHidden = require("mongoose-hidden")({ defaultHidden: { __v: true } });

const ratingSchema = new Schema({
	productId: {
		type: mongoose.ObjectId,
		required: true,
	},
	userId: {
		type: mongoose.ObjectId,
		required: true,
	},
	stars: {
		type: Number,
		required: true,
	},
	comment: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

ratingSchema.plugin(mongooseHidden);

module.exports = {
	model: mongoose.model("Rating", ratingSchema),
	schema: null,
};
