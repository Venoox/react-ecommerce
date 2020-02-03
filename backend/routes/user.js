const express = require("express");
const bcrypt = require("bcrypt");
const debug = require("debug")("backend:user");
const router = express.Router();

const User = require("../models/user.model");
const UserValidation = require("../validationSchemas/userSchema");

router.post("/login", (req, res) => {
	const { email, password } = req.body;
	User.findOne({ email: email })
		.then(user => {
			bcrypt
				.compare(password, user.password)
				.then(result => {
					if (result) {
						res.json({
							messsage: "Login success",
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
		})
		.catch(err => {
			debug(err);
			res.status(400).json({
				messsage: "Login error",
			});
		});
});

router.post("/register", (req, res) => {
	const validation = UserValidation.validate(req.body);
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
				User.create({ email: email, password: hash })
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
