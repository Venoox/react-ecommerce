const debug = require("debug")("backend:authMiddleware");

const { verifyToken, extendToken } = require("../token");

module.exports = type => (req, res, next) => {
	const { authorization } = req.headers;

	const parseAuth = () => {
		const [type = "", token = ""] = authorization.split(" ");
		return type === "Bearer" ? token : "";
	};

	if (!authorization) res.status(403).send("Unauthorized");
	else {
		const token = parseAuth();
		verifyToken(token)
			.then(decodedToken => {
				if (type === decodedToken.type) {
					req.token = token;
					req.decodedToken = decodedToken;
					extendToken(token)
						.then(() => {
							next();
						})
						.catch(err => {
							debug(err);
							res.status(403).send("Unauthorized");
						});
				} else {
					throw Error("Wrong type of account!");
				}
			})
			.catch(err => {
				debug(err);
				res.status(403).send("Unauthorized");
			});
	}
};
