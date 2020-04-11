const express = require("express");
const bcrypt = require("bcrypt");
const debug = require("debug")("backend:user");
const router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, "uploads");
	},
	filename: function(req, file, cb) {
		cb(null, file.fieldname + "-" + Date.now() + "." + file.mimetype.split("/")[1]);
	}
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype.split("/")[0] === "image") cb(null, true);
	else cb(null, false);
};

const limits = {
	fileSize: 5242880
};

const upload = multer({ storage, fileFilter, limits });

const User = require("../models/user.model");
const auth = require("../middleware/auth");
const Token = require("../models/token.model");
const { makeToken, invalidateToken } = require("../token");

router.get("/all", auth("admin"), async (req, res) => {
	try {
		const users = await User.model.find({});
		if (users) {
			res.send(users);
		} else throw Error("Error");
	} catch (err) {
		debug(err);
		res.status(404).send("Error");
	}
});

router.get("/", auth(["user", "admin"]), async (req, res) => {
	const { id, type } = req.decodedToken;
	try {
		const user = await User.model.findById(id);
		if (user) {
			res.send(user);
		} else throw Error("Error");
	} catch (err) {
		debug(err);
		res.status(404).send("Error");
	}
});

router.delete("/logout", auth(["admin", "user"]), async (req, res) => {
	const { token } = req;
	try {
		await invalidateToken(token);
	} catch (err) {
		debug("Failed to invalidate token");
		debug(err);
	} finally {
		res.json({
			message: "Logout success"
		});
	}
});

router.get("/check", auth(["admin", "user"]), async (req, res) => {
	const { id, type } = req.decodedToken;
	try {
		const user = await User.model.findById(id);
		if (user) {
			res.json({ user: { id: user._id, email: user.email, type: user.type } });
		} else {
			res.status(400).json({
				message: "User not found"
			});
		}
	} catch (err) {
		debug(err);
		res.status(400).json({
			message: "Unauthorized"
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
				const token = await makeToken(user._id, user.type);
				res.json({
					messsage: "Login success",
					user: { id: user._id, email: user.email, type: user.type },
					token
				});
			} else {
				res.status(400).json({
					messsage: "Wrong password"
				});
			}
		} else {
			res.status(400).json({
				messsage: "User not found"
			});
		}
	} catch (err) {
		debug(err);
		res.status(400).json({
			messsage: "Login error"
		});
	}
});

router.post("/register", async (req, res) => {
	const validation = User.schema.validate(req.body);
	if (validation.error) {
		res.status(400).json({
			messsage: "Register error",
			error: validation.error && validation.error.details.length > 0 ? validation.error.details[0].message : "Body validation failed"
		});
	} else {
		const { email, password } = req.body;
		try {
			const hash = await bcrypt.hash(password, 10);
			const user = User.model.create({ email, password: hash, type: "user" });
			if (user) {
				res.json({
					messsage: "Register success"
				});
			} else {
				res.status(400).json({
					messsage: "Register error"
				});
			}
		} catch (err) {
			debug(err);
			res.status(400).json({
				messsage: "Register error"
			});
		}
	}
});

router.put("/update", auth(["admin", "user"]), upload.single("avatar"), async (req, res) => {
	const { id, type } = req.decodedToken;
	const { firstName, lastName, email } = req.body;
	const image = (req.file && req.file.path) || null;
	try {
		const user = await User.model.findById(id);
		if (user) {
			user.firstName = firstName || user.firstName;
			user.lastName = lastName || user.lastName;
			user.image = image || user.image;
			user.email = email || user.email;
			const result = await user.save();
			if (result) res.send("Success");
			else throw Error("Error updating user");
		} else throw Error("Error updating user");
	} catch (err) {
		debug(err);
		res.status(404).send("Error updating user");
	}
});

router.put("/password", auth(["admin", "user"]), async (req, res) => {
	const { id, type } = req.decodedToken;
	const { password, newPassword } = req.body;
	try {
		const user = await User.model.findById(id);
		if (!user) return res.status(404).send("User not found");
		const result = await bcrypt.compare(password, user.password);
		if (!result) return res.status(404).send("Wrong password");
		const hash = await bcrypt.hash(newPassword, 10);
		user.password = hash;
		const save = await user.save();
		if (!save) return res.status(404).send("Failed to save");
		await Token.model.deleteMany({ userId: id });
		return res.send("Password changed");
	} catch (err) {
		debug(err);
		return res.status(404).send("Error");
	}
});

router.delete("/delete", auth("user"), async (req, res) => {
	const { id, type } = req.decodedToken;
	try {
		const result = await User.model.findByIdAndDelete(id);
		if (result) {
			res.send("Success");
		} else throw Error("Erorr deleting user");
	} catch (err) {
		debug(err);
		res.status(404).send("Error deleting user");
	}
});

module.exports = router;
