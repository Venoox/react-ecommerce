import React, { useEffect, useState, useContext } from "react";
import { makeStyles, List, Paper, Grid, Typography, Button } from "@material-ui/core";
import { backend } from "../gateway";
import { AuthContext } from "../App";
import { NotificationManager } from "react-notifications";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	gridcontainer: {
		display: "grid",
		gridTemplateColumns: "1fr 1fr 1fr 1fr",
		gridTemplateRows: "1fr",
		gap: "0px 42px",
		gridTemplateAreas: '". . . ."',
	},
	addbutton: {
		margin: "20px 0",
	},
	paper: {
		width: 250,
		"&:hover": {
			cursor: "pointer",
		},
	},
}));

function Home() {
	const classes = useStyles();
	const { state } = useContext(AuthContext);
	const history = useHistory();
	const [newestProducts, setNewestProducts] = useState([]);

	useEffect(() => {
		backend.get("/product/newest").then((response) => {
			if (response.status === 200 && response.statusText === "OK") {
				setNewestProducts(response.data);
			}
		});
	}, []);

	const addToCart = (i) => {
		if (state.isAuth) {
			backend
				.post("/cart/add", {
					productId: newestProducts[i]._id,
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
			cart.push({ ...newestProducts[i], quantity: 1 });
			localStorage.setItem("cart", JSON.stringify(cart));
		}
	};

	const clickHandler = (e, i) => {
		if (e.target.textContent === "Add to cart") {
			addToCart(i);
		} else {
			history.push("/product/" + newestProducts[i]._id);
		}
	};

	return (
		<Grid container direction="column" alignItems="center" justify="center">
			<Typography variant="h5" style={{ marginBottom: 150, marginTop: 100 }}>
				Welcome to Webstore!
			</Typography>
			<Typography style={{ fontWeight: "bold", marginBottom: 5 }}>OUR NEWEST PRODUCTS</Typography>
			<div style={{ backgroundColor: "#f50057", width: 120, height: 5, marginBottom: 30 }}></div>
			<div className={classes.gridcontainer}>
				{newestProducts.map((product, i) => (
					<Paper key={product._id} className={classes.paper} onClick={(e) => clickHandler(e, i)}>
						<Grid style={{ padding: 10 }} container direction="column" alignItems="center" justify="center">
							<img style={{ margin: 10 }} src={process.env.REACT_APP_API + product.image} alt="" width={200} height={200}></img>

							<Typography style={{ fontSize: "1.2rem", fontWeight: "bold", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>{product.name}</Typography>
							<Typography>{Number(product.price).toFixed(2)} €</Typography>

							<Button variant="contained" color="secondary" className={classes.addbutton}>
								Add to cart
							</Button>
						</Grid>
					</Paper>
				))}
			</div>
		</Grid>
	);
}

export default Home;
