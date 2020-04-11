import React from "react";
import { Paper } from "@material-ui/core";

const CheckoutItem = ({ product }) => {
	return (
		<Paper>
			<label> Name: </label>
			{product.name}
			<label> Quantity: </label>
			{product.quantity}
			<label> Price: </label>
			{Number(product.price * product.quantity).toFixed(2)} €
		</Paper>
	);
};

export default CheckoutItem;
