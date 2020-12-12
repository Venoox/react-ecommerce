import React, { useState, useEffect, useContext } from "react";
import { makeStyles, Grid, Paper, GridList, GridListTile, Button, Input, CircularProgress, Avatar, Typography, TextField } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { backend } from "../gateway";
import { useHistory, useParams } from "react-router-dom";

import { NotificationManager } from "react-notifications";

import { AuthContext } from "../App";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		marginLeft: theme.spacing(3),
	},
	paper: {
		margin: theme.spacing(5),
		width: 800,
		"& > *": {
			padding: theme.spacing(1),
		},
		textAlign: "center",
	},
	paper2: {
		margin: theme.spacing(5),
		width: 900,
		"& > *": {
			padding: theme.spacing(1),
		},
		textAlign: "center",
	},
	product: {
		margin: "auto",
		"& > *": {
			margin: theme.spacing(1),
		},
	},
}));

const Product = () => {
	const [product, setProduct] = useState({});
	const [quantity, setQuantity] = useState(1);
	const [ratings, setRatings] = useState([]);
	const [stars, setStars] = useState(0);
	const [comment, setComment] = useState("");
	const [disabled, setDisabled] = useState(false);
	const [hover, setHover] = React.useState(-1);

	const { state } = useContext(AuthContext);
	const classes = useStyles();
	const history = useHistory();
	const { productId } = useParams();

	useEffect(() => {
		backend.get("/product/" + productId).then((response) => {
			if (response.status === 200 && response.statusText === "OK") {
				setProduct(response.data);
			}
		});
		backend.get("/rating/" + productId).then((response) => {
			if (response.status === 200 && response.statusText === "OK") {
				setRatings(response.data);
			}
		});
	}, []);

	const addToCart = (quantity) => {
		if (state.isAuth) {
			backend
				.post("/cart/add", {
					productId: product._id,
					quantity,
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
			cart.push({ ...product, quantity });
			localStorage.setItem("cart", JSON.stringify(cart));
		}
	};

	const addComment = () => {
		if (stars !== 0) {
			setDisabled(true);
			backend
				.post("/rating", {
					productId,
					stars,
					comment,
				})
				.then((response) => {
					if (response.status === 200 && response.statusText === "OK") {
						NotificationManager.success("Comment added", "Success", 3000);
						setRatings((ratings) => ratings.concat(response.data));
					} else {
						NotificationManager.error("Failed to add comment", "Error", 3000);
					}
				})
				.catch((err) => {
					NotificationManager.error("Network error", "Error", 3000);
				})
				.finally(() => {
					setDisabled(false);
				});
		}
	};

	return (
		<Grid container direction="column" justify="center" alignItems="center">
			<Paper className={classes.paper}>
				<Grid container direction="row" justify="flex-start" alignItems="center">
					<Grid item>
						<img src={process.env.REACT_APP_API + product.image} alt="" width={256} height={256}></img>
					</Grid>
					<Grid item className={classes.product}>
						<Typography style={{ alignSelf: "flex-start", fontSize: "1.2rem", fontWeight: "bold" }}>{product.name}</Typography>
						<Typography>Price: {Number(product.price).toFixed(2)} €</Typography>
						<Grid item>
							Quantity: <Input type="number" inputProps={{ min: 1 }} value={quantity} onChange={(e) => setQuantity(e.target.value)} style={{ width: 50 }} />
						</Grid>
						<Button variant="contained" color="secondary" onClick={() => addToCart(quantity)}>
							Add to cart
						</Button>
					</Grid>
				</Grid>
			</Paper>
			<Paper className={classes.paper2}>
				{state.isAuth ? (
					<Grid container direction="column">
						<Grid item>Stars: </Grid>
						<Grid item style={{ margin: 5 }}>
							<Rating
								name="stars"
								disabled={disabled}
								value={stars}
								precision={1}
								onChange={(event, newValue) => {
									setStars(newValue);
								}}
								onChangeActive={(event, newHover) => {
									setHover(newHover);
								}}
							/>
						</Grid>
						<Grid item>Comment:</Grid>
						<Grid item style={{ margin: 5 }}>
							<TextField style={{ width: "80%" }} rows="4" variant="outlined" multiline disabled={disabled} value={comment} type="text" onChange={(e) => setComment(e.target.value)} />
						</Grid>
						<Grid item style={{ margin: 5 }}>
							<Button disabled={disabled} variant="contained" color="primary" component="span" onClick={() => addComment()}>
								{disabled ? <CircularProgress size={20}></CircularProgress> : "Add rating"}
							</Button>
						</Grid>
					</Grid>
				) : (
					<div>You need to be logged in to rate the product!</div>
				)}
				{ratings.length === 0 ? (
					<Typography variant="h6">No ratings</Typography>
				) : (
					<Typography variant="h6" style={{ textAlign: "left" }}>
						Ratings ({ratings.length})
					</Typography>
				)}
				<Grid container direction="column" alignItems="center">
					{ratings.map((rating) => (
						<Paper key={rating._id} style={{ marginBottom: "20px", width: "880px" }}>
							<Grid container direction="row">
								<div>
									<Avatar
										alt=""
										src={process.env.REACT_APP_API + rating.image}
										style={{
											width: 128,
											height: 128,
											margin: 5,
										}}
									/>
								</div>

								<Grid style={{ textAlign: "left", marginLeft: 10 }}>
									<div style={{ marginTop: 5 }}>{rating.name}</div>
									<Rating style={{ margin: "5px 0" }} value={rating.stars} readOnly />
									<div>{rating.comment}</div>
								</Grid>
							</Grid>
						</Paper>
					))}
				</Grid>
			</Paper>
		</Grid>
	);
};

export default Product;
