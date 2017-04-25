import React from 'react';
import { InputGroup, FormControl } from 'react-bootstrap'
import { quizStore } from './Quiz.jsx'

export default class AnswerInput extends React.Component {
	constructor(props) {
		super(props);
		this.setValue = this.setValue.bind(this);
		this.setAnswerValue = this.setAnswerValue.bind(this);

		const questionCount = this.props.questionCount
		const answerCount = this.props.answerCount
		var currState = quizStore.getState()
		if (currState.quizName.length > 0) {
			var checked = currState.answers[questionCount] == answerCount ? true : false
			this.state = {
				answer: currState.questions[questionCount].answers[answerCount],
				checked: checked
			}
		} else {
			this.state = { answer: '', checked: false }
		}


		this.unsubscribe = quizStore.subscribe(() => {
			var state = quizStore.getState()
			var checked = state.answers[questionCount] == answerCount ? true : false
			
			this.setState({
				answer: state.questions[questionCount].answers[answerCount],
				checked: checked
			})
		});

		if (quizStore.getState().answers[questionCount] == answerCount) {
			this.state.checked = true
		}
	}

	componentWillUnmount() {
		this.unsubscribe();
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
		const { readOnly } = this.props;
		return (
			<InputGroup>
				<InputGroup.Addon>
					<input type="radio" aria-label="..." onChange={this.setAnswerValue} checked={this.state.checked} />
				</InputGroup.Addon>
				<FormControl type="text" value={this.state.answer} onChange={this.setValue} readOnly={readOnly} />
			</InputGroup>
		);
	}
}