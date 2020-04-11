const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseHidden = require("mongoose-hidden")({ defaultHidden: { __v: true } });

const orderSchema = new Schema({
	status: {
		type: String,
		required: true,
		default: "created"
	},
	userId: {
		type: mongoose.ObjectId,
		required: true
	},
	address: {
		firstName: {
			type: String,
			required: false
		},
		lastName: {
			type: String,
			required: false
		},
		street: {
			type: String,
			required: false
		},
		city: {
			type: String,
			required: false
		},
		zip: {
			type: String,
			required: false
		},
		country: {
			type: String,
			required: false
		}
	},
	products: {
		type: Array,
		required: false
	},
	shipping: {
		type: String,
		required: false
	},
	payment: {
		type: String,
		required: false
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now
	}
});

orderSchema.plugin(mongooseHidden);

module.exports = {
	model: mongoose.model("Order", orderSchema),
	schema: null
};
