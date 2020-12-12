import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../App";
import withAuth from "../hoc/withAuth";
import { backend } from "../gateway";
import { NotificationManager } from "react-notifications";
import { Input, Button, makeStyles, ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, IconButton, CircularProgress, Avatar } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DeleteIcon from "@material-ui/icons/Delete";
import MaterialTable from "material-table";
import format from "date-fns/format";

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
	const [products, setProducts] = useState({
		columns: [
			{
				title: "Image",
				field: "image",
				editable: "never",
				emptyValue: "uploads/default.jpeg",
				initialEditValue: "uploads/default.jpeg",
				render: (rowData) => <Avatar src={process.env.REACT_APP_API + rowData.image}></Avatar>,
			},
			{ title: "ID", field: "_id", editable: "never" },
			{ title: "Name", field: "name" },
			{ title: "Description", emptyValue: "", field: "description" },
			{ title: "Price", field: "price", type: "currency", currencySetting: { currency: "EUR" } },
			{ title: "Created", field: "createdAt", editable: "never", emptyValue: "", render: (rowData) => <>{format(new Date(rowData.createdAt), "dd.MM.yyyy HH:mm")}</> },
		],
		data: [],
	});

	useEffect(() => {
		backend.get("/product/page/all").then((response) => {
			if (response.status === 200 && response.statusText === "OK") {
				setProducts({ ...products, data: response.data });
			}
		});
	}, []);

	const addProduct = (newData) => {
		if (newData.name !== null && newData.price !== 0) {
			const formData = new FormData();
			formData.append("product", newData.file);
			formData.append("description", newData.description);
			formData.append("name", newData.name);
			formData.append("price", newData.price);
			return backend
				.post("/product/create", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				})
				.then((response) => {
					if (response.status === 200 && response.statusText === "OK") {
						NotificationManager.success("Added product", "Success", 3000);
						setProducts((prevState) => {
							const data = [...prevState.data];
							data.push(newData);
							return { ...prevState, data };
						});
					} else {
						NotificationManager.error("Failed to add", "Error", 3000);
					}
				})
				.catch((err) => {
					console.log(err);
					NotificationManager.error("Network error", "Error", 3000);
				});
		}
	};

	const updateProduct = (newData, oldData) => {
		const formData = new FormData();
		formData.append("product", newData.file);
		formData.append("name", newData.name);
		formData.append("description", newData.description);
		formData.append("price", newData.price);
		formData.append("productId", newData._id);
		return backend
			.put("/product/update", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((response) => {
				if (response.status === 200 && response.statusText === "OK") {
					NotificationManager.success("Updated product", "Success", 3000);
					setProducts((prevState) => {
						const data = [...prevState.data];
						data[data.indexOf(oldData)] = newData;
						return { ...prevState, data };
					});
				} else {
					NotificationManager.error("Failed to update", "Error", 3000);
				}
			})
			.catch((err) => {
				console.log(err);
				NotificationManager.error("Network error", "Error", 3000);
			});
	};

	const deleteProduct = (oldData) => {
		return backend
			.delete("/product/" + oldData._id)
			.then((response) => {
				if (response.status === 200 && response.statusText === "OK") {
					NotificationManager.success("Removed product", "Success", 3000);
					setProducts((prevState) => {
						const data = [...prevState.data];
						data.splice(data.indexOf(oldData), 1);
						return { ...prevState, data };
					});
				} else {
					NotificationManager.error("Failed to remove", "Error", 3000);
				}
			})
			.catch((err) => {
				console.log(err);
				NotificationManager.error("Network error", "Error", 3000);
			});
	};

	const uploadPicture = (rowData, file) => {
		console.log(rowData);
		const formData = new FormData();
		formData.append("product", file);
		formData.append("productId", rowData._id);
		return backend
			.put("/product/update", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((response) => {
				if (response.status === 200 && response.statusText === "OK") {
					NotificationManager.success("Picture uploaded", "Success", 3000);
				} else {
					NotificationManager.error("Upload failed", "Error", 3000);
				}
			})
			.catch((err) => {
				console.log(err);
				NotificationManager.error("Upload failed", "Error", 3000);
			});
	};

	return (
		<div className={classes.root}>
			<MaterialTable
				title="Products"
				columns={products.columns}
				data={products.data}
				editable={{
					onRowUpdate: updateProduct,
					onRowDelete: deleteProduct,
					onRowAdd: addProduct,
				}}
				options={{
					grouping: true,
				}}
				detailPanel={(rowData) => (
					<>
						<input accept="image/*" onChange={(e) => uploadPicture(rowData, e.target.files[0])} style={{ display: "none" }} id="contained-button-file" type="file" />
						<label htmlFor="contained-button-file">
							<Button variant="contained" color="primary" component="span">
								Upload picture
							</Button>
						</label>
					</>
				)}
			/>
		</div>
	);
};

export default AddProduct;
