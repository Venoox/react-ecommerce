import React from "react";
import { Link } from "react-router-dom";
import { ListItem, ListItemText, ListItemIcon } from "@material-ui/core";

const ListItemLink = props => {
	const { icon, primary, to } = props;

	const renderLink = React.useMemo(() => React.forwardRef((linkProps, ref) => <Link ref={ref} to={to} {...linkProps} />), [to]);

	return (
		<li>
			<ListItem button component={renderLink}>
				{icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
				<ListItemText primary={primary} />
			</ListItem>
		</li>
	);
};

export default ListItemLink;
