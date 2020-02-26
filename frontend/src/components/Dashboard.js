import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../App";
import withAuth from "../hoc/withAuth";

const Dashboard = () => {
	const { state, dispatch } = useContext(AuthContext);

	return <div>Email: {state.user.email}</div>;
};

export default withAuth(Dashboard);
