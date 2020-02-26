import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Tooltip, IconButton, Paper, TextField } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { NotificationManager } from "react-notifications";

import { AuthContext } from "../App";
import withAuth from "../hoc/withAuth";
import { backend } from "../gateway";

const Cart = () => {
	const [cart, setCart] = useState([]);

	useEffect(() => {
		backend.get("/cart").then(response => {
			if (response.status === 200 && response.statusText === "OK") {
				setCart(response.data);
			}
		});
	}, []);

	const changeQuantity = (newQuantity, index) => {
		backend
			.put("/cart/change", {
				productId: cart[index].productId,
				quantity: newQuantity,
			})
			.then(response => {
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
			.catch(err => {
				console.log(err);
				NotificationManager.error("Error changing quantity", "Error", 3000);
			});
	};

	const removeProduct = index => {
		backend
			.delete("/cart/remove/" + cart[index].productId)
			.then(response => {
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
			.catch(err => {
				console.log(err);
				NotificationManager.error("Error removing from cart", "Error", 3000);
			});
	};

	return (
		<>
			{cart.map((product, index) => (
				<Paper key={product.productId}>
					Name: {product.name}
					<TextField
						label="Quantity"
						type="number"
						value={product.quantity}
						onChange={e => changeQuantity(e.target.value, index)}
						InputLabelProps={{
							shrink: true,
						}}
					/>
					Price: {Number(product.price * product.quantity).toFixed(2)}$
					<Tooltip title="Delete">
						<IconButton aria-label="delete" onClick={() => removeProduct(index)}>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</Paper>
			))}
		</>
	);
};

export default withAuth(Cart);
