import React, { useContext, useState } from "react";
import { Paper, TextField, Grid, Button, makeStyles, Stepper, Step, StepLabel } from "@material-ui/core";
import { CartContext } from "../App";
import CheckoutItem from "./CheckoutItem";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		marginLeft: theme.spacing(3),
	},
	paper: {
		marginTop: theme.spacing(5),
		width: "50%",
		textAlign: "center",
	},
	table: {
		margin: theme.spacing(5),
		width: "auto",
	},
}));

const CheckoutPreview = () => {
	const classes = useStyles();
	const { cart } = useContext(CartContext);

	const subtotal = () => {
		let total = 0;
		cart.forEach((product) => {
			total += product.price * product.quantity;
		});
		return total;
	};

	return (
		<TableContainer className={classes.table} component={Paper}>
			<Table aria-label="spanning table">
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell align="right">Quantity</TableCell>
						<TableCell align="right">Price / Unit</TableCell>
						<TableCell align="right">Price</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{cart.map((product) => (
						<TableRow>
							<TableCell>{product.name}</TableCell>
							<TableCell align="right">{product.quantity}</TableCell>
							<TableCell align="right">{Number(product.price).toFixed(2)} €</TableCell>
							<TableCell align="right">{Number(product.price * product.quantity).toFixed(2)} €</TableCell>
						</TableRow>
					))}

					<TableRow>
						<TableCell rowSpan={3} />
						<TableCell colSpan={2}>Total</TableCell>
						<TableCell align="right">{subtotal().toFixed(2)} €</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default CheckoutPreview;
