import { backend } from "../gateway";

const Logout = () => {
	backend
		.delete("/user/logout")
		.then(response => {
			if (response.status === 200 && response.statusText === "OK") {
				localStorage.removeItem("token");
				delete backend.defaults.headers.common["Authorization"];
			} else {
				throw new Error("Network response was not ok");
			}
		})
		.catch(err => {
			console.log(err);
			localStorage.removeItem("token");
			delete backend.defaults.headers.common["Authorization"];
		});
};

export default Logout;
