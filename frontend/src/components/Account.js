import React, { useContext, useEffect, useState } from "react";
import { useHistory, Switch, Route } from "react-router-dom";
import { makeStyles, List, Paper, Grid, Input, Button, CircularProgress, TextField, Avatar } from "@material-ui/core";
import { AuthContext } from "../App";
import withAuth from "../hoc/withAuth";
import AddProduct from "./AddProduct";
import AddCoupon from "./AddCoupon";
import ListItemLink from "./ListItemLink";
import { backend } from "../gateway";
import { NotificationManager } from "react-notifications";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		margin: theme.spacing(3),
		width: 800,
	},
	gridcontainer: {
		padding: 10,
		display: "grid",
		gridTemplateColumns: "0.2fr 1fr 1fr",
		gridTemplateRows: "1fr 1fr",
		gap: "0 20px",
		gridTemplateAreas: '"image info info" "image info info"',
	},

	image: {
		display: "grid",
		gridTemplateColumns: "1fr",
		gridTemplateRows: "1.3fr 0.7fr",
		gap: "1px 1px",
		gridTemplateAreas: '"." "."',
		gridArea: "image",
	},

	info: {
		display: "grid",
		gridTemplateColumns: "1fr 1fr",
		gridTemplateRows: "1fr 1fr",

		gridTemplateAreas: '". ." ". ."',
		gridArea: "info",
	},
}));

const Account = () => {
	const { state, dispatch } = useContext(AuthContext);
	const [user, setUser] = useState({
		email: "",
		firstName: "",
		lastName: "",
		image: null,
	});
	const [password, setPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [disabled, setDisabled] = useState(false);
	const [file, setFile] = useState(null);
	const [blob, setBlob] = useState(null);
	const classes = useStyles();
	const history = useHistory();

	useEffect(() => {
		backend
			.get("/user/")
			.then((response) => {
				if (response.status === 200 && response.statusText === "OK") {
					setUser(response.data);
					setBlob(process.env.REACT_APP_API + response.data.image);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const changeFile = (file) => {
		setFile(file);
		URL.revokeObjectURL(blob);
		setBlob(URL.createObjectURL(file));
	};

	const updateUser = () => {
		const formData = new FormData();
		formData.append("firstName", user.firstName);
		formData.append("lastName", user.lastName);
		formData.append("email", user.email);
		formData.append("avatar", file);
		backend
			.put("/user/update", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((response) => {
				if (response.status === 200 && response.statusText === "OK") {
					NotificationManager.success("User updated", "Success", 3000);
				} else {
					NotificationManager.error("Failed to update", "Error", 3000);
				}
			})
			.catch((err) => {
				console.log(err);
				NotificationManager.error("Network error", "Error", 3000);
			});
	};

	const changePassword = () => {
		if (password !== newPassword) {
			backend
				.put("/user/password", {
					password,
					newPassword,
				})
				.then((response) => {
					if (response.status === 200 && response.statusText === "OK") {
						NotificationManager.success("Password changed", "Success", 3000);
					} else {
						NotificationManager.error("Failed to change password", "Error", 3000);
					}
				})
				.catch((err) => {
					console.log(err);
					NotificationManager.error("Network error", "Error", 3000);
				});
		}
	};

	const clear = (e) => {
		setFile(null);
		setBlob(process.env.REACT_APP_API + user.image);
	};

	return (
		<Paper className={classes.paper}>
			<div className={classes.gridcontainer}>
				<div className={classes.image}>
					<Avatar
						alt=""
						src={blob}
						style={{
							width: 128,
							height: 128,
							margin: 5,
						}}
					/>
					<Grid container direction="row" justify="center" alignItems="center">
						<input accept="image/*" style={{ display: "none" }} id="contained-button-file" type="file" onChange={(e) => changeFile(e.target.files[0])} />
						<label htmlFor="contained-button-file">
							<Button variant="contained" color="primary" component="span">
								Upload
							</Button>
						</label>
						<Button variant="contained" color="primary" component="span" style={{ marginTop: 5 }} onClick={clear}>
							Clear
						</Button>
					</Grid>
				</div>
				<div className={classes.info}>
					<div>
						<Grid container direction="column" justify="center" alignItems="flex-start">
							<TextField label="First name" value={user.firstName} style={{ marginBottom: 5 }} onChange={(e) => setUser({ ...user, firstName: e.target.value })}></TextField>
							<TextField label="Last name" value={user.lastName} onChange={(e) => setUser({ ...user, lastName: e.target.value })}></TextField>
						</Grid>
					</div>

					<div>
						<Grid container direction="column" justify="center" alignItems="flex-start">
							<TextField type="password" label="Password" value={password} style={{ marginBottom: 5 }} onChange={(e) => setPassword(e.target.value)}></TextField>
							<TextField type="password" label="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}></TextField>
						</Grid>
					</div>
					<div>
						<Grid container direction="column" justify="center" alignItems="flex-start">
							<TextField label="E-mail" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })}></TextField>
							<Button variant="contained" color="primary" style={{ marginTop: 20 }} onClick={updateUser}>
								Update
							</Button>
						</Grid>
					</div>
					<div>
						<Button variant="contained" color="primary" component="span" onClick={changePassword}>
							Change password
						</Button>
					</div>
				</div>
			</div>
		</Paper>
	);
};

export default withAuth(Account);
