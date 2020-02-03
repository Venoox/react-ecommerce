const debug = require("debug")("backend:authMiddleware");

module.exports = (req, res, next) => {
	const { authorization } = req.headers;

	const parseAuth = () => {
		const [type = "", token = ""] = authorization.split(" ");
		return type === "Bearer" ? token : "";
	};

	if (!authorization) res.status(403).send("Unauthorized");
	else {
		const token = parseAuth();
		//Decode token and verify
	}
};
