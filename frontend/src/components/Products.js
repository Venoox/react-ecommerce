import React, { useState, useEffect, useContext } from "react";
import { makeStyles, Grid, Paper, GridList, GridListTile, Button } from "@material-ui/core";
import { backend } from "../gateway";
import { useHistory, useLocation } from "react-router-dom";

import Pagination from "@material-ui/lab/Pagination";

import { NotificationManager } from "react-notifications";

import { AuthContext } from "../App";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		marginLeft: theme.spacing(3),
	},
	productgrid: {
		margin: "20px",
		display: "grid",
		gridTemplateColumns: "1fr 1fr 1fr 1fr",
		gridTemplateRows: "1fr 1fr 1fr",
		gap: "40px 100px",
	},
	addbutton: {
		margin: "10px 0",
	},
	paper: {
		textAlign: "center",
		"&:hover": {
			cursor: "pointer",
		},
	},
}));

const Products = () => {
	const [products, setProducts] = useState([]);
	const [page, setPage] = useState(1);
	const [count, setCount] = useState(1);
	const { state } = useContext(AuthContext);
	const classes = useStyles();
	const history = useHistory();

	useEffect(() => {
		backend.get("/product/pages").then((response) => {
			if (response.status === 200 && response.statusText === "OK") {
				setCount(response.data.pages);
			}
		});
	}, []);

	useEffect(() => {
		backend.get("/product/page/" + page).then((response) => {
			if (response.status === 200 && response.statusText === "OK") {
				setProducts(response.data);
			}
		});
	}, [page]);

	const addToCart = (i) => {
		if (state.isAuth) {
			backend
				.post("/cart/add", {
					productId: products[i]._id,
					quantity: 1,
				})
				.then((response) => {
					if (response.status === 200 && response.statusText === "OK") {
						NotificationManager.success("Added to cart", "Success", 3000);
					}
				});
		} else {
			let cart = localStorage.getItem("cart");
			if (cart === null) cart = [];
			else cart = JSON.parse(cart);
			cart.push({
				productId: products[i]._id,
				quantity: 1,
			});
			localStorage.setItem("cart", JSON.stringify(cart));
		}
	};

	const clickHandler = (e, i) => {
		if (e.target.textContent === "Add to cart") {
			addToCart(i);
		} else {
			history.push("/product/" + products[i]._id);
		}
	};

	return (
		<Grid container direction="column">
			<div className={classes.productgrid}>
				{products.map((product, index) => (
					<Paper key={product._id} className={classes.paper} onClick={(e) => clickHandler(e, index)}>
						<img src={process.env.REACT_APP_API + product.image} alt="" width={128} height={128} style={{ marginTop: "10px" }}></img>
						<div>{product.name}</div>
						<div>Price: {Number(product.price).toFixed(2)} €</div>
						<Button variant="contained" color="primary" className={classes.addbutton}>
							Add to cart
						</Button>
					</Paper>
				))}
			</div>

			<Grid item style={{ alignSelf: "center" }}>
				<Pagination count={count} page={page} onChange={(event, value) => setPage(value)} />
			</Grid>
		</Grid>
	);
};

export default Products;
