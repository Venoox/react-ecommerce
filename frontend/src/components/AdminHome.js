import React from "react";
import { Typography, Paper, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		margin: theme.spacing(3),
		width: 800,
	},
}));

const AdminHome = () => {
	const classes = useStyles();

	return (
		<Paper className={classes.paper}>
			<Typography variant="h5">Statistics</Typography>
		</Paper>
	);
};

export default AdminHome;
