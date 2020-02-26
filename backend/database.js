const debug = require("debug")("backend:database");
const mongoose = require("mongoose");
require("dotenv").config();
const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;

module.exports = () => {
	mongoose.connect(
		`mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`,
		{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false },
		() => {
			debug("Database connected...");
		}
	);

	mongoose.connection.on("disconnected", () => debug("Database disconnected..."));
	mongoose.connection.on("reconnected", () => debug("Reconnected to MongoDB..."));
	mongoose.connection.on("reconnectFailed", () => {
		debug("MongoDB reconnect failed... Terminating...");
		process.exit(2);
	});
	mongoose.connection.on("error", e => {
		debug(e);
		if (e.name === "MongoNetworkError") process.exit(2); // Connection failed on initial connect
	});
};
