const crypto = require("crypto");
const base64url = require("base64url");

const generateToken = (bytes) => {
	return new Promise((resolve, reject) => {
		crypto.randomBytes(bytes, (err, buffer) => {
			if (err) reject(err);
			const token = base64url(buffer);
			resolve(token);
		});
	});
};

module.exports = generateToken;
