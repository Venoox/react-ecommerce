const axios = require("axios");

export const backend = axios.create({
	baseURL: "http://172.26.186.93:8080",
	headers: {
		"Content-Type": "application/json",
	},
});
