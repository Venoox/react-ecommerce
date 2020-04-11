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

const AddCoupon = () => {
	const classes = useStyles();
	const [couponCode, setCouponCode] = useState("");
	const [discount, setDiscount] = useState(0);
	const [expireDate, setExpireDate] = useState(Date.now);
	const [coupons, setCoupons] = useState([]);
	const [disabled, setDisabled] = useState(false);

	useEffect(() => {
		backend.get("/coupon").then((response) => {
			if (response.status === 200 && response.statusText === "OK") {
				setCoupons(response.data);
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
			<label>Coupon Code: </label>
			<Input disabled={disabled} value={couponCode} type="text" onChange={(e) => setCouponCode(e.target.value)} />
			<label>Discount: </label>
			<Input disabled={disabled} value={discount} type="number" onChange={(e) => setDiscount(e.target.value)} />
			<label>Expire Date: </label>
			<KeyboardDatePicker clearable value={expireDate} placeholder="05.06.2020" onChange={(date) => setExpireDate(date)} minDate={new Date()} format="dd.MM.yyyy" />
			<Button disabled={disabled} variant="contained" color="primary" onClick={Add}>
				{disabled ? <CircularProgress size={20}></CircularProgress> : "Add coupon"}
			</Button>
			{coupons.map((coupon, index) => (
				<ExpansionPanel key={coupon._id}>
					<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
						<Typography className={classes.heading}>{coupon.couponCode}</Typography>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails className={classes.panel}>
						<div>
							<label>Coupon Code: </label>
							<Input type="text" value={coupon.couponCode} onChange={(e) => changeNameCoupon(e.target.value, index)} />
						</div>
						<div>
							<label>Discount: </label>
							<Input type="number" value={coupon.discount} onChange={(e) => changeDiscountCoupon(e.target.value, index)} />
						</div>
						<div>
							<label>Expire date: </label>
							<KeyboardDatePicker clearable value={coupon.expireDate} placeholder="05.06.2020" onChange={(date) => changeExpireCoupon(date, index)} format="dd.MM.yyyy" />
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
