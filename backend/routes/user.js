const express = require("express");
const bcrypt = require("bcrypt");
const debug = require("debug")("backend:user");
const router = express.Router();

const multer = require("multer");
const User = require("../models/user.model");
const auth = require("../middleware/auth");
const Token = require("../models/token.model");
const Rating = require("../models/rating.model");
const Cart = require("../models/cart.model");
const { makeToken, invalidateToken } = require("../token");

const generateToken = require("../generator");
const sendEmail = require("../mailer");

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, "uploads");
	},
	filename: function(req, file, cb) {
		cb(null, file.fieldname + "-" + Date.now() + "." + file.mimetype.split("/")[1]);
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype.split("/")[0] === "image") cb(null, true);
	else cb(null, false);
};

const limits = {
	fileSize: 5242880,
};

const upload = multer({ storage, fileFilter, limits });

router.get("/all", auth("admin"), async (req, res) => {
	try {
		const users = await User.model.find({});
		if (!users) return res.status(404).send("Users not found");
		res.send(users);
	} catch (err) {
		debug(err);
		res.status(404).send("Error");
	}
});

router.get("/", auth(["user", "admin"]), async (req, res) => {
	const { id, type } = req.decodedToken;
	try {
		const user = await User.model.findById(id);
		if (!user) return res.status(404).send("User not found");
		res.send(user);
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
		res.json("Logout success");
	}
});

router.get("/check", auth(["admin", "user"]), async (req, res) => {
	const { id, type } = req.decodedToken;
	try {
		const user = await User.model.findById(id);
		if (!user) res.status(400).send("User not found");
		res.json({ user: { id: user._id, email: user.email, type: user.type } });
	} catch (err) {
		debug(err);
		res.status(400).send("Unauthorized");
	}
});

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.model.findOne({ email });
		if (!user) return res.status(400).send("User not found");
		if (user.status === 0) return res.status(404).send("User is not verified");
		const result = await bcrypt.compare(password, user.password);
		if (!result) return res.status(400).send("Wrong password");
		const token = await makeToken(user._id, user.type);
		res.json({
			messsage: "Login success",
			user: { id: user._id, email: user.email, type: user.type },
			token,
		});
	} catch (err) {
		debug(err);
		res.status(400).send("Login error");
	}
});

router.post("/register", async (req, res) => {
	try {
		const validation = User.schema.validate(req.body);
		if (validation.error) {
			return res.status(400).json({
				messsage: "Register error",
				error: validation.error && validation.error.details.length > 0 ? validation.error.details[0].message : "Body validation failed",
			});
		}
		const { email, password } = req.body;
		const hash = await bcrypt.hash(password, 10);
		let type = "user";
		if ((await User.model.countDocuments()) === 0) type = "admin";
		const token = await generateToken(16);
		const user = await User.model.create({ email: email, password: hash, type: type, confirmation_token: token });
		if (!user) return res.status(400).send("Register error");
		const mailOptions = {
			from: "Webstore <tomaz.cuk.webstore@gmail.com>",
			to: email,
			subject: "Confirmation e-mail",
			html: `
        <p>Welcome to our webstore!
        <p>In order to use your account you have to verify your e-mail!</p>
        <p>Click here to confirm your account: <a href='http://localhost:3000/confirm/${user._id}/${token}' target='_blank'>http://localhost:3000/confirm/${user._id}/${token}</a></p>`,
		};
		const info = await sendEmail(mailOptions);
		res.send("Register success");
	} catch (err) {
		debug(err);
		res.status(400).send("Register error");
	}
});

router.post("/confirm", async (req, res) => {
	try {
		const { _id, confirmation_token } = req.body;
		if (confirmation_token === undefined || _id === undefined) return res.status(404).send("Error");
		const user = await User.model.findOne({ _id, confirmation_token });
		if (!user) return res.status(404).send("Error");
		user.status = 1;
		await user.save();
		res.send("Success");
	} catch (err) {
		debug(err);
		res.status(404).send("Error");
	}
});

router.put("/update", auth(["admin", "user"]), upload.single("avatar"), async (req, res) => {
	const { id, type } = req.decodedToken;
	const { firstName, lastName, email, type: newType } = req.body;
	const image = (req.file && req.file.path) || null;
	try {
		const user = await User.model.findById(id);
		if (!user) return res.status(404).send("User not found");
		user.firstName = firstName || user.firstName;
		user.lastName = lastName || user.lastName;
		user.image = image || user.image;
		user.email = email || user.email;
		if (type === "admin") user.type = newType || user.type;
		const result = await user.save();
		if (!result) return res.status(404).send("User not found");
		res.send("Success");
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
		if (!result) return res.status(404).send("User not found");
		await Rating.model.deleteMany({ userId: id });
		await Cart.model.deleteMany({ userId: id });
		await Token.model.deleteMany({ userId: id });
		res.send("Success");
	} catch (err) {
		debug(err);
		res.status(404).send("Error deleting user");
	}
});

module.exports = router;
