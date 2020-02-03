const express = require("express");
const debug = require("debug")("backend:product");
const router = express.Router();

const Product = require("../models/product.model");

router.get("/", (req, res) => {});

router.post("/", (req, res) => {});

module.exports = router;
