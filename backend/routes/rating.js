const express = require("express");
const debug = require("debug")("backend:rating");
const router = express.Router();

const auth = require("../middleware/auth");
const Rating = require("../models/rating.model");
const User = require("../models/user.model");

router.get("/:productId", async (req, res) => {
	try {
		const ratings = await Rating.model.find({
			productId: req.params.productId,
		});
		if (ratings) {
			const promises = ratings.map((rating) => {
				return User.model
					.findById(rating.userId)
					.then((user) => {
						if (user) {
							return {
								_id: rating._id,
								name: user.firstName + " " + user.lastName,
								image: user.image,
								stars: rating.stars,
								comment: rating.comment,
							};
						} else {
							return {
								_id: rating._id,
								name: "Unknown user",
								image: "uploads/default-avatar.png",
								stars: rating.stars,
								comment: rating.comment,
							};
						}
					})
					.catch((err) => {
						debug(err);
						return Error("Error occurred");
					});
			});
			Promise.all(promises).then((data) => {
				console.log(data);
				res.json(data);
			});
		} else {
			throw Error("Error");
		}
	} catch (err) {
		res.status(404).send(err);
	}
});

router.post("/", auth(["admin", "user"]), async (req, res) => {
	const { id, type } = req.decodedToken;
	const { productId, stars, comment } = req.body;
	try {
		const rating = await Rating.model.create({ productId, userId: id, stars, comment });
		if (!rating) return res.status(404).send("Error");
		const user = await User.model.findById(id);
		res.send({
			_id: rating._id,
			name: user.firstName + " " + user.lastName,
			image: user.image,
			stars: rating.stars,
			comment: rating.comment,
		});
	} catch (err) {
		debug(err);
		res.status(404).send("Error creating rating!");
	}
});

router.put("/", auth(["admin", "user"]), async (req, res) => {
	const { ratingId, stars, comment } = req.body;
	try {
		const rating = await Rating.model.findById(ratingId);
		if (!rating) return res.status(404).send("Error");
		rating.stars = stars || rating.stars;
		rating.comment = comment || rating.comment;
		await rating.save();
		res.send("Rating updated");
	} catch (err) {
		res.status(404).send(err);
	}
});

router.delete("/:id", auth(["admin", "user"]), async (req, res) => {
	try {
		const rating = await Rating.model.findByIdAndRemove(req.params.id);
		if (!rating) return res.status(404).send("Error");
		res.send("Rating removed");
	} catch (err) {
		debug(err);
		res.status(404).send("Error");
	}
});

module.exports = router;
