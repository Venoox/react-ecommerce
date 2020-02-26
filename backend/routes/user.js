const express = require("express");
const bcrypt = require("bcrypt");
const debug = require("debug")("backend:user");
const router = express.Router();

const User = require("../models/user.model");
const auth = require("../middleware/auth");
const { makeToken, invalidateToken } = require("../token");

router.delete("/logout", auth("user"), async (req, res) => {
	const { token } = req;
	try {
		await invalidateToken(token);
	} catch (err) {
		debug("Failed to invalidate token");
		debug(err);
	} finally {
		res.json({
			message: "Logout success",
		});
	}
});

router.get("/check", auth("user"), async (req, res) => {
	const { id, type } = req.decodedToken;
	try {
		const user = await User.model.findById(id);
		if (user) {
			res.json({ email: user.email });
		} else {
			res.status(400).json({
				message: "User not found",
			});
		}
	} catch (err) {
		debug(err);
		res.status(400).json({
			message: "Unauthorized",
		});
	}
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.model.findOne({ email });
		if (user) {
			const result = await bcrypt.compare(password, user.password);
			if (result) {
				const token = await makeToken(user._id, "user");
				res.json({
					messsage: "Login success",
					user: { email: user.email },
					token,
				});
			} else {
				res.status(400).json({
					messsage: "Wrong password",
				});
			}
		} else {
			res.status(400).json({
				messsage: "User not found",
			});
		}
	} catch (err) {
		debug(err);
		res.status(400).json({
			messsage: "Login error",
		});
	}
});

router.post("/register", async (req, res) => {
	const validation = User.schema.validate(req.body);
	if (validation.error) {
		res.status(400).json({
			messsage: "Register error",
			error: validation.error && validation.error.details.length > 0 ? validation.error.details[0].message : "Body validation failed",
		});
	} else {
		const { email, password } = req.body;
		try {
			const hash = await bcrypt.hash(password, 10);
			const user = User.model.create({ email, password: hash });
			if (user) {
				res.json({
					messsage: "Register success",
				});
			} else {
				res.status(400).json({
					messsage: "Register error",
				});
			}
		} catch (err) {
			debug(err);
			res.status(400).json({
				messsage: "Register error",
			});
		}
	}
});

module.exports = router;
