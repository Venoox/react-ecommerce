import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";

const Logout = ({ history, isAuth, setisAuth }) => {
	useEffect(() => {
		fetch("http://172.22.151.216:8080/user/delete", {
			method: "DELETE",
			cache: "no-cache",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ token: localStorage.getItem("token") }),
		})
			.then(response => {
				if (!response.ok) {
					throw new Error("Network error");
				} else {
					setisAuth(false);
					localStorage.removeItem("token");
					history.push("/");
				}
			})
			.catch(err => {
				console.log(err);
			});
	}, []);
	return null;
};

export default withRouter(Logout);
