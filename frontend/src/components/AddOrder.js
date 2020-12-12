import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../App";
import withAuth from "../hoc/withAuth";
import { backend } from "../gateway";
import { NotificationManager } from "react-notifications";
import { Input, Button, makeStyles, ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, IconButton, CircularProgress } from "@material-ui/core";
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

const AddOrder = () => {
	const classes = useStyles();
	const [orders, setOrders] = useState({
		columns: [
			{ title: "ID", field: "_id", editable: "never" },
			{ title: "First name", field: "address.firstName", editable: "never" },
			{ title: "Last name", field: "address.lastName", editable: "never" },
			{
				title: "Payment method",
				field: "payment",
				editable: "never",
				lookup: {
					creditcard: "Credit Card",
					upn: "UPN",
					delivery: "Pay on delivery",
				},
			},
			{
				title: "Status",
				field: "status",
				lookup: {
					created: "Created",
					waiting: "Waiting for payment",
					processing: "Processing",
					shipped: "Shipped",
					delivered: "Delivered",
				},
			},
			{ title: "Date", field: "createdAt", editable: "never", render: (rowData) => <>{format(new Date(rowData.createdAt), "dd.MM.yyyy HH:mm")}</> },
		],
		data: [],
	});

	useEffect(() => {
		backend.get("/order").then((response) => {
			if (response.status === 200 && response.statusText === "OK") {
				setOrders({ ...orders, data: response.data });
			}
		});
	}, []);

	const updateOrder = (newData, oldData) => {
		return backend
			.put("/order/status", {
				orderId: newData._id,
				status: newData.status,
			})
			.then((response) => {
				if (response.status === 200 && response.statusText === "OK") {
					setOrders((prevState) => {
						const data = [...prevState.data];
						data[data.indexOf(oldData)] = newData;
						return { ...prevState, data };
					});
				} else {
					NotificationManager.error("Failed to edit", "Error", 3000);
				}
			})
			.catch((err) => {
				console.log(err);
				NotificationManager.error("Network error", "Error", 3000);
			});
	};

	const deleteOrder = (oldData) => {
		return backend
			.delete("/order/" + oldData._id)
			.then((response) => {
				if (response.status === 200 && response.statusText === "OK") {
					setOrders((prevState) => {
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

	return (
		<div className={classes.root}>
			<MaterialTable
				title="Orders"
				columns={orders.columns}
				data={orders.data}
				editable={{
					onRowUpdate: updateOrder,
					onRowDelete: deleteOrder,
				}}
				options={{
					grouping: true,
				}}
				detailPanel={(rowData) => <></>}
			/>
		</div>
	);
};

export default AddOrder;
