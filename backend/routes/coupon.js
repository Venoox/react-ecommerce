const express = require("express");
const debug = require("debug")("backend:coupon");
const router = express.Router();

const auth = require("../middleware/auth");
const Coupon = require("../models/coupon.model");

router.get("/", async (req, res) => {
	try {
		const coupons = await Coupon.model.find({});
		if (coupons) {
			res.json(coupons);
		} else {
			throw Error("Error");
		}
	} catch (err) {
		res.status(404).send(err);
	}
});

router.get("/:id", async (req, res) => {
	try {
		const coupon = await Coupon.model.findById(req.params.id);
		if (coupon) {
			res.json(coupon);
		} else {
			throw Error("Error");
		}
	} catch (err) {
		res.status(404).send("Error");
	}
});

router.post("/", async (req, res) => {
	const { couponCode, discount, expireDate } = req.body;
	try {
		const coupon = await Coupon.model.create({ couponCode, discount, expireDate });
		if (coupon) {
			res.send("Coupon created");
		} else {
			throw Error("Error creating coupon!");
		}
	} catch (err) {
		debug(err);
		res.status(404).send("Error creating coupon!");
	}
});

router.put("/", async (req, res) => {
	const { couponId, couponCode, discount, expireDate } = req.body;
	try {
		const coupon = await Coupon.model.findById(couponId);
		if (coupon) {
			coupon.couponCode = couponCode || coupon.couponCode;
			coupon.discount = discount || coupon.discount;
			coupon.expireDate = expireDate || coupon.expireDate;
			const result = await coupon.save();
			if (result) res.send("Coupon updated");
			else throw Error("Error updating coupon");
		} else throw Error("Error updating coupon");
	} catch (err) {
		res.status(404).send(err);
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const coupon = await Coupon.model.findByIdAndRemove(req.params.id);
		if (coupon) {
			res.send("Coupon removed");
		} else {
			throw Error("Error removing coupon!");
		}
	} catch (err) {
		res.status(404).send(err);
	}
});

module.exports = router;
