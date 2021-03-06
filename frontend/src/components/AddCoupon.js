import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../App";
import withAuth from "../hoc/withAuth";
import { backend } from "../gateway";
import { NotificationManager } from "react-notifications";
import { Input, Button, makeStyles, ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, IconButton, CircularProgress } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DeleteIcon from "@material-ui/icons/Delete";
import { KeyboardDatePicker } from "@material-ui/pickers";
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

const AddCoupon = () => {
	const classes = useStyles();

	const [coupons, setCoupons] = useState({
		columns: [
			{ title: "ID", field: "_id", editable: "never" },
			{ title: "Code", field: "couponCode" },
			{ title: "Discount", field: "discount", type: "numeric", render: (rowData) => <>{rowData.discount}%</> },
			{
				title: "Expire date",
				field: "expireDate",
				initialEditValue: Date.now,
				type: "date",
			},
		],
		data: [],
	});

	useEffect(() => {
		backend.get("/coupon").then((response) => {
			if (response.status === 200 && response.statusText === "OK") {
				setCoupons({ ...coupons, data: response.data });
			}
		});
	}, []);

	const addCoupon = (newData) => {
		if (newData.couponCode !== "" && newData.discount !== 0) {
			return backend
				.post("/coupon", {
					couponCode: newData.couponCode,
					discount: newData.discount,
					expireDate: newData.expireDate,
				})
				.then((response) => {
					if (response.status === 200 && response.statusText === "OK") {
						NotificationManager.success("Added new coupon", "Success", 3000);
						setCoupons((prevState) => {
							const data = [...prevState.data];
							newData._id = response.data._id;
							data.push(newData);
							return { ...prevState, data };
						});
					} else {
						NotificationManager.error("Failed to add new coupon", "Error", 3000);
					}
				})
				.catch((err) => {
					console.log(err);
					NotificationManager.error("Network error", "Error", 3000);
				});
		}
	};

	const updateCoupon = (newData, oldData) => {
		return backend
			.put("/coupon", {
				couponId: newData._id,
				couponCode: newData.couponCode,
				discount: newData.discount,
				expireDate: newData.expireDate,
			})
			.then((response) => {
				if (response.status === 200 && response.statusText === "OK") {
					NotificationManager.success("Updated coupon", "Success", 3000);
					setCoupons((prevState) => {
						const data = [...prevState.data];
						data[data.indexOf(oldData)] = newData;
						return { ...prevState, data };
					});
				} else {
					NotificationManager.error("Failed to update coupon", "Error", 3000);
				}
			})
			.catch((err) => {
				console.log(err);
				NotificationManager.error("Network error", "Error", 3000);
			});
	};

	const deleteCoupon = (oldData) => {
		return backend
			.delete("/coupon/" + oldData._id)
			.then((response) => {
				if (response.status === 200 && response.statusText === "OK") {
					NotificationManager.success("Removed coupon", "Success", 3000);
					setCoupons((prevState) => {
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
				title="Coupons"
				columns={coupons.columns}
				data={coupons.data}
				editable={{
					onRowUpdate: updateCoupon,
					onRowDelete: deleteCoupon,
					onRowAdd: addCoupon,
				}}
				options={{
					grouping: true,
				}}
			/>
		</div>
	);
};

export default AddCoupon;
