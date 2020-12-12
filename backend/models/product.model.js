const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseHidden = require("mongoose-hidden")({ defaultHidden: { __v: true } });
const mongoosePaginate = require("mongoose-paginate-v2");

const productSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: false,
	},
	price: {
		type: Number,
		required: true,
	},
	image: {
		type: String,
		required: true,
		default: "uploads/default.jpeg",
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

productSchema.plugin(mongooseHidden);
productSchema.plugin(mongoosePaginate);
productSchema.index({ name: "text" });

module.exports = {
	model: mongoose.model("Product", productSchema),
	schema: null,
};
