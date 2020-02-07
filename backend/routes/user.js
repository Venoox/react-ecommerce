const express = require("express");
const bcrypt = require("bcrypt");
const debug = require("debug")("backend:user");
const router = express.Router();

const User = require("../models/user.model");
const Token = require("../models/token.model");
const { makeToken, verifyToken } = require("../token");

router.delete("/delete", (req, res) => {
	const { token } = req.body;
	Token.model
		.deleteOne({ token })
		.then(result => {
			debug(result);
			if (result.deletedCount === 1) {
				res.json({
					message: "Invalidating token success",
				});
			} else {
				res.status(400).json({
					message: "Token not found",
				});
			}
		})
		.catch(err => {
			debug(err);
			res.status(400).json({
				message: "Invalidating token failed",
			});
		});
});

router.post("/", (req, res) => {
	const { token } = req.body;
	verifyToken(token)
		.then(decodedToken => {
			User.model
				.findById(decodedToken.id)
				.then(user => {
					if (user) {
						res.json({ email: user.email });
					} else {
						res.status(400).json({
							message: "User not found",
						});
					}
				})
				.catch(err => {
					debug(err);
					res.status(400).json({
						message: "Unauthorized",
					});
				});
		})
		.catch(err => {
			debug(err);
			res.status(400).json({
				message: "Unauthorized",
			});
		});
});

router.post("/login", (req, res) => {
	const { email, password } = req.body;
	User.model
		.findOne({ email })
		.then(user => {
			if (user) {
				bcrypt
					.compare(password, user.password)
					.then(result => {
						if (result) {
							makeToken(user._id, "user")
								.then(token => {
									res.json({
										messsage: "Login success",
										token: token,
									});
								})
								.catch(err => {
									debug(err);
									res.status(400).json({
										messsage: "Login error",
									});
								});
						} else {
							debug("Wrong password");
							res.status(400).json({
								messsage: "Login error - wrong password",
							});
						}
					})
					.catch(err => {
						debug(err);
						res.status(400).json({
							messsage: "Login error",
						});
					});
			} else {
				debug("User not found");
				res.status(400).json({
					messsage: "User not found",
				});
			}
		})
		.catch(err => {
			debug(err);
			res.status(400).json({
				messsage: "Login error",
			});
		});
});

router.post("/register", (req, res) => {
	const validation = User.schema.validate(req.body);
	if (validation.error) {
		res.json({
			messsage: "Register error",
			error: validation.error.details[0].message,
		});
	} else {
		const { email, password } = req.body;
		bcrypt
			.hash(password, 10)
			.then(hash => {
				User.model
					.create({ email, password: hash })
					.then(user => {
						res.json({
							messsage: "Register success",
						});
					})
					.catch(err => {
						debug(err);
						res.status(400).json({
							messsage: "Register error",
						});
					});
			})
			.catch(err => {
				debug(err);
				res.status(400).json({
					messsage: "Register error",
				});
			});
	}
});

module.exports = router;
