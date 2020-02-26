const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseHidden = require("mongoose-hidden")({ defaultHidden: { __v: true } });

const productSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

productSchema.plugin(mongooseHidden);

module.exports = {
	model: mongoose.model("Product", productSchema),
	schema: null,
};
