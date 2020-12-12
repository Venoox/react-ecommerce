const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const couponRouter = require("./routes/coupon");
const ratingRouter = require("./routes/rating");
const orderRouter = require("./routes/order");
const resetRouter = require("./routes/reset");

const app = express();

const whitelist = ["http://localhost:3000"];
const options = {
	origin: whitelist,
};

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(options));
app.options("*", cors(options));
app.use(helmet());
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'", "stripe.com"],
		},
	})
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/coupon", couponRouter);
app.use("/rating", ratingRouter);
app.use("/order", orderRouter);
app.use("/reset", resetRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	res.status(err.status || 500).json({
		message: err.message,
	});
});

module.exports = app;
