import React from 'react';
import store from '../main.js'
import { Button, PageHeader, Grid, Row, Col, InputGroup, FormGroup, FormControl } from 'react-bootstrap'
import QuizQuestionTemplate from '../components/QuizQuestionTemplate.jsx'

export default class CreateQuiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {questionCount: 1, questions: [null]};

    this.setValue = this.setValue.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.saveQuiz = this.saveQuiz.bind(this);
  }

  setValue(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  setQuestion(index, question) {
    var newArray = this.state.questions.slice();
    newArray[index] = question;
    this.setState({questions: newArray});
  }

  addQuestion() {
    var newArray = this.state.questions.concat([null]);
		this.setState({questionCount: this.state.questionCount + 1, questions: newArray});
	}

	removeQuestion() {
		if (this.state.questionCount != 1) {
      var newArray = this.state.questions.slice(0,-1)
			this.setState({questionCount: this.state.questionCount - 1, questions: newArray});
    }
	}

  saveQuiz() {
    console.log(this.state);
  }

  render() {
    var questions = [];
    for (var i = 0; i < this.state.questionCount; i++) {
      questions.push(<QuizQuestionTemplate questionCount={i} name={"question" + i} key={i} onChange={this.setQuestion} />);
    }

    return (
       <div>
          <PageHeader>Create a quiz!</PageHeader>
          <FormControl bsSize="lg" type="text" placeholder="Quiz Title"  />

  		    {questions}
  		    <Col smOffset={5} sm={5}>
  	        <Button bsStyle="primary" onClick={this.removeQuestion} >
  	          - Question
  	        </Button>
  	        <Button bsStyle="primary" onClick={this.addQuestion} >
  	          + Question
  	        </Button>
  	      </Col>
          <Button bsStyle="primary" onClick={this.saveQuiz}>Save Quiz</Button>
       </div>
    ); 
  }
};
