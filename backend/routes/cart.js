const express = require("express");
const debug = require("debug")("backend:cart");
const router = express.Router();
const auth = require("../middleware/auth");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

router.get("/", auth(["user", "admin"]), async (req, res) => {
	const { id: userId, type } = req.decodedToken;
	try {
		const cart = await Cart.model.find({ userId });
		if (cart) {
			const promises = cart.map((product) => {
				return Product.model
					.findById(product.productId)
					.then((result) => {
						if (result) {
							return {
								productId: product.productId,
								name: result.name,
								price: result.price,
								quantity: product.quantity,
								image: result.image,
							};
						} else {
							return {
								productId: product.productId,
								name: "Unknown product",
								price: 0.0,
								quantity: 0,
								image: "uploads/default.jpeg",
							};
						}
					})
					.catch((err) => {
						debug(err);
						return Error("Error occurred");
					});
			});
			Promise.all(promises).then((data) => {
				res.json(data);
			});
		} else throw Error("Cart not found");
	} catch (err) {
		debug(err);
		res.status(400).send("Cart not found");
	}
});

router.post("/add", auth(["user", "admin"]), async (req, res) => {
	const { id: userId, type } = req.decodedToken;
	const { productId, quantity } = req.body;
	try {
		const exists = await Cart.model.findOne({ userId, productId });
		if (exists) {
			exists.quantity += 1;
			const result = await exists.save();
			if (result) res.send("Added to cart");
			else throw Error("Error addding to cart");
		} else {
			const result = await Cart.model.create({ userId, productId, quantity });
			if (result) res.send("Added to cart");
			else throw Error("Error addding to cart");
		}
	} catch (err) {
		debug(err);
		res.status(400).send("Error adding to cart");
	}
});

router.delete("/remove/:productId", auth(["user", "admin"]), async (req, res) => {
	const { id: userId, type } = req.decodedToken;
	const { productId } = req.params;
	try {
		const result = await Cart.model.findOneAndRemove({ userId, productId });
		debug(result);
		if (result) res.send("Deleted from cart");
		else throw Error("User or Product not found");
	} catch (err) {
		debug(err);
		res.status(400).send("Error deleting from cart");
	}
});

router.put("/change", auth(["user", "admin"]), async (req, res) => {
	const { id: userId, type } = req.decodedToken;
	const { productId, quantity } = req.body;
	try {
		const result = await Cart.model.findOneAndUpdate({ userId, productId }, { quantity });
		if (result) res.send("Modified product in cart");
		else throw Error("Error modifying product");
	} catch (err) {
		debug(err);
		res.status(400).send("Error modifying product");
	}
});

router.delete("/clear", auth(["user", "admin"]), async (req, res) => {
	const { id: userId, type } = req.decodedToken;
	try {
		const result = await Cart.model.deleteMany({ userId });
		if (result) res.send("Cleared cart");
		else throw Error("Error clearing cart");
	} catch (err) {
		debug(err);
		res.status(400).send("Error clearing cart");
	}
});

module.exports = router;
