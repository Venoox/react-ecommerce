const express = require("express");
const debug = require("debug")("backend:reset");
const router = express.Router();

const generateToken = require("../generator");
const sendEmail = require("../mailer");

const Reset = require("../models/reset.model");
const User = require("../models/user.model");
const Token = require("../models/token.model");

router.post("/", async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.model.findOne({ email: email });
		if (!user) return res.send("Forget password request sent");

		const token = await generateToken(16);
		const reset = await Reset.model.create({ userId: user._id, token });
		const mailOptions = {
			from: "tomaz.cuk.webstore@gmail.com", // sender address
			to: email, // list of receivers
			subject: "Reset password request", // Subject line
			html: `
        <p>Hi, ${user.firstName + " " + user.lastName}!
        <p>Someone requested to reset your password. If that wasn't you, ignore this email!</p>
        <p>Click here to reset your password: <a href='http://localhost:3000/reset/${email}/${token}' target='_blank'>http://localhost:3000/reset/${email}/${token}</a></p>
        <p>Or copy this to the website: ${token}</p>`,
		};
		const info = await sendEmail(mailOptions);
		res.send("Email sent");
	} catch (err) {
		debug(err);
		res.status(404).send("Error");
	}
});

router.post("/change", async (req, res) => {
	const { email, token, newPassword } = req.body;
	try {
		const user = await User.model.findOne({ email: email });
		if (!user) return res.status(404).send("Error");
		const reset = await Reset.model.findOne({ userId: user._id, token: token });
		if (!reset) return res.status(404).send("Error");
		const hash = await bcrypt.hash(newPassword, 10);
		user.password = hash;
		const save = user.save();
		if (!save) return res.status(404).send("Can't change password");
		await Token.model.deleteMany({ userId: user._id });
		return res.send("Password changed");
	} catch (err) {
		debug(err);
		res.status(400).send("Error");
	}
});

module.exports = router;
