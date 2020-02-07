import React, { useState } from "react";
import { withRouter } from "react-router-dom";

const Register = ({ history, isAuth }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");

	const signUp = e => {
		e.preventDefault();
		if (password === repeatPassword) {
			fetch("http://172.22.151.216:8080/user/register", {
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
					history.push("/login");
				})
				.catch(err => {
					console.log(err);
				});
		}
	};

	return (
		<div>
			Email: <input type="text" onChange={e => setEmail(e.target.value)} />
			<br />
			Password: <input type="text" onChange={e => setPassword(e.target.value)} />
			<br />
			Repeat password: <input type="text" onChange={e => setRepeatPassword(e.target.value)} />
			<br />
			<button type="submit" onClick={signUp}>
				Register
			</button>
		</div>
	);
};

export default withRouter(Register);
