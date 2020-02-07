import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "./App.scss";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Register from "./components/Register";
import Logout from "./components/Logout";

const App = () => {
	const [isAuth, setisAuth] = useState(false);

	useEffect(() => {
		if (localStorage.getItem("token")) {
			setisAuth(true);
		} else {
			setisAuth(false);
		}
	}, []);

	return (
		<BrowserRouter>
			<div>
				<nav>
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/dashboard">Dashboard</Link>
						</li>
						{isAuth ? (
							<li>
								<Link to="/logout">Logout</Link>
							</li>
						) : (
							<>
								<li>
									<Link to="/login">Login</Link>
								</li>
								<li>
									<Link to="/register">Register</Link>
								</li>
							</>
						)}
					</ul>
				</nav>

				{/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
				<Switch>
					<Route path="/login">
						<Login isAuth={isAuth} setisAuth={setisAuth} />
					</Route>
					<Route path="/register">
						<Register isAuth={isAuth} />
					</Route>
					<Route path="/logout">
						<Logout isAuth={isAuth} setisAuth={setisAuth} />
					</Route>
					<Route path="/dashboard">
						<Dashboard isAuth={isAuth} />
					</Route>
					<Route path="/">
						<Home isAuth={isAuth} />
					</Route>
				</Switch>
			</div>
		</BrowserRouter>
	);
};

export default App;
