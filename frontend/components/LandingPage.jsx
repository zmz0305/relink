import React from 'react';
import { Jumbotron, Button } from 'react-bootstrap';
import { withRouter } from 'react-router';

class LandingPage extends React.Component {
	constructor(props) {
		super(props);
  	this.navigate = this.navigate.bind(this);
  }

	navigate(dst) {
		this.props.router.push(dst);
	}

	render() {
		const { dst, label } = this.props;
		return (
			<Jumbotron>
		    <h1>Hello, world!</h1>
		    <p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
		    <p><Button bsStyle="primary">Learn more</Button></p>
		  </Jumbotron>
		);
	}
}
export default withRouter(LandingPage);