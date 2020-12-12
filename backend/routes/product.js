const express = require("express");
const debug = require("debug")("backend:product");
const router = express.Router();
const multer = require("multer");

const Product = require("../models/product.model");
const Cart = require("../models/cart.model");

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

router.get("/newest", async (req, res) => {
	try {
		const newest = await Product.model
			.find({})
			.sort({ createdAt: "desc" })
			.limit(4);
		if (!newest) return res.status(404).send("Error");
		res.json(newest);
	} catch (err) {
		debug(err);
		res.status(400).send("Error listing products");
	}
});

router.get("/pages", async (req, res) => {
	try {
		const count = await Product.model.countDocuments({});
		if (count) {
			res.json({ pages: Math.ceil(count / 12) });
		} else {
			throw Error("Error listing products");
		}
	} catch (err) {
		debug(err);
		res.status(400).send("Error listing products");
	}
});

router.get("/page/:page/:search?", async (req, res) => {
	try {
		if (req.params.page === "all") {
			const products = await Product.model.find({});
			if (!products) return res.status(404).send("No products");

			res.json(products);
		} else {
			const { search } = req.params;
			if (search !== undefined) {
				const products = await Product.model.paginate({ $text: { $search: search } }, { page: req.params.page, limit: 12 });
				if (!products) return res.status(404).send("No products");
				console.log(products);
				res.json(products.docs);
			} else {
				const products = await Product.model.paginate({}, { page: req.params.page, limit: 12 });
				if (!products) return res.status(404).send("No products");
				res.json(products.docs);
			}
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

router.post("/create", upload.single("product"), async (req, res) => {
	try {
		debug(req.file);
		const { name, description, price } = req.body;
		const image = (req.file && req.file.path) || "uploads/default.jpeg";

		const product = await Product.model.create({ name, price, description, image });
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

router.put("/update", upload.single("product"), async (req, res) => {
	//const { id: userId, type } = req.decodedToken;
	const { productId, name, description, price } = req.body;
	const image = (req.file && req.file.path) || null;
	try {
		const result = await Product.model.findById(productId);
		if (result) {
			if (name) result.name = name;
			if (price) result.price = price;
			if (image) result.image = image;
			if (description) result.description = description;
			const saved = await result.save();
			if (saved) res.send("Modified product");
			else throw Error("Error modifying product");
		} else throw Error("Error modifying product");
	} catch (err) {
		debug(err);
		res.status(400).send("Error modifying product");
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const result = await Product.model.findByIdAndDelete(id);
		if (!result) return res.status(404).send("Product not found");
		await Cart.model.deleteMany({ productId: id });
		res.send("Successfully removed");
	} catch (err) {
		debug(err);
		res.status(400).send("Error removing");
	}
});

module.exports = router;
