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
		    <h1>Relink!</h1>
		    <p>Connect with your students in realtime, and make the lecture experience a lot more valuable and enjoyable!</p>
		  </Jumbotron>
		);
	}
}
export default withRouter(LandingPage);