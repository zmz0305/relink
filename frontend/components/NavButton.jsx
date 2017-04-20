import React from 'react';
import { NavItem } from 'react-bootstrap';
import { withRouter } from 'react-router'

class NavButton extends React.Component {
	constructor(props) {
		super(props);
  	this.navigate = this.navigate.bind(this);
  }

	navigate(dst) {
		if (this.props.onClick != undefined) {
			this.props.onClick()
		}
		this.props.router.push(dst);
	}

	render() {
		const { dst, label } = this.props;
		return (
			<NavItem onClick={() => this.navigate(dst)}>{label}</NavItem>
		);
	}
}
export default withRouter(NavButton);