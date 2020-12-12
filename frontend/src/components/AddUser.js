import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../App";
import withAuth from "../hoc/withAuth";
import { backend } from "../gateway";
import { NotificationManager } from "react-notifications";
import { Avatar, Input, Button, makeStyles, ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, IconButton, CircularProgress } from "@material-ui/core";
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

const AddUser = () => {
	const classes = useStyles();

	const [users, setUsers] = useState({
		columns: [
			{
				title: "Avatar",
				field: "image",
				editable: "never",
				emptyValue: "uploads/default-avatar.png",
				initialEditValue: "uploads/default-avatar.png",
				render: (rowData) => <Avatar src={process.env.REACT_APP_API + rowData.image}></Avatar>,
			},
			{ title: "ID", field: "_id", editable: "never" },
			{ title: "E-mail", field: "email" },
			{ title: "First name", field: "firstName" },
			{ title: "Last name", field: "lastName" },
			{
				title: "Type",
				field: "type",
				lookup: {
					user: "User",
					admin: "Administrator",
				},
			},
			{
				title: "Created",
				field: "created_at",
				editable: "never",
				type: "date",
			},
		],
		data: [],
	});

	useEffect(() => {
		backend.get("/user/all").then((response) => {
			if (response.status === 200 && response.statusText === "OK") {
				setUsers({ ...users, data: response.data });
			}
		});
	}, []);

	const updateUser = (newData, oldData) => {
		return backend
			.put("/user/update", {
				id: newData._id,
				firstName: newData.firstName,
				lastName: newData.lastName,
				email: newData.email,
				type: newData.type,
			})
			.then((response) => {
				if (response.status === 200 && response.statusText === "OK") {
					NotificationManager.success("Updated coupon", "Success", 3000);
					setUsers((prevState) => {
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

	const deleteUser = (oldData) => {
		return backend
			.delete("/user/" + oldData._id)
			.then((response) => {
				if (response.status === 200 && response.statusText === "OK") {
					NotificationManager.success("Removed coupon", "Success", 3000);
					setUsers((prevState) => {
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
				title="Users"
				columns={users.columns}
				data={users.data}
				editable={{
					onRowUpdate: updateUser,
					onRowDelete: deleteUser,
				}}
				options={{
					grouping: true,
				}}
			/>
		</div>
	);
};

export default AddUser;
