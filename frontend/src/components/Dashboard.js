import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

const Dashboard = ({ history, isAuth }) => {
	const [email, setEmail] = useState("");

	useEffect(() => {
		if (isAuth) {
			fetch("http://172.22.151.216:8080/user", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ token: localStorage.getItem("token") }),
			})
				.then(response => {
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					return response.json();
				})
				.then(data => {
					console.log(data);
					setEmail(data.email);
				})
				.catch(err => {
					setEmail("Error loading");
				});
		}
	}, [history]);

	if (!isAuth) {
		history.push("/");
		return null;
	} else {
		return <div>Email: {email}</div>;
	}
};

export default withRouter(Dashboard);
