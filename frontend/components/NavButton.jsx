import React from 'react';

export default class NavButton extends React.Component {
	constructor(props) {
		super(props);
  	this.navigate = this.navigate.bind(this);
  }

	navigate(dst, router) {
		console.log(this.props);
		router.push(dst);
	}

	render() {
		const {dst, name, router} = this.props;
		return (
			<div>
				<button onClick={() => {this.navigate(dst, router)}}>{name}</button>
			</div>
		);
	}
}