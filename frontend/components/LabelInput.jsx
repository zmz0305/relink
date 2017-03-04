import React from 'react';

export default class LabeldInput extends React.Component {
	render() {
		const {value, onChange, type, label, name} = this.props;
		return (
			<div>
				<label>{label}:<br/>
				<input name={name} type={type} onChange={onChange} /></label>
				<br/>
			</div>
		);
	}
}