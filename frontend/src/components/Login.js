import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import { NotificationManager } from "react-notifications";

import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress, Typography, Button, TextField, Grid, Paper } from "@material-ui/core";

import { backend } from "../gateway";
import { AuthContext } from "../App";

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
	form: {
		margin: theme.spacing(3),
		"& > *": {
			margin: theme.spacing(0.5),
		},
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	paper: {
		marginTop: theme.spacing(3),
		width: 300,
	},
}));

const Login = () => {
	const classes = useStyles();
	const history = useHistory();
	const { state, dispatch } = useContext(AuthContext);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const signIn = e => {
		e.preventDefault();
		if (email.length < 1 || password.length < 1) {
			NotificationManager.error("Email or password too short", "Error", 3000);
			return;
		}
		setLoading(true);
		backend
			.post("/user/login", { email, password })
			.then(response => {
				if (response.status === 200 && response.statusText === "OK") {
					localStorage.setItem("token", response.data.token);
					backend.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
					dispatch({ type: "LOGIN", payload: response.data });
					history.push("/dashboard");
				} else {
					throw new Error("Network response was not ok");
				}
			})
			.catch(err => {
				setLoading(false);
				NotificationManager.error("Wrong password or email", "Error", 3000);
				console.log(err);
			});
	};

	const validateEmail = () => {
		if (email === "") return false;
		return !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase());
	};

	return (
		<Grid container direction="row" justify="center" alignItems="center">
			<Paper elevation={3} className={classes.paper}>
				<div className={classes.form}>
					<Typography component="h1" variant="h5">
						Sign In
					</Typography>
					<TextField
						disabled={loading}
						error={validateEmail()}
						value={email}
						helperText=""
						id="outlined-basic"
						label="E-mail"
						variant="outlined"
						type="email"
						onChange={e => setEmail(e.target.value)}
					/>
					<TextField disabled={loading} id="outlined-basic" label="Password" variant="outlined" type="password" onChange={e => setPassword(e.target.value)} />

					<Button disabled={loading} variant="contained" color="primary" onClick={signIn}>
						{loading ? <CircularProgress size={20}></CircularProgress> : "Login"}
					</Button>
				</div>
			</Paper>
		</Grid>
	);
};

export default Login;
