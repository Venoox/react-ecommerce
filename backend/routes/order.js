const express = require("express");
const debug = require("debug")("backend:order");
const router = express.Router();

const auth = require("../middleware/auth");
const Order = require("../models/order.model");
const stripe = require("stripe")("sk_test_71cnxrDZSVTwV7q3QlHl3FGM00iMQi1O4p");

router.get("/", auth("admin"), async (req, res) => {
	try {
		const orders = await Order.model.find({});
		if (!orders) res.status(404).send("No orders");
		res.send(orders);
	} catch (err) {
		debug(err);
		res.status(404).send("Error");
	}
});

router.get("/:orderId", auth("admin"), async (req, res) => {
	try {
		const order = await Order.model.findById(req.params.orderId);
		if (!order) res.status(404).send("Order not found");
		res.send(order);
	} catch (err) {
		debug(err);
		res.status(404).send("Error");
	}
});

router.get("/user/:userId", auth(["admin", "user"]), async (req, res) => {
	try {
		const orders = await Order.model.find({ userId: req.params.userId });
		if (!orders) res.status(404).send("Orders not found");
		res.send(orders);
	} catch (err) {
		debug(err);
		res.status(404).send("Error");
	}
});

router.post("/create", auth(["admin", "user"]), async (req, res) => {
	const { id, type } = req.decodedToken;
	const { products } = req.body;
	try {
		const order = await Order.model.create({ userId: id, products });
		if (!order) res.status(404).send("Order not found");
		res.send({ orderId: order._id });
	} catch (err) {
		debug(err);
		res.status(404).send("Error");
	}
});

router.put("/addaddress", auth(["admin", "user"]), async (req, res) => {
	const { id, type } = req.decodedToken;
	const { address, orderId } = req.body;
	try {
		const order = await Order.model.findOne({ _id: orderId, userId: id });
		if (!order) return res.status(404).send("Order not found");
		order.address = address;
		const result = await order.save();
		if (!result) return res.status(404).send("Order not saved");
		res.send("Address added");
	} catch (err) {
		debug(err);
		return res.status(404).send("Error");
	}
});

router.put("/addpayment", auth(["admin", "user"]), async (req, res) => {
	const { id, type } = req.decodedToken;
	const { payment, orderId } = req.body;
	try {
		const order = await Order.model.findOne({ _id: orderId, userId: id });
		if (!order) return res.status(404).send("Order not found");
		order.payment = payment;
		const result = await order.save();
		if (!result) return res.status(404).send("Order not saved");
		if (payment === "creditcard") {
			let amount = 0;
			order.products.forEach((element) => {
				amount += element.price * element.quantity;
			});
			const paymentIntent = await stripe.paymentIntents.create({
				amount: amount * 100,
				currency: "eur",
				// Verify your integration in this guide by including this parameter
				metadata: { integration_check: "accept_a_payment" },
			});
			console.log(paymentIntent);
			return res.send({ client_secret: paymentIntent.client_secret });
		}
		return res.send("Payment added");
	} catch (err) {
		debug(err);
		return res.status(404).send("Error");
	}
});

router.put("/status", auth("admin"), async (req, res) => {
	const { id, type } = req.decodedToken;
	const { status, orderId } = req.body;
	try {
		const order = await Order.model.findOne({ _id: orderId, userId: id });
		if (!order) return res.status(404).send("Order not found");
		order.status = status;
		const result = await order.save();
		if (!result) return res.status(404).send("Order not saved");
		return res.send("Status changed");
	} catch (err) {
		return res.status(404).send("Error");
	}
});

router.delete("/:orderId", auth("admin"), async (req, res) => {
	try {
		const result = await Order.model.findByIdAndDelete(req.params.orderId);
		if (result) {
			res.send("Success");
		} else throw Error("Erorr deleting user");
	} catch (err) {
		debug(err);
		res.status(404).send("Error deleting user");
	}
});

module.exports = router;
