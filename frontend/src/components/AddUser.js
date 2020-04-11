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
	const [user, setUser] = useState({
		email: "",
		password: "",
		type: "",
		firstName: "",
		lastName: "",
		address: {
			street: "",
			city: "",
			zip: "",
			country: "",
		},
	});
	const [image, setImage] = useState(null);
	const [users, setUsers] = useState([]);
	const [disabled, setDisabled] = useState(false);

	useEffect(() => {
		backend.get("/user/all").then((response) => {
			if (response.status === 200 && response.statusText === "OK") {
				setUsers(response.data);
			}
		});
	}, []);

	const Add = () => {
		if (couponCode !== "" && discount !== 0) {
			setDisabled(true);
			backend
				.post("/coupon", {
					couponCode: couponCode,
					discount: discount,
					expireDate: expireDate,
				})
				.then((response) => {
					if (response.status === 200 && response.statusText === "OK") {
						NotificationManager.success("Added new coupon", "Success", 3000);
					} else {
						NotificationManager.error("Failed to add new coupon", "Error", 3000);
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

	const updateCoupon = (i) => {
		backend
			.put("/coupon", {
				couponId: coupons[i]._id,
				couponCode: coupons[i].couponCode,
				discount: coupons[i].discount,
				expireDate: coupons[i].expireDate,
			})
			.then((response) => {
				if (response.status === 200 && response.statusText === "OK") {
					NotificationManager.success("Updated coupon", "Success", 3000);
				} else {
					NotificationManager.error("Failed to update coupon", "Error", 3000);
				}
			})
			.catch((err) => {
				console.log(err);
				NotificationManager.error("Network error", "Error", 3000);
			});
	};

	const removeCoupon = (i) => {
		backend
			.delete("/coupon/" + coupons[i]._id)
			.then((response) => {
				if (response.status === 200 && response.statusText === "OK") {
					NotificationManager.success("Removed product", "Success", 3000);
					setCoupons(
						coupons.filter((coupon, index) => {
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

	const changeNameCoupon = (newCouponCode, index) => {
		setCoupons(
			coupons.map((coupon, i) => {
				if (i === index) return { ...coupon, couponCode: newCouponCode };
				return coupon;
			})
		);
	};

	const changeDiscountCoupon = (newDiscount, index) => {
		setCoupons(
			coupons.map((coupon, i) => {
				if (i === index) return { ...coupon, discount: newDiscount };
				return coupon;
			})
		);
	};

	const changeExpireCoupon = (newExpireDate, index) => {
		setCoupons(
			coupons.map((coupon, i) => {
				if (i === index) return { ...coupon, expireDate: newExpireDate };
				return coupon;
			})
		);
	};

	return (
		<div className={classes.root}>
			{users.map((user, index) => (
				<ExpansionPanel key={user._id}>
					<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
						<Typography className={classes.heading}>{coupon.couponCode}</Typography>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails className={classes.panel}>
						<div>
							<label>Email: </label>
							<Input type="text" value={user.email} onChange={(e) => changeNameCoupon(e.target.value, index)} />
						</div>
						<div>
							<label>First name: </label>
							<Input type="text" value={user.firstName} onChange={(e) => changeNameCoupon(e.target.value, index)} />
						</div>
						<div>
							<label>Last name: </label>
							<Input type="text" value={user.firstName} onChange={(e) => changeNameCoupon(e.target.value, index)} />
						</div>
						<div>
							<Button variant="contained" color="primary" component="span" onClick={() => updateCoupon(index)}>
								Update
							</Button>
						</div>
						<IconButton aria-label="delete">
							<DeleteIcon fontSize="small" onClick={() => removeCoupon(index)} />
						</IconButton>
					</ExpansionPanelDetails>
				</ExpansionPanel>
			))}
		</div>
	);
};

export default AddCoupon;
