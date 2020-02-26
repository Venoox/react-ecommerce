import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../App";

import { backend } from "../gateway";

const withAuth = Component => props => {
	const history = useHistory();
	const { state, dispatch } = useContext(AuthContext);

	/*useEffect(() => {
		if (!backend.defaults.headers.common["Authorization"]) {
			if (localStorage.getItem("token")) {
				backend.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");
				backend.get("/user/check").then(response => {
					if (response.status === 200 && response.statusText === "OK") {
						dispatch({ type: "LOGIN", payload: { user: response.data } });
					} else {
						history.push("/");
					}
				});
			} else {
				history.push("/");
			}
		} else {
			backend.get("/user/check").then(response => {
				if (response.status === 200 && response.statusText === "OK") {
					dispatch({ type: "LOGIN", paylaod: { user: response.data } });
				} else {
					history.push("/");
				}
			});
		}
	}, []);*/

	if (!state.isAuth) {
		history.push("/login");
	}

	return state.isAuth ? <Component {...props} /> : null;
};

export default withAuth;
