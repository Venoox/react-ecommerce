import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

const Login = ({ history, isAuth, setisAuth }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	useEffect(() => {
		if (localStorage.getItem("token")) {
			history.push("/dashboard");
		}
	}, [history]);

	const signIn = e => {
		e.preventDefault();

		fetch("http://172.22.151.216:8080/user/login", {
			method: "POST",
			cache: "no-cache",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		})
			.then(response => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then(data => {
				console.log(data);
				localStorage.setItem("token", data.token);
				setisAuth(true);
				history.push("/dashboard");
			})
			.catch(err => {
				console.log(err);
			});
	};

	return (
		<div>
			Email: <input type="text" onChange={e => setEmail(e.target.value)}></input>
			<br />
			Password: <input type="text" onChange={e => setPassword(e.target.value)}></input>
			<br />
			<button type="submit" onClick={signIn}>
				Login
			</button>
		</div>
	);
};

export default withRouter(Login);
