const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "tomaz.cuk.webstore@gmail.com",
		pass: "$HR6&9UcszKn",
	},
});

const sendEmail = (mailOptions) => {
	return new Promise((resolve, reject) => {
		transporter.sendMail(mailOptions, function(err, info) {
			if (err) reject(err);
			resolve(info);
		});
	});
};

module.exports = sendEmail;
