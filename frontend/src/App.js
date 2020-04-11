import React, { useReducer, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { NotificationContainer } from "react-notifications";

import "./App.scss";
import "react-notifications/lib/notifications.css";

import Login from "./components/Login";
import Admin from "./components/Admin";
import Home from "./components/Home";
import Register from "./components/Register";
import NavBar from "./components/NavBar";
import Products from "./components/Products";
import Product from "./components/Product";

import Grid from "@material-ui/core/Grid";
import Cart from "./components/Cart";

import { backend } from "./gateway";
import Checkout from "./components/Checkout";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Dashboard from "./components/Dashboard";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe("pk_test_FwNdOZHOf7ZqsBYrrLpwgcmX00zSThiPJG");

export const AuthContext = React.createContext();
export const CartContext = React.createContext();

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
		case "REFRESH":
			return {
				...state,
				isAuth: true,
				user: action.payload.user,
			};
		default:
			return state;
	}
};

const App = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [cart, setCart] = useState([]);

	useEffect(() => {
		if (!backend.defaults.headers.common["Authorization"]) {
			if (localStorage.getItem("token")) {
				backend.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");
				backend.get("/user/check").then((response) => {
					if (response.status === 200 && response.statusText === "OK") {
						dispatch({ type: "REFRESH", payload: response.data });
					}
				});
			}
		} else {
			backend.get("/user/check").then((response) => {
				if (response.status === 200 && response.statusText === "OK") {
					dispatch({ type: "REFRESH", payload: response.data });
				}
			});
		}
	}, []);

	return (
		<BrowserRouter>
			<Elements stripe={stripePromise}>
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<AuthContext.Provider value={{ state, dispatch }}>
						<CartContext.Provider value={{ cart, setCart }}>
							<Grid container direction="column">
								<NavBar />
								<Switch>
									<Route path="/login">
										<Login />
									</Route>
									<Route path="/products">
										<Products />
									</Route>
									<Route path="/product/:productId">
										<Product />
									</Route>
									<Route path="/register">
										<Register />
									</Route>
									<Route path="/admin">
										<Admin />
									</Route>
									<Route path="/cart">
										<Cart />
									</Route>
									<Route path="/checkout">
										<Checkout />
									</Route>
									<Route path="/dashboard">
										<Dashboard />
									</Route>
									<Route path="/">
										<Home />
									</Route>
								</Switch>

								<NotificationContainer />
							</Grid>
						</CartContext.Provider>
					</AuthContext.Provider>
				</MuiPickersUtilsProvider>
			</Elements>
		</BrowserRouter>
	);
};

export default App;
