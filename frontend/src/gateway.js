const axios = require("axios");

export const backend = axios.create({
	baseURL: process.env.REACT_APP_API,
	headers: {
		"Content-Type": "application/json",
	},
});
