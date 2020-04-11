import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../App";
import withAuth from "../hoc/withAuth";
import { backend } from "../gateway";
import { NotificationManager } from "react-notifications";
import { Input, Button, makeStyles, ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, IconButton, CircularProgress } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
	root: {
		"& > *": {
			margin: theme.spacing(1),
		},
	},
	input: {
		display: "none",
	},
	heading: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightRegular,
	},
	panel: {
		"& > *": {
			marginRight: theme.spacing(1),
		},
	},
}));

const AddProduct = () => {
	const classes = useStyles();
	const [name, setName] = useState("");
	const [price, setPrice] = useState(0);
	const [file, setFile] = useState(null);
	const [products, setProducts] = useState([]);
	const [disabled, setDisabled] = useState(false);

	useEffect(() => {
		backend.get("/product/page/all").then((response) => {
			if (response.status === 200 && response.statusText === "OK") {
				setProducts(response.data);
			}
		});
	}, []);

	const Add = () => {
		if (name !== "null" && price !== 0) {
			setDisabled(true);
			const formData = new FormData();
			formData.append("product", file);
			formData.append("name", name);
			formData.append("price", price);
			backend
				.post("/product/create", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				})
				.then((response) => {
					if (response.status === 200 && response.statusText === "OK") {
						NotificationManager.success("Added to cart", "Success", 3000);
					} else {
						NotificationManager.error("Failed to add", "Error", 3000);
					}
				})
				.catch((err) => {
					console.log(err);
					NotificationManager.error("Network error", "Error", 3000);
				})
				.finally(() => {
					setDisabled(false);
				});
		}
	};

	const updateProduct = (i) => {
		const formData = new FormData();
		formData.append("product", products[i].file);
		formData.append("name", products[i].name);
		formData.append("price", products[i].price);
		formData.append("productId", products[i]._id);
		backend
			.put("/product/update", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((response) => {
				if (response.status === 200 && response.statusText === "OK") {
					NotificationManager.success("Updated product", "Success", 3000);
				} else {
					NotificationManager.error("Failed to update", "Error", 3000);
				}
			})
			.catch((err) => {
				console.log(err);
				NotificationManager.error("Network error", "Error", 3000);
			});
	};

	const removeProduct = (i) => {
		backend
			.delete("/product/" + products[i]._id)
			.then((response) => {
				if (response.status === 200 && response.statusText === "OK") {
					NotificationManager.success("Removed product", "Success", 3000);
					setProducts(
						products.filter((product, index) => {
							if (i === index) return false;
							else return true;
						})
					);
				} else {
					NotificationManager.error("Failed to removed", "Error", 3000);
				}
			})
			.catch((err) => {
				console.log(err);
				NotificationManager.error("Network error", "Error", 3000);
			});
	};

	const changeName = (name) => setName(name);
	const changePrice = (price) => setPrice(price);
	const changeFile = (file) => setFile(file);

	const changeNameProduct = (newName, index) => {
		setProducts(
			products.map((product, i) => {
				if (i === index) return { ...product, name: newName };
				return product;
			})
		);
	};

	const changePriceProduct = (newPrice, index) => {
		setProducts(
			products.map((product, i) => {
				if (i === index) return { ...product, price: newPrice };
				return product;
			})
		);
	};

	const changeFileProduct = (newFile, index) => {
		console.log("test");
		setProducts(
			products.map((product, i) => {
				if (i === index) return { ...product, file: newFile };
				return product;
			})
		);
	};

	return (
		<div className={classes.root}>
			<label>Name: </label>
			<Input disabled={disabled} value={name} type="text" onChange={(e) => changeName(e.target.value)} />
			<label>Price: </label>
			<Input disabled={disabled} value={price} type="number" onChange={(e) => changePrice(e.target.value)} />
			<label>Image: </label>
			<input disabled={disabled} accept="image/*" className={classes.input} id="file" type="file" onChange={(e) => changeFile(e.target.files[0])} />
			<label htmlFor="file">
				<Button variant="contained" color="primary" component="span">
					Upload
				</Button>
			</label>
			<Button disabled={disabled} variant="contained" color="primary" onClick={Add}>
				{disabled ? <CircularProgress size={20}></CircularProgress> : "Add product"}
			</Button>
			{products.map((product, index) => (
				<ExpansionPanel key={product._id}>
					<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
						<Typography className={classes.heading}>{product.name}</Typography>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails className={classes.panel}>
						<div>
							<label>Name: </label>
							<Input type="text" value={product.name} onChange={(e) => changeNameProduct(e.target.value, index)} />
						</div>
						<div>
							<label>Price: </label>
							<Input type="number" value={product.price} onChange={(e) => changePriceProduct(e.target.value, index)} />
						</div>
						<div>
							<label>Image: </label>
							<label htmlFor={"file" + index}>
								<Button variant="contained" color="primary" component="span">
									Upload
								</Button>
								<input accept="image/*" className={classes.input} id={"file" + index} type="file" onChange={(e) => changeFileProduct(e.target.files[0], index)} />
							</label>
						</div>
						<div>
							<Button variant="contained" color="primary" component="span" onClick={() => updateProduct(index)}>
								Update
							</Button>
						</div>
						<IconButton aria-label="delete" onClick={() => removeProduct(index)}>
							<DeleteIcon fontSize="small" />
						</IconButton>
					</ExpansionPanelDetails>
				</ExpansionPanel>
			))}
		</div>
	);
};

export default AddProduct;
