import React, { useContext } from "react";
import { useHistory, Switch, Route } from "react-router-dom";
import { makeStyles, List, Paper, Grid } from "@material-ui/core";
import { AuthContext } from "../App";
import withAuth from "../hoc/withAuth";
import AddProduct from "./AddProduct";
import AddCoupon from "./AddCoupon";
import ListItemLink from "./ListItemLink";
import AddOrder from "./AddOrder";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		margin: theme.spacing(3),
		width: 200,
	},
}));

const Admin = () => {
	const { state, dispatch } = useContext(AuthContext);
	const classes = useStyles();
	const history = useHistory();

	return (
		<>
			<Grid container direction="row" justify="flex-start" alignItems="flex-start">
				<Paper className={classes.paper}>
					<List component="nav">
						<ListItemLink primary="Home" to="/admin" />
						<ListItemLink primary="Products" to="/admin/products" />
						<ListItemLink primary="Orders" to="/admin/orders" />
						<ListItemLink primary="Users" to="/admin/users" />
						<ListItemLink primary="Coupons" to="/admin/coupons" />
					</List>
				</Paper>
				<Switch>
					<Route path="/admin/products">
						<AddProduct />
					</Route>
					<Route path="/admin/users"></Route>
					<Route path="/admin/coupons">
						<AddCoupon />
					</Route>
					<Route path="/admin/orders">
						<AddOrder />
					</Route>
					<Route path="/admin">
						<div>Email: {}</div>
					</Route>
				</Switch>
			</Grid>
		</>
	);
};

export default Admin;
