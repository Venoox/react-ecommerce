import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";

import Logout from "./Logout";
import { AuthContext } from "../App";
import { backend } from "../gateway";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	navigationButtons: {
		flexGrow: 1,
		marginLeft: theme.spacing(3),
	},
}));

const NavBar = () => {
	const classes = useStyles();
	const history = useHistory();
	const { state, dispatch } = useContext(AuthContext);

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6">Webstore</Typography>
					<div className={classes.navigationButtons}>
						<Button color="inherit" onClick={() => history.push("/")}>
							Home
						</Button>
						<Button color="inherit" onClick={() => history.push("/products")}>
							Products
						</Button>
					</div>
					<div>
						{state.isAuth ? (
							<>
								<Button color="inherit" onClick={() => history.push("/cart")}>
									Cart
								</Button>
								{state.user.type === "admin" ? (
									<Button color="inherit" onClick={() => history.push("/admin")}>
										Admin
									</Button>
								) : null}
								<Button color="inherit" onClick={() => history.push("/dashboard")}>
									Dashboard
								</Button>
								<Button
									color="inherit"
									onClick={() => {
										Logout();
										dispatch({ type: "LOGOUT" });
										history.push("/");
									}}
								>
									Logout
								</Button>
							</>
						) : (
							<>
								<Button color="inherit" onClick={() => history.push("/login")}>
									Login
								</Button>
								<Button color="inherit" onClick={() => history.push("/register")}>
									Register
								</Button>
							</>
						)}
					</div>
				</Toolbar>
			</AppBar>
		</div>
	);
};

export default NavBar;
