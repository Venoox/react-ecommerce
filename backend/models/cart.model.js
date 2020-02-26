const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseHidden = require("mongoose-hidden")({ defaultHidden: { __v: true } });

const cartSchema = new Schema({
	userId: {
		type: mongoose.ObjectId,
		required: true,
	},
	productId: {
		type: mongoose.ObjectId,
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
		default: 1,
	},
});

cartSchema.plugin(mongooseHidden);

module.exports = {
	model: mongoose.model("Cart", cartSchema),
	schema: null,
};
