import React from 'react';
import { FormGroup, FormControl, Col, Button } from 'react-bootstrap'
import AnswerInput from './AnswerInput.jsx'
import { quizStore } from './Quiz.jsx'

export default class QuizQuestionTemplate extends React.Component {
	constructor(props) {
		super(props);
		this.addAnswer = this.addAnswer.bind(this);
		this.removeAnswer = this.removeAnswer.bind(this);
		this.setValue = this.setValue.bind(this);

		const questionCount = this.props.questionCount
		var currState = quizStore.getState()
		if (currState.quizName.length > 0) {
			this.state = { count: currState.questions[questionCount].answers.length,  question: currState.questions[questionCount].question }
		} else {
			this.state = { count: 2, question: ''}
		}

		this.unsubscribe = quizStore.subscribe(() => {
			var state = quizStore.getState()
			if (questionCount >= state.questions.length)
				return
			console.log(state.questions[questionCount].question)
			this.setState({
				count: state.questions[questionCount].answers.length,
				question: state.questions[questionCount].question
			})
		});
	}

	componentWillUnmount() {
		this.unsubscribe()
	}

	addAnswer() {
		quizStore.dispatch({
			type: 'ADDANSWER',
			questionCount: this.props.questionCount
		})
	}

	removeAnswer() {
		quizStore.dispatch({
			type: 'REMOVEANSWER',
			questionCount: this.props.questionCount
		})

	}
	setValue(event) {
    quizStore.dispatch({
    	type: 'UPDATEQUESTION',
    	questionCount: this.props.questionCount,
    	question: event.target.value
    })
  }

	render() {
		const { questionCount, readOnly } = this.props;

		var answers = [];
		for (var i = 0; i < this.state.count; i++) {
  		answers.push(<AnswerInput readOnly={readOnly} key={i} questionCount={questionCount} answerCount={i} />);
		}
		return (
			<FormGroup style={{marginBottom: '1cm'}}>
				<h3>Question {questionCount + 1} :</h3>
				<FormControl name="question" onChange={this.setValue} type="text" placeholder="What is your favorite color?" value={this.state.question} readOnly={readOnly} />
				{answers}
				<Col smOffset={5} sm={5} hidden={readOnly}>
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