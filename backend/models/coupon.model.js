const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseHidden = require("mongoose-hidden")({ defaultHidden: { __v: true } });

const couponSchema = new Schema({
	couponCode: {
		type: String,
		required: true,
	},
	discount: {
		type: Number,
		required: true,
	},
	expireDate: {
		type: Date,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

couponSchema.plugin(mongooseHidden);

module.exports = {
	model: mongoose.model("Coupon", couponSchema),
	schema: null,
};
