import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import { backend } from "../gateway";
import { AuthContext } from "../App";

import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress, Typography, Button, TextField, Grid, Paper } from "@material-ui/core";

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

const Register = () => {
	const history = useHistory();
	const classes = useStyles();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const signUp = e => {
		e.preventDefault();
		setLoading(true);
		if (password === repeatPassword) {
			backend.post("/user/register", { email, password }).then(response => {
				if (response.status === 200 && response.statusText === "OK") {
					console.log(response.data);
					setLoading(false);
					history.push("/login");
				} else {
					NotificationManager.error("Registration failed", "Error", 3000);
					setLoading(false);
					console.log(response.data);
				}
			});
		}
	};

	return (
		<Grid container direction="row" justify="center" alignItems="center">
			<Paper elevation={3} className={classes.paper}>
				<div className={classes.form}>
					<Typography component="h1" variant="h5">
						Sign Up
					</Typography>

					<TextField disabled={loading} id="outlined-basic" label="E-mail" variant="outlined" onChange={e => setEmail(e.target.value)} />
					<TextField disabled={loading} id="outlined-basic" label="Password" variant="outlined" type="password" onChange={e => setPassword(e.target.value)} />
					<TextField disabled={loading} id="outlined-basic" label="Repeat password" variant="outlined" type="password" onChange={e => setRepeatPassword(e.target.value)} />

					<Button disabled={loading} variant="contained" color="primary" onClick={signUp}>
						{loading ? <CircularProgress size={20}></CircularProgress> : "Register"}
					</Button>
				</div>
			</Paper>
		</Grid>
	);
};

export default Register;
