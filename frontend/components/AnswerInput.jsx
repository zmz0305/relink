import React from 'react';
import { InputGroup, FormControl } from 'react-bootstrap'

export default class AnswerInput extends React.Component {
	render() {
		const { name, checked, onChange, value } = this.props;
		return (
			<InputGroup>
				<InputGroup.Addon>
					<input type="radio" name={name} aria-label="..."  onChange={onChange}/>
				</InputGroup.Addon>
				<FormControl type="text" value={value}/>
			</InputGroup>
		);
	}
}