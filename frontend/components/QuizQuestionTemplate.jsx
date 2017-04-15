import React from 'react';
import { FormGroup, FormControl, Col, Button } from 'react-bootstrap'
import AnswerInput from './AnswerInput.jsx'
import { quizStore } from '../scenes/CreateQuiz.jsx'

export default class QuizQuestionTemplate extends React.Component {
	constructor(props) {
		super(props);
		this.addAnswer = this.addAnswer.bind(this);
		this.removeAnswer = this.removeAnswer.bind(this);
		this.setAnswers = this.setAnswers.bind(this);
		this.setValue = this.setValue.bind(this);

		this.state = { count: 2,  question: '' }

		const questionCount = this.props.questionCount
		quizStore.subscribe(() => {
			var state = quizStore.getState()
			this.setState({
				count: state.questions[questionCount].answers.length,
				question: state.questions[questionCount].question
			})
		});
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
	setAnswers(answers){
		this.setState({count: answers});
	}
	setValue(event) {
    quizStore.dispatch({
    	type: 'UPDATEQUESTION',
    	questionCount: this.props.questionCount,
    	question: event.target.value
    })
  }

	render() {
		const { questionCount } = this.props;

		var answers = [
  		<AnswerInput key={0} questionCount={questionCount} answerCount={0}  checked={true} />
		];
		for (var i = 1; i < this.state.count; i++) {
  		answers.push(<AnswerInput key={i} questionCount={questionCount} answerCount={i} />);
		}

		return (
			<FormGroup style={{marginBottom: '1cm'}}>
				<h3>Question {questionCount + 1} :</h3>
				<FormControl name="question" onChange={this.setValue} type="text" placeholder="What is your favorite color?" value={question} />
				{savedAnswersHTML}
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