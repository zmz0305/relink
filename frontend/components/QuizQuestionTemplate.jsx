import React from 'react';
import { FormGroup, FormControl, Col, Button } from 'react-bootstrap'
import AnswerInput from './AnswerInput.jsx'

export default class QuizQuestionTemplate extends React.Component {
	constructor(props) {
		super(props);
		this.addAnswer = this.addAnswer.bind(this);
		this.removeAnswer = this.removeAnswer.bind(this);

		this.state = { count: this.props.count }
	}

	addAnswer() {
		this.setState({count: this.state.count + 1});
	}

	removeAnswer() {
		if (this.state.count != 2)
			this.setState({count: this.state.count - 1});
	}

	render() {
		const { name, onChange, label } = this.props;

		var answers = [
  		<AnswerInput key={0} name={name} checked={true} onChange={onChange} />
		];
		for (var i = 1; i < this.state.count; i++) {
  		answers.push(<AnswerInput key={i} name={name} checked={false} onChange={onChange} />);
		}

		return (
			<FormGroup style={{marginBottom: '2cm'}}>
				<h3>{label}:</h3>
				<FormControl type="text" placeholder="What is your favorite color?"  />
				{answers}

				<Col smOffset={5} sm={5}>
	        <Button bsStyle="primary" onClick={this.removeAnswer} >
	          - Answer
	        </Button>
	        <Button bsStyle="primary" onClick={this.addAnswer} >
	          + Answer
	        </Button>
	      </Col>
			</FormGroup>
		);
	}
}