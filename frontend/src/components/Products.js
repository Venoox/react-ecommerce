import React, { useState, useEffect, useContext } from "react";
import { makeStyles, Grid, Paper, GridList, GridListTile, Button } from "@material-ui/core";
import { backend } from "../gateway";

import { AuthContext } from "../App";

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		marginLeft: theme.spacing(3),
	},
	paper: {
		margin: theme.spacing(5),
		textAlign: "center",
	},
}));

const Products = () => {
	const [products, setProducts] = useState([]);
	const { state } = useContext(AuthContext);
	const classes = useStyles();

	useEffect(() => {
		backend.get("/product/all").then(response => {
			if (response.status === 200 && response.statusText === "OK") {
				setProducts(response.data);
			}
		});
	}, []);

	const addToCart = i => {
		if (state.isAuth) {
			backend
				.post("/cart/add", {
					productId: products[i]._id,
					quantity: 1,
				})
				.then(response => {
					if (response.status === 200 && response.statusText === "OK") {
					}
				});
		}
	};

	return (
		<GridList cols={5}>
			{products.map((product, index) => (
				<Paper key={product._id} className={classes.paper}>
					<img src={"http://172.26.186.93:8080/" + product.image} alt={product.name} width={128} height={128}></img>
					<div>Name: {product.name}</div>
					<div>Price: {product.price}</div>
					<Button variant="contained" color="primary" onClick={() => addToCart(index)}>
						Add to cart
					</Button>
				</Paper>
			))}
		</GridList>
	);
};

export default Products;
