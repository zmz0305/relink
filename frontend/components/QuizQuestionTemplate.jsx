import React from 'react';
import { FormGroup, FormControl, Col, Button } from 'react-bootstrap'
import AnswerInput from './AnswerInput.jsx'

export default class QuizQuestionTemplate extends React.Component {
	constructor(props) {
		super(props);
		this.addAnswer = this.addAnswer.bind(this);
		this.removeAnswer = this.removeAnswer.bind(this);
		this.setAnswers = this.setAnswers.bind(this);
		this.setValue = this.setValue.bind(this);

		this.state = { count: 2, question:"hi", answers: [null, null], correct: 0 }
	}

	addAnswer() {
		this.setState({count: this.state.count + 1});
	}

	removeAnswer() {
		if (this.state.count != 2)
			this.setState({count: this.state.count - 1});
	}
	setAnswers(answers){
		this.setState({count: answers});
	}
	setValue(event) {
    this.setState({[event.target.name]: event.target.value});
  }

	render() {
		const { name, onChange, questionCount, question, savedAnswers, correctAnswer } = this.props;
		var answers = [
  		<AnswerInput key={0} name={name} checked={true} onChange={onChange} value=''/>
		]; 
		savedAnswersHTML ='';
		if(savedAnswers!=''){
			var savedAnswersHTML =  savedAnswers.map(function(name, index){
					if(index==correctAnswer)
                    	return <AnswerInput key={index} name={name} checked='true' value={name} onChange={onChange}/>;
                    else
                    	return <AnswerInput key={index} name={name} checked='false' value={name} onChange={onChange}/>;
			  });
		 }
		for (var i = 1; i < this.state.count; i++) {
  		answers.push(<AnswerInput key={i} name={name} checked={false} onChange={onChange} value=''/>);
		} 
		 

		return (
			<FormGroup style={{marginBottom: '1cm'}} onChange={() => onChange(0, this.state)}>
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