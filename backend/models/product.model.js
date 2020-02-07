const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
