import React, { useState, useEffect } from "react";
import { useLocation, useParams, useHistory } from "react-router-dom";
import { backend } from "../gateway";
import { CircularProgress, Typography, Button, TextField, Grid, Paper, FormControlLabel, Switch } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { NotificationManager } from "react-notifications";

const useStyles = makeStyles((theme) => ({
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

const Reset = () => {
	const classes = useStyles();

	const [uemail, setUemail] = useState("");
	const [utoken, setUtoken] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [sent, setSent] = useState(false);
	const { token, email } = useParams();
	const history = useHistory();

	const validateEmail = () => {
		if (email === "") return false;
		return !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
			String(email || uemail).toLowerCase()
		);
	};

	const sendEmail = () => {
		setLoading(true);
		backend
			.post("/reset", {
				email: email || uemail,
			})
			.then((response) => {
				if (response.status === 200 && response.statusText === "OK") {
					NotificationManager.success("Email sent", "Sucess", 3000);
					setSent(true);
				} else {
					NotificationManager.error("Failed to send email", "Error", 3000);
				}
			})
			.catch((err) => {
				console.log(err);
				NotificationManager.error("Network error", "Error", 3000);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const changePassword = () => {
		setLoading(true);
		backend
			.post("/reset/change", {
				email: email || uemail,
				token: token || utoken,
				newPassword,
			})
			.then((response) => {
				if (response.status === 200 && response.statusText === "OK") {
					NotificationManager.success("Password changed", "Sucess", 3000);
					history.push("/login");
				} else {
					NotificationManager.error("Failed to change password", "Error", 3000);
				}
			})
			.catch((err) => {
				console.log(err);
				NotificationManager.error("Network error", "Error", 3000);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<Grid container direction="row" justify="center" alignItems="center">
			<Paper elevation={3} className={classes.paper}>
				<div className={classes.form}>
					<Typography component="h1" variant="h5">
						Reset password
					</Typography>
					<TextField
						disabled={loading}
						error={validateEmail()}
						value={email || uemail}
						helperText=""
						id="outlined-basic"
						label="E-mail"
						variant="outlined"
						type="email"
						onChange={(e) => setUemail(e.target.value)}
					/>
					{sent || token ? (
						<>
							<TextField disabled={loading} value={token || utoken} label="Confirmation token" variant="outlined" onChange={(e) => setUtoken(e.target.value)} />
							<TextField disabled={loading} value={newPassword} label="New password" variant="outlined" type="password" onChange={(e) => setNewPassword(e.target.value)} />
							<Button disabled={loading} variant="contained" color="primary" onClick={changePassword}>
								{loading ? <CircularProgress size={20}></CircularProgress> : "CHANGE PASSWORD"}
							</Button>
						</>
					) : (
						<Button disabled={loading} variant="contained" color="primary" onClick={sendEmail}>
							{loading ? <CircularProgress size={20}></CircularProgress> : "SEND EMAIL"}
						</Button>
					)}
				</div>
			</Paper>
		</Grid>
	);
};

export default Reset;
