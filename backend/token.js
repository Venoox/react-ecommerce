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

		return jwt.verify(token, "secretkey");
	} catch (err) {
		throw err;
	}
};

module.exports = {
	makeToken,
	verifyToken,
};
