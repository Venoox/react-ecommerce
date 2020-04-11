import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, Tooltip, IconButton, Avatar, Grid, Paper, TextField, Button, InputLabel, Select, MenuItem, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

import { NotificationManager } from "react-notifications";

import { AuthContext } from "../App";
import { CartContext } from "../App";
import withAuth from "../hoc/withAuth";
import { backend } from "../gateway";
import CartItem from "./CartItem";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: 16,
	},
	table: {
		marginTop: 20,
	},
	large: {
		width: theme.spacing(7),
		height: theme.spacing(7),
	},
}));

const Cart = () => {
	const { cart, setCart } = useContext(CartContext);
	const classes = useStyles();
	const history = useHistory();

	useEffect(() => {
		backend.get("/cart").then((response) => {
			if (response.status === 200 && response.statusText === "OK") {
				setCart(response.data);
			}
		});
	}, []);

	const subtotal = () => {
		let total = 0;
		cart.forEach((product) => {
			total += product.price * product.quantity;
		});
		return total;
	};

	const changeQuantity = (newQuantity, index) => {
		backend
			.put("/cart/change", {
				productId: cart[index].productId,
				quantity: newQuantity,
			})
			.then((response) => {
				if (response.status === 200 && response.statusText === "OK") {
					setCart(
						cart.map((product, i) => {
							if (i === index) return { ...product, quantity: newQuantity };
							return product;
						})
					);
				} else {
					NotificationManager.error("Error changing quantity", "Error", 3000);
				}
			})
			.catch((err) => {
				console.log(err);
				NotificationManager.error("Error changing quantity", "Error", 3000);
			});
	};

	const removeProduct = (index) => {
		backend
			.delete("/cart/remove/" + cart[index].productId)
			.then((response) => {
				if (response.status === 200 && response.statusText === "OK") {
					setCart(
						cart.filter((product, i) => {
							if (i === index) return false;
							return true;
						})
					);
				} else {
					NotificationManager.error("Error removing from cart", "Error", 3000);
				}
			})
			.catch((err) => {
				console.log(err);
				NotificationManager.error("Error removing from cart", "Error", 3000);
			});
	};

	const clearAll = () => {
		backend
			.delete("/cart/clear")
			.then((response) => {
				if (response.status === 200 && response.statusText === "OK") {
					setCart([]);
				} else {
					NotificationManager.error("Error clearing cart", "Error", 3000);
				}
			})
			.catch((err) => {
				console.log(err);
				NotificationManager.error("Error clearing cart", "Error", 3000);
			});
	};

	return (
		<Grid container direction="column" justify="center" alignItems="center">
			<Paper style={{ marginTop: 100 }}>
				<Grid style={{ minHeight: "3a0rem", minWidth: "50rem" }} container direction="column" justify="space-around" alignItems="center" className={classes.root}>
					<Grid container direction="column" justify="center" alignItems="center">
						<Avatar className={classes.large}>
							<ShoppingCartIcon color="primary" fontSize="large" />
						</Avatar>
						<Typography variant="h4">Cart</Typography>
					</Grid>
					<TableContainer className={classes.table} component={Paper}>
						<Table aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell>Product</TableCell>
									<TableCell align="right">Quantity</TableCell>
									<TableCell align="right">Price</TableCell>
									<TableCell align="right"></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{cart.map((product, index) => (
									<TableRow key={product.productId}>
										<TableCell component="th" scope="row">
											{product.name}
										</TableCell>
										<TableCell align="right">
											{product.quantity < 10 ? (
												<Select value={product.quantity} onChange={(e) => changeQuantity(e.target.value, index)}>
													<MenuItem value={1}>1</MenuItem>
													<MenuItem value={2}>2</MenuItem>
													<MenuItem value={3}>3</MenuItem>
													<MenuItem value={4}>4</MenuItem>
													<MenuItem value={5}>5</MenuItem>
													<MenuItem value={6}>6</MenuItem>
													<MenuItem value={7}>7</MenuItem>
													<MenuItem value={8}>8</MenuItem>
													<MenuItem value={9}>9</MenuItem>
													<MenuItem value={10}>10+</MenuItem>
												</Select>
											) : (
												<TextField
													style={{ width: 50 }}
													type="number"
													inputProps={{ min: 1 }}
													value={product.quantity}
													onChange={(e) => changeQuantity(e.target.value, index)}
													InputLabelProps={{
														shrink: true,
													}}
												/>
											)}
										</TableCell>
										<TableCell align="right">{Number(product.price * product.quantity).toFixed(2)} €</TableCell>
										<TableCell align="right">
											<Tooltip title="Delete">
												<IconButton aria-label="delete" onClick={() => removeProduct(index)}>
													<DeleteIcon />
												</IconButton>
											</Tooltip>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<Typography style={{ margin: "20px 0" }} variant="h5">
						Total Price: {subtotal().toFixed(2)} €
					</Typography>

					<Grid container justify="space-around" alignItems="center">
						<Button variant="contained" color="primary" onClick={clearAll}>
							Clear all
						</Button>
						<Button variant="contained" color="primary" onClick={() => history.push("/checkout")}>
							Buy
						</Button>
					</Grid>
				</Grid>
			</Paper>
		</Grid>
	);
};

export default Cart;
