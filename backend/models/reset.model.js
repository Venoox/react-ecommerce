const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseHidden = require("mongoose-hidden")({ defaultHidden: { __v: true } });

const resetSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true
	},
	token: {
		type: String,
		required: true
	},
	expireDate: {
		type: Date,
		required: true,
		default: () => Date.now() + 1 * 60 * 60
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now
	}
});

resetSchema.plugin(mongooseHidden);

module.exports = {
	model: mongoose.model("Reset", resetSchema),
	schema: null
};
