import React, { useContext, useState } from "react";
import { Paper, TextField, Grid, Button, makeStyles, Stepper, Step, StepLabel, RadioGroup, Radio, FormControlLabel, FormLabel, Select, MenuItem } from "@material-ui/core";
import { CartContext } from "../App";
import CheckoutItem from "./CheckoutItem";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CheckoutPreview from "./CheckoutPreview";
import { useHistory, useLocation, useParams } from "react-router-dom";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import countries from "../data/countries";
import CardSection from "./CardSection";
import withAuth from "../hoc/withAuth";
import { backend } from "../gateway";
import { NotificationManager } from "react-notifications";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		marginLeft: theme.spacing(3),
	},
	paper: {
		marginTop: theme.spacing(5),
		width: "50%",
		textAlign: "center",
	},
	table: {
		margin: theme.spacing(5),
		width: "auto",
	},
	form: {
		"& > *": {
			margin: theme.spacing(1),
		},
	},
}));

function getSteps() {
	return ["Preview", "Address", "Payment method"];
}

const Checkout = () => {
	const classes = useStyles();
	const { cart } = useContext(CartContext);
	const [activeStep, setActiveStep] = useState(0);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [street, setStreet] = useState("");
	const [city, setCity] = useState("");
	const [zip, setZip] = useState("");
	const [country, setCountry] = useState("Slovenia");
	const [payment, setPayment] = useState("");
	const [orderId, setOrderId] = useState("");
	const [clientSecret, setClientSecret] = useState("");
	const steps = getSteps();
	const history = useHistory();

	const stripe = useStripe();
	const elements = useElements();

	const handleNext = () => {
		if (activeStep === 0) {
			backend
				.post("/order/create", {
					products: cart,
				})
				.then((response) => {
					if (response.status === 200 && response.statusText === "OK") {
						setOrderId(response.data.orderId);
						setActiveStep(activeStep + 1);
					} else {
						NotificationManager.error("Failed to create order", "Error", 3000);
					}
				})
				.catch((err) => {
					NotificationManager.error("Network error", "Error", 3000);
				});
		} else if (activeStep === 1) {
			backend
				.put("order/addaddress/", {
					address: { firstName, lastName, street, city, zip, country },
					orderId,
				})
				.then((response) => {
					if (response.status === 200 && response.statusText === "OK") {
						setActiveStep(activeStep + 1);
					} else {
						NotificationManager.error("Failed to create order", "Error", 3000);
					}
				})
				.catch((err) => {
					NotificationManager.error("Network error", "Error", 3000);
				});
		} else if (activeStep === 2) {
		}
	};

	const handleBack = () => {
		if (activeStep === 0) history.push("/cart");
		setActiveStep(activeStep - 1);
	};

	const subtotal = () => {
		let total = 0;
		cart.forEach((product) => {
			total += product.price * product.quantity;
		});
		return total;
	};

	const handleSubmit = async (event) => {
		if (payment === "creditcard") {
			if (!stripe || !elements) {
				// Stripe.js has not yet loaded.
				// Make sure to disable form submission until Stripe.js has loaded.
				return;
			}

			const response = await backend.put("/order/addpayment/", {
				payment,
				orderId,
			});

			if (response.status === 200 && response.statusText === "OK") {
				setClientSecret(response.data.client_secret);
			} else {
				NotificationManager.error("Failed to create order", "Error", 3000);
			}

			const result = await stripe.confirmCardPayment(response.data.client_secret, {
				payment_method: {
					card: elements.getElement(CardElement),
					billing_details: {
						name: firstName + " " + lastName,
					},
				},
			});

			if (result.error) {
				// Show error to your customer (e.g., insufficient funds)
				console.log(result.error.message);
			} else {
				// The payment has been processed!
				if (result.paymentIntent.status === "succeeded") {
					console.log("sucesss");
					const response = await backend.put("/order/status", {
						status: "processing",
						orderId,
					});
					setActiveStep(activeStep + 1);
				}
			}
		} else {
			setActiveStep(activeStep + 1);
		}
	};

	return (
		<Grid container direction="column" justify="center" alignItems="center">
			<Paper className={classes.paper}>
				<Stepper activeStep={activeStep} alternativeLabel>
					{steps.map((label) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
				{activeStep === 0 ? (
					<CheckoutPreview />
				) : activeStep === 1 ? (
					<Grid container direction="column" justify="center" alignItems="center" className={classes.form}>
						<TextField label="First Name" value={firstName} type="text" onChange={(e) => setFirstName(e.target.value)} />
						<TextField label="Last Name" value={lastName} type="text" onChange={(e) => setLastName(e.target.value)} />
						<TextField label="Street name" value={street} type="text" onChange={(e) => setStreet(e.target.value)} />
						<TextField label="City" value={city} type="text" onChange={(e) => setCity(e.target.value)} />
						<TextField label="ZIP" value={zip} type="text" onChange={(e) => setZip(e.target.value)} />
						<Autocomplete
							options={countries}
							autoHighlight
							onChange={(e, newCountry) => setCountry(newCountry)}
							renderInput={(params) => (
								<TextField
									{...params}
									style={{ width: 200 }}
									label="Country"
									inputProps={{
										...params.inputProps,
										autoComplete: "new-password", // disable autocomplete and autofill
									}}
								/>
							)}
						/>
					</Grid>
				) : activeStep === 2 ? (
					<Grid container direction="column" justify="center" alignItems="center">
						<FormLabel component="legend">Choose payment method</FormLabel>
						<RadioGroup aria-label="payment" value={payment} onChange={(e) => setPayment(e.target.value)}>
							<FormControlLabel value="upn" control={<Radio />} label="UPN" checked />
							<FormControlLabel value="delivery" control={<Radio />} label="Pay on delivery" />
							<FormControlLabel value="creditcard" control={<Radio />} label="Credit Card" />
						</RadioGroup>
						{payment === "credicard" ? <CardSection /> : null}
					</Grid>
				) : activeStep === 2 ? (
					<>
						<CheckoutPreview />
						<div>Success</div>
						<div>First name: {firstName}</div>
						<div>Last name: {lastName}</div>
						<div>Street name: {street}</div>
						<div>City: {city}</div>
						<div>ZIP: {zip}</div>
						<div>Country: {country}</div>
						<div>Payment method: {payment === "upn" ? "UPN" : payment === "povzetje" ? "Pay on delivery" : payment === "creditcard" ? "Credit card" : null}</div>
					</>
				) : null}
				<Grid container direction="row" justify="space-around" alignItems="center" style={{ margin: "20px 0" }}>
					<Button onClick={handleBack} className={classes.backButton}>
						Back
					</Button>
					{activeStep === steps.length - 1 ? (
						<Button variant="contained" color="primary" onClick={handleSubmit}>
							Confirm order
						</Button>
					) : (
						<Button disabled={activeStep === steps.length} variant="contained" color="primary" onClick={handleNext}>
							Next
						</Button>
					)}
				</Grid>
			</Paper>
		</Grid>
	);
};

export default withAuth(Checkout);
