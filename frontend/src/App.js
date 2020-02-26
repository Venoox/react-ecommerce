import React, { useReducer } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { NotificationContainer } from "react-notifications";

import "./App.scss";
import "react-notifications/lib/notifications.css";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Register from "./components/Register";
import NavBar from "./components/NavBar";
import Products from "./components/Products";

import Grid from "@material-ui/core/Grid";
import Cart from "./components/Cart";

export const AuthContext = React.createContext();

const initialState = {
	isAuth: false,
	user: null,
};
const reducer = (state, action) => {
	switch (action.type) {
		case "LOGIN":
			localStorage.setItem("token", action.payload.token);
			return {
				...state,
				isAuth: true,
				user: action.payload.user,
			};
		case "LOGOUT":
			localStorage.removeItem("token");
			return {
				...state,
				isAuth: false,
				user: null,
			};
		default:
			return state;
	}
};

const App = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<BrowserRouter>
			<AuthContext.Provider value={{ state, dispatch }}>
				<Grid container direction="column">
					<NavBar />
					<Switch>
						<Route exact path="/login">
							<Login />
						</Route>
						<Route exact path="/products">
							<Products />
						</Route>
						<Route exact path="/register">
							<Register />
						</Route>
						<Route exact path="/dashboard">
							<Dashboard />
						</Route>
						<Route exact path="/cart">
							<Cart />
						</Route>
						<Route exact path="/">
							<Home />
						</Route>
					</Switch>

					<NotificationContainer />
				</Grid>
			</AuthContext.Provider>
		</BrowserRouter>
	);
};

export default App;
