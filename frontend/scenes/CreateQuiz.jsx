import React from 'react';
import store from '../main.js'
import { Button, PageHeader, Grid, Row, Col, InputGroup, FormGroup, FormControl } from 'react-bootstrap'
import QuizQuestionTemplate from '../components/QuizQuestionTemplate.jsx'
import { createStore } from 'redux';
import quiz from '../reducers/quiz.js';
var ajax = require('../components/AjaxCall.jsx');

var quizStore = createStore(quiz);

class CreateQuiz extends React.Component {
  constructor(props) {
    super(props);
      // ajax("POST", "/accounts/postquiz", {"quizname": quiz.quizName ,"instructor_id": quiz.username},
      // function(success) {
      //   console.log(success);  
      //   var quiz = JSON.parse(success)['questions'];
      //   self.setState({'questionCount' : quiz.length+1})
      //   self.setState({'questionsHTML': quiz});
      // },
      // function(error) {
      //   console.log(error);
      // }
    this.state = {questionCount: 1, quizName: ''};

    quizStore.subscribe(() => {
      var state = quizStore.getState()
      this.setState({
        quizName: state.quizName,
        questionCount: state.questions.length
      })
    });

    this.setQuizName = this.setQuizName.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.saveQuiz = this.saveQuiz.bind(this);
  }

  setQuizName(event) {
    quizStore.dispatch({
      type: 'SETQUIZNAME',
      quizName: event.target.value
    })
  }

  addQuestion() {
    quizStore.dispatch({
      type: 'ADDQUESTION'
    })
	}

	removeQuestion() {
		quizStore.dispatch({
      type: 'DELETEQUESTION'
    })
	}

  saveQuiz() {
    console.log(quizStore.getState())
  }

  render() {
    var questions = [];
    for (var i = 0; i < this.state.questionCount; i++) {
      questions.push(<QuizQuestionTemplate questionCount={i} name={"question" + i} key={i} />);
    }
    
    return (
       <div>
          <PageHeader>Create a quiz!</PageHeader>
          <FormControl bsSize="lg" type="text" value={this.quizName} name="quizName" placeholder="Quiz Name" onChange={this.setQuizName} />
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

export {quizStore, CreateQuiz}
