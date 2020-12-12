import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, Button, Paper, IconButton, InputBase, Divider } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import DirectionsIcon from "@material-ui/icons/Directions";
import Logout from "./Logout";
import { AuthContext } from "../App";
import { backend } from "../gateway";

const useStyles = makeStyles((theme) => ({
	root: {},
	navigationButtons: {
		marginLeft: theme.spacing(3),
	},
	button: {
		marginLeft: 5,
		marginRight: 5,
	},
}));

const NavBar = () => {
	const classes = useStyles();
	const history = useHistory();
	const [search, setSearch] = useState("");
	const { state, dispatch } = useContext(AuthContext);

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<Typography className={classes.button} variant="h6">
						Webstore
					</Typography>
					<div>
						<Button className={classes.button} color="inherit" onClick={() => history.push("/")}>
							Home
						</Button>
						<Button className={classes.button} color="inherit" onClick={() => history.push("/products")}>
							Products
						</Button>
					</div>
					<div className={classes.navigationButtons}>
						<Paper component="form" style={{ display: "flex", alignItems: "center" }}>
							<InputBase style={{ marginLeft: 10 }} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" inputProps={{ "aria-label": "search google maps" }} />
							<IconButton aria-label="search" onClick={(e) => history.push("/products/" + search)}>
								<SearchIcon />
							</IconButton>
						</Paper>
					</div>
					<div style={{ flexGrow: 1 }}></div>
					<div>
						{state.isAuth ? (
							<>
								<Button className={classes.button} color="inherit" onClick={() => history.push("/cart")}>
									Cart
								</Button>
								{state.user.type === "admin" ? (
									<Button className={classes.button} color="inherit" onClick={() => history.push("/admin")}>
										Admin
									</Button>
								) : null}
								<Button className={classes.button} color="inherit" onClick={() => history.push("/dashboard")}>
									Dashboard
								</Button>
								<Button
									color="inherit"
									className={classes.button}
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
								<Button className={classes.button} color="inherit" onClick={() => history.push("/cart")}>
									Cart
								</Button>
								<Button className={classes.button} color="inherit" onClick={() => history.push("/login")}>
									Login
								</Button>
								<Button className={classes.button} color="inherit" onClick={() => history.push("/register")}>
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
