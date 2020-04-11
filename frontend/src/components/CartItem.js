import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, Tooltip, IconButton, Paper, TextField, Button, InputLabel, Select, MenuItem } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { NotificationManager } from "react-notifications";

import { AuthContext } from "../App";
import withAuth from "../hoc/withAuth";
import { backend } from "../gateway";

const CartItem = ({ product, index, changeQuantity, removeProduct }) => {
	return (
		<div>
			{product.name}
			<label> Quantity: </label>
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
					type="number"
					value={product.quantity}
					onChange={(e) => changeQuantity(e.target.value, index)}
					InputLabelProps={{
						shrink: true,
					}}
				/>
			)}
			<label>Price: </label>
			{Number(product.price * product.quantity).toFixed(2)} €
			<Tooltip title="Delete">
				<IconButton aria-label="delete" onClick={() => removeProduct(index)}>
					<DeleteIcon />
				</IconButton>
			</Tooltip>
		</div>
	);
};

export default CartItem;
