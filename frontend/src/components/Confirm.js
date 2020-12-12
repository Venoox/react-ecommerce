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
		width: 400,
	},
}));

const Confirm = () => {
	const classes = useStyles();

	const [confirmed, setConfirmed] = useState(false);
	const [loading, setLoading] = useState(false);
	const { token, id } = useParams();
	const history = useHistory();

	useEffect(() => {
		setLoading(true);
		backend
			.post("/user/confirm", {
				_id: id,
				confirmation_token: token,
			})
			.then((response) => {
				if (response.status === 200 && response.statusText === "OK") {
					setConfirmed(true);
				}
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [setConfirmed, setLoading]);

	return (
		<Grid container direction="row" justify="center" alignItems="center">
			<Paper elevation={3} className={classes.paper}>
				<div className={classes.form}>
					{loading ? <Typography>Loading...</Typography> : confirmed ? <Typography>E-mail is confirmed. You can login now!</Typography> : <Typography>Error confirming e-mail!</Typography>}
				</div>
			</Paper>
		</Grid>
	);
};

export default Confirm;
