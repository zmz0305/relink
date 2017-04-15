import React from 'react';
import { InputGroup, FormControl } from 'react-bootstrap'
import { quizStore } from '../scenes/CreateQuiz.jsx'

export default class AnswerInput extends React.Component {
	constructor(props) {
		super(props);
		this.setValue = this.setValue.bind(this);
		this.setAnswerValue = this.setAnswerValue.bind(this);
		this.state = { answer: '', checked: false }

		const questionCount = this.props.questionCount
		const answerCount = this.props.answerCount
		quizStore.subscribe(() => {
			var state = quizStore.getState()
			var checked = state.answers[questionCount] == answerCount ? true : false
			console.log(state.answers[questionCount])
			this.setState({
				answer: state.questions[questionCount].answers[answerCount],
				checked: checked
			})
		});

		if (quizStore.getState().answers[questionCount] == answerCount) {
			this.state.checked = true
		}
	}

	setValue(event) {
    quizStore.dispatch({
    	type: 'UPDATEANSWER',
    	questionCount: this.props.questionCount,
    	answerCount: this.props.answerCount,
    	answer: event.target.value
    })
  }

  setAnswerValue(event) {
  	quizStore.dispatch({
  		type: 'SETCORRECTANSWER',
  		questionCount: this.props.questionCount,
  		answerCount: this.props.answerCount
  	})
  }

	render() {
		const { name } = this.props;
		return (
			<InputGroup>
				<InputGroup.Addon>
					<input type="radio" name={name} aria-label="..." onChange={this.setAnswerValue} checked={this.state.checked} />
				</InputGroup.Addon>
				<FormControl type="text" onChange={this.setValue} />
			</InputGroup>
		);
	}
}