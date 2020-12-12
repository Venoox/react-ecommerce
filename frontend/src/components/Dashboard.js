import React, { useContext } from "react";
import { useHistory, Switch, Route } from "react-router-dom";
import { makeStyles, List, Paper, Grid } from "@material-ui/core";
import { AuthContext } from "../App";
import withAuth from "../hoc/withAuth";
import AddProduct from "./AddProduct";
import AddCoupon from "./AddCoupon";
import ListItemLink from "./ListItemLink";
import Account from "./Account";
import Orders from "./Orders";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		margin: theme.spacing(3),
		width: 200,
	},
}));

const Dashboard = () => {
	const { state, dispatch } = useContext(AuthContext);
	const classes = useStyles();
	const history = useHistory();

	return (
		<>
			<Grid container direction="row" justify="flex-start" alignItems="flex-start">
				<Paper className={classes.paper}>
					<List component="nav" aria-label="secondary mailbox folders">
						<ListItemLink primary="Account" to="/dashboard" />
						<ListItemLink primary="Addresses" to="/dashboard/address" />
						<ListItemLink primary="Orders" to="/dashboard/orders" />
					</List>
				</Paper>

				<Switch>
					<Route path="/dashboard/orders">
						<Orders />
					</Route>
					<Route path="/dashboard">
						<Account />
					</Route>
				</Switch>
			</Grid>
		</>
	);
};

export default withAuth(Dashboard);
