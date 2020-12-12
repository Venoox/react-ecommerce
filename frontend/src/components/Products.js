import React, { useState, useEffect, useContext } from "react";
import { makeStyles, Grid, Paper, GridList, GridListTile, Button, Select, MenuItem, InputLabel, Typography } from "@material-ui/core";
import { backend } from "../gateway";
import { useHistory, useLocation, useParams } from "react-router-dom";

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
		gridTemplateRows: "auto",
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
	const { search } = useParams();
	const [sort, setSort] = useState(1);

	useEffect(() => {
		backend.get("/product/pages").then((response) => {
			if (response.status === 200 && response.statusText === "OK") {
				setCount(response.data.pages);
			}
		});
	}, []);

	useEffect(() => {
		backend.get("/product/page/" + page + (search !== undefined ? `/${search}` : "")).then((response) => {
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
			cart.push({ ...products[i], quantity: 1 });
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
			<div style={{ margin: 5, marginLeft: 20, marginTop: 10 }}>
				<InputLabel id="sortlabel">Sort</InputLabel>
				<Select labelId="sortlabel" value={sort}>
					<MenuItem value={1}>Relevant</MenuItem>
					<MenuItem value={2}>Price: Low to High</MenuItem>
					<MenuItem value={3}>Price: High to Low</MenuItem>
					<MenuItem value={3}>Average rating</MenuItem>
				</Select>
			</div>

			<div className={classes.productgrid}>
				{products.map((product, index) => (
					<Paper key={product._id} className={classes.paper} onClick={(e) => clickHandler(e, index)}>
						<img src={process.env.REACT_APP_API + product.image} alt="" width={128} height={128} style={{ marginTop: "10px" }}></img>
						<Typography style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{product.name}</Typography>
						<Typography>{Number(product.price).toFixed(2)} €</Typography>
						<Button variant="contained" color="secondary" className={classes.addbutton}>
							Add to cart
						</Button>
					</Paper>
				))}
			</div>

			<Grid item style={{ alignSelf: "center", marginBottom: 15 }}>
				<Pagination count={count} page={page} onChange={(event, value) => setPage(value)} />
			</Grid>
		</Grid>
	);
};

export default Products;
