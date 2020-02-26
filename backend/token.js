const debug = require("debug")("backend:token");
const jwt = require("jsonwebtoken");

const Token = require("./models/token.model");

const makeToken = async (id, type) => {
	const token = jwt.sign({ id: id, type: type }, "secretkey");

	try {
		await Token.model.create({ token });
		return token;
	} catch (err) {
		debug(err);
		throw err;
	}
};

const verifyToken = async token => {
	try {
		const tokenModel = await Token.model.findOne({ token });
		if (!tokenModel || tokenModel.expiresAt - new Date() <= 0) throw Error("Unauthorized");
		return jwt.verify(token, "secretkey");
	} catch (err) {
		throw err;
	}
};

const invalidateToken = async token => {
	try {
		const result = await Token.model.deleteOne({ token });
		if (result.deletedCount === 0) {
			throw new Error("Error deleting token");
		}
	} catch (err) {
		throw err;
	}
};

const extendToken = async token => {
	const tokenModel = await Token.model.findOne({ token });

	tokenModel.expiresAt = Date.now() + 1 * 60 * 60 * 1000;

	await tokenModel.save();
};

module.exports = {
	makeToken,
	verifyToken,
	invalidateToken,
	extendToken,
};
