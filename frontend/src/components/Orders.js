import React, { useState, useEffect, useContext } from "react";
import { Paper, Grid, Typography } from "@material-ui/core";
import { backend } from "../gateway";
import { AuthContext } from "../App";
import format from "date-fns/format";

const Orders = () => {
	const { state, dispatch } = useContext(AuthContext);
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		backend
			.get("/order/user/" + state.user.id)
			.then((response) => {
				if (response.status === 200 && response.statusText === "OK") {
					setOrders(response.data);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const subtotal = (i) => {
		let total = 0;
		orders[i].products.forEach((product) => {
			total += product.price * product.quantity;
		});
		return total;
	};

	return (
		<div style={{ width: 700, margin: 10, color: "rgb(43, 43, 43)" }}>
			<Grid container direction="column">
				<div style={{ marginLeft: 10 }}>Number of orders: {orders.length}</div>
				<div>
					<hr />
				</div>
				{orders.map((order, i) => (
					<>
						<div style={{ marginBottom: 20, width: 600, marginLeft: 30 }}>
							<Typography variant="h6" style={{ color: "rgba(207,0,0,1)" }}>
								Order no. {order._id}
							</Typography>
							<div style={{ marginBottom: 10 }}>
								Ordered on: <span style={{ fontWeight: "bold" }}>{format(new Date(order.createdAt), "dd.MM.yyyy")}</span>
							</div>

							{order.products.map((product) => (
								<>
									<Grid container direction="row" alignItems="center" justify="flex-start">
										<div style={{ marginLeft: 10 }}>
											<img src={process.env.REACT_APP_API + product.image} width="32" height="32"></img>
										</div>
										<div style={{ marginLeft: 30 }}>
											{product.quantity} x {product.name}
										</div>
										<Grid item style={{ marginLeft: "auto", marginRight: 10 }}>
											{Number(product.price * product.quantity).toFixed(2)} €
										</Grid>
									</Grid>
									<hr />
								</>
							))}
							<Grid container justify="flex-end" style={{ marginTop: 10 }}>
								<div style={{ marginRight: 10 }}>
									Total: <span style={{ fontWeight: "bold" }}>{subtotal(i).toFixed(2)} €</span>
								</div>
							</Grid>
						</div>
						<div>
							<hr />
						</div>
					</>
				))}
			</Grid>
		</div>
	);
};

export default Orders;
