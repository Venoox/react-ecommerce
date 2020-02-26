const express = require("express");
const debug = require("debug")("backend:product");
const router = express.Router();
const multer = require("multer");

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

const Product = require("../models/product.model");

router.get("/all", async (req, res) => {
	try {
		const products = await Product.model.find({});
		if (products) {
			res.json(products);
		} else {
			throw Error("Error listing products");
		}
	} catch (err) {
		debug(err);
		res.status(400).send("Error listing products");
	}
});

router.get("/:id", async (req, res) => {
	try {
		const product = await Product.model.findById({ _id: req.params.id });
		if (product) {
			res.json(product);
		} else {
			throw Error("Product not found");
		}
	} catch (err) {
		debug(err);
		res.status(400).send("Error listing products");
	}
});

router.post("/create", upload.single("avatar"), async (req, res) => {
	try {
		debug(req.file);
		const { name, price } = req.body;
		const image = (req.file && req.file.path) || "uploads/default.jpeg";

		const product = await Product.model.create({ name, price, image });
		if (product) {
			debug(product);
			res.json(product);
		} else {
			throw Error("Error creating product");
		}
	} catch (err) {
		debug(err);
		res.status(400).send("Error creating product");
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const result = await Product.model.findByIdAndDelete(req.params.id);
		if (result) {
			res.send("Successfully removed");
		} else {
			throw Error("Product to remove not found");
		}
	} catch (err) {
		debug(err);
		res.status(400).send("Error removing");
	}
});

module.exports = router;
